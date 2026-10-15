'use client';

import React from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/base/Button';

interface FormHeaderProps {
  onReset: () => void;
}

export const FormHeader: React.FC<FormHeaderProps> = ({ onReset }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-4 transition-colors">
      <div>
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Verifikasi & Edit Nota
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Periksa kembali hasil ekstraksi AI sebelum data disimpan secara permanen ke Google Sheets.
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onReset}
        icon={<RotateCcw className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />}
      >
        Scan Nota Baru
      </Button>
    </div>
  );
};
