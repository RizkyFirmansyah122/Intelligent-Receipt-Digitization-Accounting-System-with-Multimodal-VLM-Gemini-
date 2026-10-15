'use client';

import React from 'react';
import { FormInput } from '@/components/base/FormInput';

interface NotesSectionProps {
  catatan: string;
  onChange: (value: string) => void;
}

export const NotesSection: React.FC<NotesSectionProps> = ({ catatan, onChange }) => {
  return (
    <FormInput
      label="Catatan Tambahan (Opsional)"
      placeholder="Catatan pengerjaan, instruksi kurir, warna list, dll."
      value={catatan}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};
