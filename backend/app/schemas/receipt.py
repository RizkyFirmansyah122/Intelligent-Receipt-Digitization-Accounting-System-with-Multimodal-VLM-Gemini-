"""
Pydantic Schemas for Pelangi Frame Receipt Intelligence System.
Domain rules:
1. Pemisahan Transaksi Baru vs Piutang Bawaan (Debt Carry-Over):
   - Jika pada nota ada pola 'NOTA LAMA [No Faktur] ([Tanggal]) [Nominal]',
     baris ini dipisahkan dari daftar barang fisik baru (`items`).
   - Nominal nota lama TIDAK BOLEH dihitung sebagai omzet barang baru.
2. Formula Rekonsiliasi:
   - Subtotal Barang Baru = Sum(Banyaknya * Harga Satuan)
   - Grand Total = Subtotal Barang Baru + Piutang Nota Lama
   - Sisa Tagihan = Grand Total - Uang Muka (DP)
   - Status Pembayaran: Jika Sisa <= 0 "Lunas", jika tidak "DP (Belum Lunas)".
"""

from typing import List, Optional
from pydantic import BaseModel, Field


class ItemBarang(BaseModel):
    nama_barang: str = Field(
        ...,
        description="Nama atau deskripsi spesifik barang / jasa, seperti ukuran bingkai, cermin, jenis kaca, dll."
    )
    banyaknya: float = Field(
        ...,
        description="Jumlah kuantitas barang fisik (contoh: 1, 2, 5.5)."
    )
    harga_satuan: float = Field(
        ...,
        description="Harga satuan per unit dalam Rupiah tanpa simbol mata uang."
    )
    jumlah_subtotal: float = Field(
        ...,
        description="Subtotal untuk item ini (banyaknya * harga_satuan) dalam Rupiah."
    )
    kategori_item: Optional[str] = Field(
        default="Bingkai",
        description="Kategori item, contoh: Bingkai, Kaca, Cermin, Aksesoris, Jasa, Lainnya."
    )


class CarryOverDebt(BaseModel):
    ada_nota_lama: bool = Field(
        default=False,
        description="Set True jika nota fisik memiliki catatan piutang bawaan dari nota lama."
    )
    nomor_faktur_lama: Optional[str] = Field(
        default=None,
        description="Nomor faktur/nota lama yang tercantum (contoh: '0891', 'NF-102')."
    )
    tanggal_nota_lama: Optional[str] = Field(
        default=None,
        description="Tanggal nota lama jika dicatat (contoh: '12/10', '2026-10-01')."
    )
    nominal: float = Field(
        default=0.0,
        description="Jumlah piutang lama yang dibawa ke nota ini dalam Rupiah."
    )
    keterangan_teks_asli: Optional[str] = Field(
        default=None,
        description="Teks tulisan tangan asli pada nota, misal: 'NOTA LAMA 0891 (12/10) 150.000'."
    )


class ReceiptSchema(BaseModel):
    id_transaksi: Optional[str] = Field(
        default=None,
        description="ID unik transaksi sistem, misal: TRX-20261014-001."
    )
    nomor_faktur: str = Field(
        ...,
        description="Nomor faktur atau nota yang tercetak/tertulis di nota saat ini."
    )
    tanggal: str = Field(
        ...,
        description="Tanggal transaksi di nota, format DD/MM/YYYY atau YYYY-MM-DD."
    )
    nama_pelanggan: str = Field(
        ...,
        description="Nama pembeli atau pelanggan (contoh: 'Toko Berkah', 'Pak Joko')."
    )
    kategori_pelanggan: str = Field(
        default="Umum",
        description="Kategori pelanggan: 'Reseller' (biasanya memiliki nota lama/piutang berjalan) atau 'Umum'."
    )
    items: List[ItemBarang] = Field(
        default_factory=list,
        description="Daftar barang fisik baru yang dibeli. JANGAN masukkan baris NOTA LAMA ke dalam daftar ini!"
    )
    subtotal_baru: float = Field(
        default=0.0,
        description="Total harga barang baru: Sum(banyaknya * harga_satuan)."
    )
    carry_over_piutang: CarryOverDebt = Field(
        default_factory=CarryOverDebt,
        description="Catatan piutang bawaan nota lama jika ada."
    )
    piutang_lama: float = Field(
        default=0.0,
        description="Nominal piutang lama (harus sesuai dengan carry_over_piutang.nominal)."
    )
    grand_total: float = Field(
        default=0.0,
        description="Grand total tagihan = subtotal_baru + piutang_lama."
    )
    uang_muka_dp: float = Field(
        default=0.0,
        description="Nominal uang muka (DP) atau pembayaran yang diterima di muka dalam Rupiah."
    )
    sisa_tagihan: float = Field(
        default=0.0,
        description="Sisa tagihan yang belum dibayar = grand_total - uang_muka_dp."
    )
    status_pembayaran: str = Field(
        default="DP (Belum Lunas)",
        description="Status pembayaran: 'Lunas' jika sisa_tagihan <= 0, atau 'DP (Belum Lunas)'."
    )
    catatan_tambahan: Optional[str] = Field(
        default=None,
        description="Catatan tambahan yang ada di nota (keterangan pengerjaan, warna bingkai, dll)."
    )
    url_foto_nota: Optional[str] = Field(
        default=None,
        description="Tautan (URL) ke Google Drive tempat foto nota disimpan."
    )

    def reconcile(self) -> "ReceiptSchema":
        """
        Hitung ulang & selaraskan semua formula akuntansi:
        - subtotal_baru = sum(item.jumlah_subtotal)
        - piutang_lama = carry_over_piutang.nominal
        - grand_total = subtotal_baru + piutang_lama
        - sisa_tagihan = grand_total - uang_muka_dp
        - status_pembayaran = Lunas jika sisa <= 0 else DP (Belum Lunas)
        """
        # Hitung subtotal tiap item
        calculated_subtotal = 0.0
        for item in self.items:
            if item.jumlah_subtotal <= 0 and item.banyaknya > 0 and item.harga_satuan > 0:
                item.jumlah_subtotal = round(item.banyaknya * item.harga_satuan, 2)
            calculated_subtotal += item.jumlah_subtotal

        self.subtotal_baru = round(calculated_subtotal, 2)
        
        # Selaraskan piutang lama
        if self.carry_over_piutang and self.carry_over_piutang.ada_nota_lama:
            self.piutang_lama = round(self.carry_over_piutang.nominal, 2)
        elif self.piutang_lama > 0:
            self.carry_over_piutang.ada_nota_lama = True
            self.carry_over_piutang.nominal = self.piutang_lama

        self.grand_total = round(self.subtotal_baru + self.piutang_lama, 2)
        self.sisa_tagihan = round(self.grand_total - self.uang_muka_dp, 2)
        
        if self.sisa_tagihan <= 0:
            self.status_pembayaran = "Lunas"
            self.sisa_tagihan = 0.0
        else:
            self.status_pembayaran = "DP (Belum Lunas)"

        return self
