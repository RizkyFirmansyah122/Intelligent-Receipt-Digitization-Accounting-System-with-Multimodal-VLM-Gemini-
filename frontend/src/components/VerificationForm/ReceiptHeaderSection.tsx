'use client';

import React from 'react';
import { ReceiptData } from '@/types/receipt';
import { FormInput, FormSelect } from '@/components/base';

interface ReceiptHeaderSectionProps {
  data: ReceiptData;
  onHeaderChange: (field: keyof ReceiptData, value: any) => void;
}

export const ReceiptHeaderSection: React.FC<ReceiptHeaderSectionProps> = ({
  data,
  onHeaderChange,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-50/70 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <FormInput
        label="Nomor Faktur / Nota"
        placeholder="Contoh: F-1002"
        value={data.nomor_faktur}
        onChange={(e) => onHeaderChange('nomor_faktur', e.target.value)}
      />

      <FormInput
        label="Tanggal"
        placeholder="DD/MM/YYYY"
        value={data.tanggal}
        onChange={(e) => onHeaderChange('tanggal', e.target.value)}
      />

      <FormInput
        label="Nama Pelanggan"
        placeholder="Contoh: Toko Berkah / Bpk. Rudi"
        value={data.nama_pelanggan}
        onChange={(e) => onHeaderChange('nama_pelanggan', e.target.value)}
      />

      <FormSelect
        label="Kategori Pelanggan"
        value={data.kategori_pelanggan}
        onChange={(e) => onHeaderChange('kategori_pelanggan', e.target.value)}
        options={[
          { value: 'Umum', label: 'Umum (Reguler)' },
          { value: 'Reseller', label: 'Reseller (Buku Piutang)' },
        ]}
      />
    </div>
  );
};
