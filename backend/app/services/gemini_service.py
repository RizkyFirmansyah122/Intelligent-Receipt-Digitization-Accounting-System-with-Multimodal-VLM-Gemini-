"""
Gemini VLM Service for Pelangi Frame Receipt Intelligence System.
Uses google-genai SDK with structured output (ReceiptSchema).
"""

import os
import io
import logging
from typing import Optional
from dotenv import load_dotenv
from google import genai
from google.genai import types
from PIL import Image

from app.schemas.receipt import ReceiptSchema

load_dotenv()
logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """
Anda adalah AI Auditor & Ekstraktor Dokumen Tingkat Ahli untuk bengkel bingkai kaca & cermin "Pelangi Frame".
Tugas Anda adalah membaca dan mendigitalkan nota transaksi (cetak dan/atau tulisan tangan kasir) ke dalam format data terstruktur dengan tingkat akurasi 100%.

ATURAN KHUSUS & REKONSILIASI AKUNTANSI WAJIB:
1. Pemisahan Transaksi Baru vs Piutang Bawaan (Debt Carry-Over):
   - Perhatikan baris-baris pada nota. Jika menemukan baris dengan pola tulisan tangan seperti:
     "NOTA LAMA [No Faktur] ([Tanggal]) [Nominal]" atau variasinya (misal: "Nota Lama 0891 (12/10) 150.000", "Piutang Nota 45 200rb"):
     -> Baris ini BUKAN barang fisik baru!
     -> DILARANG KERAS memasukkan baris ini ke dalam daftar `items`.
     -> Masukkan data ini ke field `carry_over_piutang` (dan `piutang_lama`).
     -> Pelanggan yang memiliki nota lama secara otomatis berkategori "Reseller".

2. Daftar Barang Baru (`items`):
   - Hanya berisi barang fisik atau jasa baru yang dibeli pada transaksi ini (misal: Bingkai Minimalis 40x60, Cermin Bevel 50x70, Kaca Polos 3mm, Pasang Gantungan).
   - Pastikan membaca kuantitas (`banyaknya`), harga satuan (`harga_satuan`), dan subtotal (`jumlah_subtotal`) dengan teliti.
   - Hilangkan titik ribuan atau singkatan seperti 'rb'/'k' (misal: '50.000' -> 50000, '25k' -> 25000).

3. Formula Rekonsiliasi Finansial:
   - `subtotal_baru` = Total penjumlahan `jumlah_subtotal` dari semua barang di `items`.
   - `piutang_lama` = Nominal dari nota lama (`carry_over_piutang.nominal`), jika tidak ada = 0.
   - `grand_total` = `subtotal_baru` + `piutang_lama`.
   - `uang_muka_dp` = Nominal uang muka atau DP yang dibayarkan saat nota dibuat (cari tulisan 'DP', 'Uang Muka', 'Titip', 'Bayar'). Jika tidak ada pembayaran/DP di muka, nilainya 0.
   - `sisa_tagihan` = `grand_total` - `uang_muka_dp`.
   - `status_pembayaran` = Jika `sisa_tagihan` <= 0 maka "Lunas", jika `sisa_tagihan` > 0 maka "DP (Belum Lunas)".

4. Metadata Nota:
   - Nomor Faktur / Nota: Baca nomor nota cetak di bagian atas atau nomor faktur tulisan tangan.
   - Tanggal: Formatkan dalam bentuk DD/MM/YYYY atau YYYY-MM-DD.
   - Nama Pelanggan: Baca nama yang tertulis di kolom Kepada / Yth / Nama Toko.

Lakukan pembacaan tulisan tangan secara cermat (bedakan angka 0, 6, 8, tanda titik ribuan, atau coretan).
Keluarkan data HANYA sesuai skema JSON yang ditentukan.
"""


class GeminiReceiptService:
    def __init__(self, api_key: Optional[str] = None, model_name: Optional[str] = None):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY tidak ditemukan di environment variable.")
        
        # Model default dari env atau fallback ke gemini-flash-lite-latest
        self.model_name = model_name or os.getenv("GEMINI_MODEL", "gemini-flash-lite-latest")
        self.client = genai.Client(api_key=self.api_key)

    def extract_receipt(self, file_bytes: bytes, mime_type: str = "image/jpeg") -> ReceiptSchema:
        """
        Mengekstrak data nota dari byte gambar menggunakan Gemini VLM Structured Outputs.
        """
        # Normalisasi mime_type jika perlu
        if mime_type not in ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"]:
            mime_type = "image/jpeg"

        # Validasi bahwa bytes adalah gambar yang valid
        try:
            image = Image.open(io.BytesIO(file_bytes))
            # Convert jika paletted/RGBA ke RGB untuk JPEG jika diperlukan
            if image.format:
                format_lower = image.format.lower()
                if format_lower == "png":
                    mime_type = "image/png"
                elif format_lower in ["jpg", "jpeg"]:
                    mime_type = "image/jpeg"
                elif format_lower == "webp":
                    mime_type = "image/webp"
        except Exception as e:
            logger.warning(f"Image pre-validation warning: {e}")

        # Panggil Gemini API dengan Structured Output
        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=[
                    types.Part.from_bytes(data=file_bytes, mime_type=mime_type),
                    "Silakan ekstrak seluruh informasi dari nota fisik ini sesuai aturan akuntansi Pelangi Frame."
                ],
                config=types.GenerateContentConfig(
                    system_instruction=SYSTEM_PROMPT,
                    response_mime_type="application/json",
                    response_schema=ReceiptSchema,
                    temperature=0.1,
                )
            )

            # Structured output parsing
            if response.parsed and isinstance(response.parsed, ReceiptSchema):
                receipt_obj: ReceiptSchema = response.parsed
            else:
                receipt_obj = ReceiptSchema.model_validate_json(response.text)

            # Lakukan rekonsiliasi matematis untuk memastikan konsistensi
            receipt_obj.reconcile()
            return receipt_obj

        except Exception as e:
            logger.error(f"Gagal melakukan ekstraksi nota dengan Gemini: {str(e)}", exc_info=True)
            raise RuntimeError(f"Gagal memproses gambar dengan Gemini: {str(e)}")


# Singleton instance
_gemini_service_instance: Optional[GeminiReceiptService] = None


def get_gemini_service() -> GeminiReceiptService:
    global _gemini_service_instance
    if _gemini_service_instance is None:
        _gemini_service_instance = GeminiReceiptService()
    return _gemini_service_instance
