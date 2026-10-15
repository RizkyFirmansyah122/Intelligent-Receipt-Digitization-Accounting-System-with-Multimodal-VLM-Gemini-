'use client';

import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { CarryOverDebt } from '@/types/receipt';
import { FormInput } from '@/components/base/FormInput';

interface CarryOverDebtSectionProps {
  carryOverDebt: CarryOverDebt;
  onDebtChange: (field: keyof CarryOverDebt, value: any) => void;
  onCategoryChange: (category: string) => void;
}

export const CarryOverDebtSection: React.FC<CarryOverDebtSectionProps> = ({
  carryOverDebt,
  onDebtChange,
  onCategoryChange,
}) => {
  return (
    <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 rounded-lg p-4 transition-colors">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-4 h-4 text-slate-700 dark:text-slate-300 flex-shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
              Pemisahan Piutang Bawaan (Nota Lama)
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Aturan Khusus: Entri ini dipisahkan dari daftar barang fisik & TIDAK dihitung sebagai omzet baru.
            </p>
          </div>
        </div>

        {/* Toggle Switch "Ada Nota Lama" */}
        <label className="relative inline-flex items-center cursor-pointer select-none">
          <input
            type="checkbox"
            checked={carryOverDebt.ada_nota_lama}
            onChange={(e) => {
              const checked = e.target.checked;
              onDebtChange('ada_nota_lama', checked);
              if (checked) {
                onCategoryChange('Reseller');
              }
            }}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600"></div>
          <span className="ml-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
            Ada Nota Lama
          </span>
        </label>
      </div>

      {carryOverDebt.ada_nota_lama && (
        <div className="mt-3.5 grid grid-cols-1 md:grid-cols-4 gap-3 pt-3.5 border-t border-slate-200/80 dark:border-slate-800/80">
          <FormInput
            label="No. Faktur Lama"
            placeholder="Contoh: 0891"
            value={carryOverDebt.nomor_faktur_lama || ''}
            onChange={(e) => onDebtChange('nomor_faktur_lama', e.target.value)}
          />
          <FormInput
            label="Tanggal Nota Lama"
            placeholder="Contoh: 12/10"
            value={carryOverDebt.tanggal_nota_lama || ''}
            onChange={(e) => onDebtChange('tanggal_nota_lama', e.target.value)}
          />
          <FormInput
            label="Nominal Piutang Lama (Rp)"
            type="number"
            value={carryOverDebt.nominal}
            onChange={(e) => onDebtChange('nominal', e.target.value)}
            className="font-mono"
          />
          <FormInput
            label="Teks Asli di Nota"
            placeholder="Contoh: NOTA LAMA 0891 (12/10) 150.000"
            value={carryOverDebt.keterangan_teks_asli || ''}
            onChange={(e) => onDebtChange('keterangan_teks_asli', e.target.value)}
          />
        </div>
      )}
    </div>
  );
};
