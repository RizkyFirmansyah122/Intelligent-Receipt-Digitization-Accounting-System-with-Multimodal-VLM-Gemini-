'use client';

import React, { useState, useEffect } from 'react';
import {
  ReceiptData,
  ItemBarang,
  CarryOverDebt,
} from '@/types/receipt';
import axios from 'axios';
import {
  FormHeader,
  ReconciliationBanner,
  ReceiptHeaderSection,
  ItemsTableSection,
  CarryOverDebtSection,
  ReconciliationSummary,
  NotesSection,
  ActionButtons,
} from './index';
import { ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';

interface VerificationFormProps {
  initialData: ReceiptData;
  tempFileId: string | null;
  backendUrl: string;
  onReset: () => void;
}

export const VerificationForm: React.FC<VerificationFormProps> = ({
  initialData,
  tempFileId,
  backendUrl,
  onReset,
}) => {
  const [data, setData] = useState<ReceiptData>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync state if initialData changes
  useEffect(() => {
    setData(initialData);
    setSaveSuccess(null);
    setErrorMessage(null);
  }, [initialData]);

  // Handle Header Changes
  const handleHeaderChange = (field: keyof ReceiptData, value: any) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle Item Row Changes
  const handleItemChange = (index: number, field: keyof ItemBarang, value: any) => {
    setData((prev) => {
      const newItems = [...prev.items];
      const targetItem = { ...newItems[index], [field]: value };

      // Auto update subtotal for this item if qty or price changes
      if (field === 'banyaknya' || field === 'harga_satuan') {
        const qty = field === 'banyaknya' ? parseFloat(value) || 0 : targetItem.banyaknya;
        const price = field === 'harga_satuan' ? parseFloat(value) || 0 : targetItem.harga_satuan;
        targetItem.jumlah_subtotal = Math.round(qty * price);
      }

      newItems[index] = targetItem;
      return {
        ...prev,
        items: newItems,
      };
    });
  };

  const handleAddItem = () => {
    setData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          nama_barang: '',
          banyaknya: 1,
          harga_satuan: 0,
          jumlah_subtotal: 0,
          kategori_item: 'Bingkai',
        },
      ],
    }));
  };

  const handleDeleteItem = (index: number) => {
    setData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  // Handle Carry Over Debt changes
  const handleDebtChange = (field: keyof CarryOverDebt, value: any) => {
    setData((prev) => {
      const updatedDebt = {
        ...prev.carry_over_piutang,
        [field]: value,
      };
      const nominal = field === 'nominal' ? parseFloat(value) || 0 : updatedDebt.nominal;
      return {
        ...prev,
        carry_over_piutang: updatedDebt,
        piutang_lama: updatedDebt.ada_nota_lama ? nominal : 0,
      };
    });
  };

  const handleCategoryChange = (category: string) => {
    handleHeaderChange('kategori_pelanggan', category);
  };

  // Auto Reconcile Calculations
  const performReconciliation = () => {
    // 1. Calculate sum of new items
    const subtotalBaru = data.items.reduce(
      (sum, item) => sum + (Number(item.jumlah_subtotal) || 0),
      0
    );

    // 2. Piutang lama
    const piutangLama = data.carry_over_piutang.ada_nota_lama
      ? Number(data.carry_over_piutang.nominal) || 0
      : 0;

    // 3. Grand total = subtotal baru + piutang lama
    const grandTotal = subtotalBaru + piutangLama;

    // 4. Sisa tagihan = grand total - DP
    const dp = Number(data.uang_muka_dp) || 0;
    const sisa = Math.max(0, grandTotal - dp);

    // 5. Status pembayaran
    const status = sisa <= 0 ? 'Lunas' : 'DP (Belum Lunas)';

    setData((prev) => ({
      ...prev,
      subtotal_baru: Math.round(subtotalBaru),
      piutang_lama: Math.round(piutangLama),
      grand_total: Math.round(grandTotal),
      sisa_tagihan: Math.round(sisa),
      status_pembayaran: status,
      carry_over_piutang: {
        ...prev.carry_over_piutang,
        nominal: Math.round(piutangLama),
      },
    }));
  };

  // Logic Indicator: Periksa Kesesuaian Formula
  const sumItems = data.items.reduce(
    (sum, item) => sum + (Number(item.jumlah_subtotal) || 0),
    0
  );
  const debt = data.carry_over_piutang.ada_nota_lama
    ? Number(data.carry_over_piutang.nominal) || 0
    : Number(data.piutang_lama) || 0;
  const dp = Number(data.uang_muka_dp) || 0;
  const expectedGrandTotal = sumItems + debt;
  const expectedSisa = Math.max(0, expectedGrandTotal - dp);

  const diffGrandTotal = Math.abs(expectedGrandTotal - Number(data.grand_total));
  const diffSisa = Math.abs(expectedSisa - Number(data.sisa_tagihan));
  const isFormulaValid = diffGrandTotal < 1 && diffSisa < 1;

  // Handle Save
  const handleSaveToSheets = async () => {
    setIsSaving(true);
    setErrorMessage(null);

    // Run reconciliation first
    performReconciliation();

    try {
      const response = await axios.post(`${backendUrl}/api/save`, {
        receipt: data,
        temp_file_id: tempFileId,
        upload_to_drive: true,
      });

      if (response.data.success) {
        setSaveSuccess(response.data);
      } else {
        throw new Error(response.data.error || 'Gagal menyimpan data.');
      }
    } catch (err: any) {
      console.error('Save error:', err);
      const detail =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        'Gagal menyimpan data ke Google Sheets.';
      setErrorMessage(detail);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-5 sm:p-6 space-y-6 transition-colors duration-200">
      {/* Form Header */}
      <FormHeader onReset={onReset} />

      {/* Reconciliation Banner */}
      <ReconciliationBanner
        isFormulaValid={isFormulaValid}
        onReconcile={performReconciliation}
        diffGrandTotal={diffGrandTotal}
        diffSisa={diffSisa}
      />

      {/* Receipt Header Section */}
      <ReceiptHeaderSection data={data} onHeaderChange={handleHeaderChange} />

      {/* Items Table Section */}
      <ItemsTableSection
        items={data.items}
        onItemChange={handleItemChange}
        onAddItem={handleAddItem}
        onDeleteItem={handleDeleteItem}
      />

      {/* Carry Over Debt Section */}
      <CarryOverDebtSection
        carryOverDebt={data.carry_over_piutang}
        onDebtChange={handleDebtChange}
        onCategoryChange={handleCategoryChange}
      />

      {/* Reconciliation Summary */}
      <ReconciliationSummary
        data={data}
        onDPChange={(value) => handleHeaderChange('uang_muka_dp', value)}
      />

      {/* Notes Section */}
      <NotesSection
        catatan={data.catatan_tambahan || ''}
        onChange={(value) => handleHeaderChange('catatan_tambahan', value)}
      />

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-3.5 rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 flex items-start gap-2.5 text-xs transition-colors">
          <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-rose-800 dark:text-rose-300">Gagal Menyimpan</p>
            <p className="mt-0.5 text-rose-700 dark:text-rose-200/90">{errorMessage}</p>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-rose-500 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Success Alert */}
      {saveSuccess && (
        <div className="p-4 rounded-lg border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 space-y-2 text-xs transition-colors">
          <div className="flex items-center gap-2 font-bold text-sm text-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Nota berhasil disimpan ke Google Sheets!
          </div>
          <p className="text-emerald-800 dark:text-emerald-200">
            ID Transaksi: <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{saveSuccess.details?.id_transaksi}</span> |{' '}
            Sheet Header & Detail Barang berhasil diperbarui.
          </p>
          {saveSuccess.details?.reseller_debt_recorded && (
            <p className="font-semibold text-slate-800 dark:text-slate-200 pt-0.5">
              Mutasi Buku Piutang Reseller telah dicatat (Saldo Baru: Rp{' '}
              {Number(saveSuccess.details.total_saldo_piutang || 0).toLocaleString('id-ID')}).
            </p>
          )}
          {saveSuccess.drive_url && (
            <div className="pt-2">
              <a
                href={saveSuccess.drive_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 dark:hover:bg-emerald-500 text-white font-medium shadow-2xs transition-colors text-xs"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Lihat Foto Nota di Google Drive
              </a>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <ActionButtons
        onRecalculate={performReconciliation}
        onSave={handleSaveToSheets}
        isSaving={isSaving}
      />
    </div>
  );
};
