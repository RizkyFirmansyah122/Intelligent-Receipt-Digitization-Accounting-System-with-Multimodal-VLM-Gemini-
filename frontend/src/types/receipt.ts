export interface ItemBarang {
  nama_barang: string;
  banyaknya: number;
  harga_satuan: number;
  jumlah_subtotal: number;
  kategori_item?: string;
}

export interface CarryOverDebt {
  ada_nota_lama: boolean;
  nomor_faktur_lama?: string | null;
  tanggal_nota_lama?: string | null;
  nominal: number;
  keterangan_teks_asli?: string | null;
}

export interface ReceiptData {
  id_transaksi?: string | null;
  nomor_faktur: string;
  tanggal: string;
  nama_pelanggan: string;
  kategori_pelanggan: string;
  items: ItemBarang[];
  subtotal_baru: number;
  carry_over_piutang: CarryOverDebt;
  piutang_lama: number;
  grand_total: number;
  uang_muka_dp: number;
  sisa_tagihan: number;
  status_pembayaran: string;
  catatan_tambahan?: string | null;
  url_foto_nota?: string | null;
}

export interface ExtractResponse {
  success: boolean;
  data: ReceiptData;
  temp_file_id: string;
  preview_url: string;
  error?: string;
}
