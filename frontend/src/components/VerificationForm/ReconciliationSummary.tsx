'use client';

import React from 'react';
import { ReceiptData } from '@/types/receipt';
import { FormInput } from '@/components/base/FormInput';

interface ReconciliationSummaryProps {
  data: ReceiptData;
  onDPChange: (value: number) => void;
}

export const ReconciliationSummary: React.FC<ReconciliationSummaryProps> = ({
  data,
  onDPChange,
}) => {
  return (
    <div className="bg-slate-50/70 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 space-y-4 transition-colors">
      <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
        Rekapitulasi Keuangan & Pembayaran
      </h4>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 shadow-2xs transition-colors">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">Subtotal Barang Baru</span>
          <span className="text-base font-bold font-mono text-slate-900 dark:text-slate-100 mt-0.5 block">
            Rp {Number(data.subtotal_baru || 0).toLocaleString('id-ID')}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 shadow-2xs transition-colors">
          <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block">Piutang Nota Lama</span>
          <span className="text-base font-bold font-mono text-teal-800 dark:text-teal-400 mt-0.5 block">
            + Rp {Number(data.piutang_lama || 0).toLocaleString('id-ID')}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 shadow-2xs transition-colors">
          <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block">Grand Total Tagihan</span>
          <span className="text-base font-bold font-mono text-slate-900 dark:text-slate-100 mt-0.5 block">
            = Rp {Number(data.grand_total || 0).toLocaleString('id-ID')}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 shadow-2xs transition-colors">
          <label className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-400 block mb-1">
            Uang Muka / DP (Rp)
          </label>
          <FormInput
            type="number"
            value={data.uang_muka_dp}
            onChange={(e) => onDPChange(parseFloat(e.target.value) || 0)}
            className="font-mono font-semibold text-emerald-900 dark:text-emerald-300 py-1"
          />
        </div>
      </div>

      {/* Status & Sisa Tagihan */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Status Pembayaran:</span>
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              data.status_pembayaran === 'Lunas'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/80'
                : 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800/80'
            }`}
          >
            {data.status_pembayaran}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Sisa Tagihan Belum Dibayar:</span>
          <span className="text-base font-bold font-mono text-rose-600 dark:text-rose-400">
            Rp {Number(data.sisa_tagihan || 0).toLocaleString('id-ID')}
          </span>
        </div>
      </div>
    </div>
  );
};
