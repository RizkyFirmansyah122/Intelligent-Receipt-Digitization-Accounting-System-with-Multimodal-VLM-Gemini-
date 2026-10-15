"""
Google Services (Sheets API v4 & Drive API v3) for Pelangi Frame Receipt Intelligence System.
Uses gspread and google-api-python-client with service account credentials.
Supports both local file-based credentials and production Base64 environment variable credentials.
"""

import os
import re
import io
import json
import base64
import uuid
import logging
from typing import Optional, Dict, Any, Tuple
from datetime import datetime
from dotenv import load_dotenv

import gspread
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseUpload

from app.schemas.receipt import ReceiptSchema

load_dotenv()
logger = logging.getLogger(__name__)

SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive"
]


class GoogleService:
    def __init__(self):
        self.spreadsheet_id = os.getenv("SPREADSHEET_ID")
        self.raw_folder_id = os.getenv("DRIVE_FOLDER_ID")

        if not self.spreadsheet_id:
            raise ValueError("SPREADSHEET_ID tidak dikonfigurasi di environment variable.")
        if not self.raw_folder_id:
            raise ValueError("DRIVE_FOLDER_ID tidak dikonfigurasi di environment variable.")

        # Inisialisasi Kredensial Google (Dukungan Dual-Mode: File Lokal & Base64 Cloud)
        self.credentials = self._load_credentials()

        # Extract folder ID jika user memasukkan link folder Drive
        self.folder_id = self._extract_drive_folder_id(self.raw_folder_id)

        # Inisialisasi Google Drive Client & gspread
        self.drive_service = build("drive", "v3", credentials=self.credentials)
        self.gc = gspread.authorize(self.credentials)
        self.spreadsheet = self.gc.open_by_key(self.spreadsheet_id)

    def _load_credentials(self) -> Credentials:
        """
        Memuat kredensial Google Service Account:
        1. Metode Cloud / Production: Membaca string Base64 dari env GOOGLE_CREDENTIALS_BASE64.
        2. Metode Lokal: Membaca file fisik dari path GOOGLE_APPLICATION_CREDENTIALS atau credentials.json.
        """
        creds_base64 = os.getenv("GOOGLE_CREDENTIALS_BASE64")
        if creds_base64:
            try:
                decoded_bytes = base64.b64decode(creds_base64.strip())
                service_account_info = json.loads(decoded_bytes.decode("utf-8"))
                logger.info("Menggunakan kredensial Google dari environment variable GOOGLE_CREDENTIALS_BASE64 (Cloud Mode).")
                return Credentials.from_service_account_info(
                    service_account_info,
                    scopes=SCOPES
                )
            except Exception as e:
                logger.error(f"Gagal mendekode GOOGLE_CREDENTIALS_BASE64: {e}")
                raise ValueError(f"Kredensial GOOGLE_CREDENTIALS_BASE64 tidak valid: {str(e)}")

        # Metode Lokal: File Kredensial Fisik
        creds_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS") or "credentials.json"
        
        # Cari file jika relative path
        if not os.path.isabs(creds_path):
            base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
            candidates = [
                os.path.join(base_dir, creds_path),
                os.path.join(base_dir, "credentials.json"),
                os.path.join(os.getcwd(), creds_path),
            ]
            for cand in candidates:
                if os.path.exists(cand):
                    creds_path = cand
                    break

        if os.path.exists(creds_path):
            logger.info(f"Menggunakan kredensial Google dari file lokal: {creds_path}")
            return Credentials.from_service_account_file(
                creds_path,
                scopes=SCOPES
            )

        raise FileNotFoundError(
            "Kredensial Google Service Account tidak ditemukan! "
            "Untuk production di Render/Koyeb, set environment variable GOOGLE_CREDENTIALS_BASE64. "
            "Untuk lokal, letakkan file credentials.json di folder backend atau set GOOGLE_APPLICATION_CREDENTIALS."
        )

    @staticmethod
    def _extract_drive_folder_id(folder_string: str) -> str:
        """Ekstrak ID folder dari string ID langsung atau URL Google Drive."""
        folder_string = folder_string.strip().strip('"').strip("'")
        match = re.search(r"folders/([a-zA-Z0-9_-]+)", folder_string)
        if match:
            return match.group(1)
        return folder_string

    def upload_nota_to_drive(self, file_bytes: bytes, filename: str, mime_type: str = "image/jpeg") -> str:
        """
        Mengunggah file foto nota ke Google Drive di folder DRIVE_FOLDER_ID.
        Menetapkan permission 'anyone with link' sebagai viewer, lalu mengembalikan webViewLink.
        """
        try:
            # Metadata file di Drive
            file_metadata = {
                "name": filename,
                "parents": [self.folder_id]
            }

            media = MediaIoBaseUpload(
                io.BytesIO(file_bytes),
                mimetype=mime_type,
                resumable=True
            )

            # Upload file
            created_file = self.drive_service.files().create(
                body=file_metadata,
                media_body=media,
                fields="id, name, webViewLink, webContentLink"
            ).execute()

            file_id = created_file.get("id")
            web_view_link = created_file.get("webViewLink")

            # Atur permission agar bisa dilihat siapapun yang punya link
            try:
                self.drive_service.permissions().create(
                    fileId=file_id,
                    body={"type": "anyone", "role": "viewer"}
                ).execute()
            except Exception as perm_err:
                logger.warning(f"Gagal mengatur permission publik drive: {perm_err}")

            logger.info(f"Berhasil upload foto nota ke Drive: {filename} (ID: {file_id})")
            return web_view_link or f"https://drive.google.com/file/d/{file_id}/view"

        except Exception as e:
            logger.error(f"Gagal upload nota ke Google Drive: {e}", exc_info=True)
            raise RuntimeError(f"Gagal upload nota ke Google Drive: {str(e)}")

    def _get_reseller_last_balance(self, sheet_reseller, reseller_name: str) -> float:
        """
        Mencari total saldo piutang terakhir untuk nama reseller tertentu dari worksheet Buku_Piutang_Reseller.
        """
        try:
            records = sheet_reseller.get_all_records()
            last_balance = 0.0
            clean_name = reseller_name.strip().lower()
            
            for row in records:
                # Kolom nama_reseller dan total_saldo_piutang
                row_name = str(row.get("nama_reseller", "")).strip().lower()
                if row_name == clean_name:
                    saldo_str = str(row.get("total_saldo_piutang", "0")).replace(".", "").replace(",", ".")
                    try:
                        last_balance = float(saldo_str)
                    except ValueError:
                        pass
            return last_balance
        except Exception as e:
            logger.warning(f"Error membaca saldo piutang reseller sebelumnya: {e}")
            return 0.0

    def save_to_sheets(self, receipt_data: ReceiptSchema, drive_url: Optional[str] = None) -> Dict[str, Any]:
        """
        Menyimpan data transaksi ke 3 lembar kerja (worksheet):
        1. Transaksi_Header
        2. Detail_Barang
        3. Buku_Piutang_Reseller (jika pelanggan Reseller atau terdapat sisa tagihan/piutang lama)
        """
        # Pastikan data telah direkonsiliasi
        receipt_data.reconcile()

        if drive_url:
            receipt_data.url_foto_nota = drive_url

        # Generate id_transaksi jika belum ada
        if not receipt_data.id_transaksi:
            date_part = datetime.now().strftime("%Y%m%d")
            receipt_data.id_transaksi = f"TRX-{date_part}-{uuid.uuid4().hex[:6].upper()}"

        results = {
            "id_transaksi": receipt_data.id_transaksi,
            "nomor_faktur": receipt_data.nomor_faktur,
            "header_saved": False,
            "items_count": len(receipt_data.items),
            "reseller_debt_recorded": False,
            "drive_url": receipt_data.url_foto_nota
        }

        # -------------------------------------------------------------
        # 1. Tulis ke Lembar Kerja `Transaksi_Header`
        # -------------------------------------------------------------
        header_sheet = self.spreadsheet.worksheet("Transaksi_Header")
        header_row = [
            receipt_data.id_transaksi,
            receipt_data.nomor_faktur,
            receipt_data.tanggal,
            receipt_data.nama_pelanggan,
            receipt_data.kategori_pelanggan,
            receipt_data.subtotal_baru,
            receipt_data.piutang_lama,
            receipt_data.grand_total,
            receipt_data.uang_muka_dp,
            receipt_data.sisa_tagihan,
            receipt_data.status_pembayaran,
            receipt_data.url_foto_nota or ""
        ]
        header_sheet.append_row(header_row, value_input_option="USER_ENTERED")
        results["header_saved"] = True
        logger.info(f"Header transaksi berhasil disimpan: {receipt_data.id_transaksi}")

        # -------------------------------------------------------------
        # 2. Tulis ke Lembar Kerja `Detail_Barang`
        # -------------------------------------------------------------
        if receipt_data.items:
            detail_sheet = self.spreadsheet.worksheet("Detail_Barang")
            item_rows = []
            for item in receipt_data.items:
                item_rows.append([
                    receipt_data.nomor_faktur,
                    item.nama_barang,
                    item.banyaknya,
                    item.harga_satuan,
                    item.jumlah_subtotal,
                    item.kategori_item or "Bingkai"
                ])
            detail_sheet.append_rows(item_rows, value_input_option="USER_ENTERED")
            logger.info(f"Sebanyak {len(item_rows)} detail barang disimpan untuk faktur: {receipt_data.nomor_faktur}")

        # -------------------------------------------------------------
        # 3. Tulis ke Lembar Kerja `Buku_Piutang_Reseller`
        # -------------------------------------------------------------
        is_reseller = receipt_data.kategori_pelanggan.strip().lower() == "reseller"
        has_old_debt = receipt_data.piutang_lama > 0
        has_unpaid_balance = receipt_data.sisa_tagihan > 0

        # Jika transaksi melibatkan reseller, piutang lama, atau ada sisa tagihan berjalan
        if is_reseller or has_old_debt or (has_unpaid_balance and is_reseller):
            reseller_sheet = self.spreadsheet.worksheet("Buku_Piutang_Reseller")
            last_balance = self._get_reseller_last_balance(reseller_sheet, receipt_data.nama_pelanggan)

            # Hitung mutasi saldo piutang:
            # Jika reseller sudah punya riwayat piutang di buku:
            # - Tagihan baru menambah hutang sebesar (subtotal_baru - DP)
            # Namun jika ini pencatatan pertama atau membawa nota lama yang belum tercatat:
            if last_balance == 0.0 and has_old_debt:
                # Bawaan nota lama belum ada di sistem, saldo akhir menjadi sisa_tagihan
                perubahan_saldo = receipt_data.sisa_tagihan
                total_saldo_baru = receipt_data.sisa_tagihan
                keterangan = (
                    f"Faktur #{receipt_data.nomor_faktur} (Bawa Nota Lama #{receipt_data.carry_over_piutang.nomor_faktur_lama or '-'} "
                    f"Rp{receipt_data.piutang_lama:,.0f}, DP Rp{receipt_data.uang_muka_dp:,.0f})"
                )
            elif last_balance > 0.0:
                # Reseller sudah memiliki riwayat saldo berjalan.
                # Perubahan bersih transaksi ini adalah Barang Baru dikurangi Uang Muka (DP)
                perubahan_saldo = receipt_data.subtotal_baru - receipt_data.uang_muka_dp
                total_saldo_baru = last_balance + perubahan_saldo
                keterangan = (
                    f"Transaksi Faktur #{receipt_data.nomor_faktur} (Omzet Baru Rp{receipt_data.subtotal_baru:,.0f}, "
                    f"DP Rp{receipt_data.uang_muka_dp:,.0f})"
                )
            else:
                # Transaksi reseller standar
                perubahan_saldo = receipt_data.sisa_tagihan
                total_saldo_baru = last_balance + perubahan_saldo
                keterangan = f"Faktur #{receipt_data.nomor_faktur} - {receipt_data.status_pembayaran} (DP: Rp{receipt_data.uang_muka_dp:,.0f})"

            tanggal_update = receipt_data.tanggal or datetime.now().strftime("%d/%m/%Y")
            reseller_row = [
                receipt_data.nama_pelanggan,
                receipt_data.nomor_faktur,
                tanggal_update,
                keterangan,
                round(perubahan_saldo, 2),
                round(total_saldo_baru, 2)
            ]
            reseller_sheet.append_row(reseller_row, value_input_option="USER_ENTERED")
            results["reseller_debt_recorded"] = True
            results["total_saldo_piutang"] = round(total_saldo_baru, 2)
            logger.info(f"Mutasi buku piutang reseller berhasil dicatat untuk: {receipt_data.nama_pelanggan}")

        return results


# Singleton instance
_google_service_instance: Optional[GoogleService] = None


def get_google_service() -> GoogleService:
    global _google_service_instance
    if _google_service_instance is None:
        _google_service_instance = GoogleService()
    return _google_service_instance
