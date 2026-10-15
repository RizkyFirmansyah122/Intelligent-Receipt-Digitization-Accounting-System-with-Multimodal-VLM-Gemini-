'use client';

import React from 'react';
import { CheckCircle2, AlertTriangle, Calculator } from 'lucide-react';
import clsx from 'clsx';

interface ReconciliationBannerProps {
  isFormulaValid: boolean;
  onReconcile: () => void;
  diffGrandTotal: number;
  diffSisa: number;
}

export const ReconciliationBanner: React.FC<ReconciliationBannerProps> = ({
  isFormulaValid,
  onReconcile,
  diffGrandTotal,
  diffSisa,
}) => {
  return (
    <div
      className={clsx(
        'p-3.5 rounded-lg border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs transition-colors',
        isFormulaValid
          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900 dark:bg-emerald-950/40 dark:border-emerald-800/60 dark:text-emerald-200'
          : 'bg-amber-50/70 border-amber-200 text-amber-900 dark:bg-amber-950/40 dark:border-amber-800/60 dark:text-amber-200'
      )}
    >
      <div className="flex items-center gap-3">
        {isFormulaValid ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
        ) : (
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
        )}
        <div>
          <span className="font-semibold block text-xs">
            {isFormulaValid
              ? 'Formula Akuntansi Valid (100% Cocok)'
              : 'Peringatan: Selisih Rekonsiliasi Terdeteksi'}
          </span>
          <span className="text-[11px] opacity-80 mt-0.5 block">
            {isFormulaValid
              ? 'Subtotal Barang Baru + Piutang Lama - DP = Sisa Tagihan telah terverifikasi.'
              : `Selisih Grand Total: Rp ${diffGrandTotal.toLocaleString('id-ID')} | Sisa: Rp ${diffSisa.toLocaleString('id-ID')}`}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onReconcile}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium text-xs shadow-2xs transition-colors self-end sm:self-auto flex-shrink-0"
      >
        <Calculator className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
        Sinkronkan Otomatis
      </button>
    </div>
  );
};
