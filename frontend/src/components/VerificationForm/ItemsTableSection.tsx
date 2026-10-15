'use client';

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { ItemBarang } from '@/types/receipt';
import { FormInput, FormSelect } from '@/components/base';

interface ItemsTableSectionProps {
  items: ItemBarang[];
  onItemChange: (index: number, field: keyof ItemBarang, value: any) => void;
  onAddItem: () => void;
  onDeleteItem: (index: number) => void;
}

export const ItemsTableSection: React.FC<ItemsTableSectionProps> = ({
  items,
  onItemChange,
  onAddItem,
  onDeleteItem,
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide flex items-center gap-2">
          Daftar Barang Fisik Baru
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium border border-slate-200 dark:border-slate-700">
            {items.length} Item
          </span>
        </h4>
        <button
          type="button"
          onClick={onAddItem}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium shadow-2xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          Tambah Baris
        </button>
      </div>

      <div className="overflow-x-auto border border-slate-200/90 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 shadow-2xs transition-colors">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 dark:bg-slate-950/80 text-slate-500 dark:text-slate-400 uppercase font-semibold tracking-wider text-[11px] border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="py-2.5 px-3">Nama / Ukuran Barang</th>
              <th className="py-2.5 px-3 w-20">Banyak</th>
              <th className="py-2.5 px-3 w-32">Harga Satuan (Rp)</th>
              <th className="py-2.5 px-3 w-32">Subtotal (Rp)</th>
              <th className="py-2.5 px-3 w-32">Kategori</th>
              <th className="py-2.5 px-2 w-10 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {items.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                <td className="p-2 align-middle">
                  <FormInput
                    placeholder="Nama bingkai / kaca..."
                    value={item.nama_barang}
                    onChange={(e) => onItemChange(idx, 'nama_barang', e.target.value)}
                  />
                </td>
                <td className="p-2 align-middle">
                  <FormInput
                    type="number"
                    step="any"
                    value={item.banyaknya}
                    onChange={(e) => onItemChange(idx, 'banyaknya', e.target.value)}
                    className="text-right"
                  />
                </td>
                <td className="p-2 align-middle">
                  <FormInput
                    type="number"
                    value={item.harga_satuan}
                    onChange={(e) => onItemChange(idx, 'harga_satuan', e.target.value)}
                    className="font-mono text-right"
                  />
                </td>
                <td className="p-2 align-middle">
                  <FormInput
                    type="number"
                    value={item.jumlah_subtotal}
                    onChange={(e) => onItemChange(idx, 'jumlah_subtotal', e.target.value)}
                    className="font-mono font-semibold bg-slate-50 dark:bg-slate-900 text-right text-slate-800 dark:text-slate-200"
                    disabled
                  />
                </td>
                <td className="p-2 align-middle">
                  <FormSelect
                    value={item.kategori_item || 'Bingkai'}
                    onChange={(e) => onItemChange(idx, 'kategori_item', e.target.value)}
                    options={[
                      { value: 'Bingkai', label: 'Bingkai' },
                      { value: 'Kaca', label: 'Kaca' },
                      { value: 'Cermin', label: 'Cermin' },
                      { value: 'Aksesoris', label: 'Aksesoris' },
                      { value: 'Jasa', label: 'Jasa' },
                    ]}
                  />
                </td>
                <td className="p-2 text-center align-middle">
                  <button
                    type="button"
                    onClick={() => onDeleteItem(idx)}
                    className="p-1.5 rounded-md text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors inline-flex items-center justify-center"
                    title="Hapus baris"
                    aria-label={`Hapus item ${idx + 1}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-6 text-slate-400 dark:text-slate-500 text-xs">
                  Tidak ada barang fisik yang tercatat. Klik "Tambah Baris" untuk menambahkan item.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
