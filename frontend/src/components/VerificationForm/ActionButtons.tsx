'use client';

import React from 'react';
import { Calculator, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/base/Button';

interface ActionButtonsProps {
  onRecalculate: () => void;
  onSave: () => void;
  isSaving: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onRecalculate,
  onSave,
  isSaving,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
      <Button
        variant="outline"
        size="md"
        onClick={onRecalculate}
        icon={<Calculator className="w-4 h-4 text-slate-500 dark:text-slate-400" />}
      >
        Hitung Ulang Formula
      </Button>

      <Button
        variant="success"
        size="lg"
        isLoading={isSaving}
        onClick={onSave}
        icon={<FileSpreadsheet className="w-4 h-4" />}
      >
        {isSaving ? 'Menyimpan ke Sheets & Drive...' : 'Simpan ke Google Sheets & Drive'}
      </Button>
    </div>
  );
};
