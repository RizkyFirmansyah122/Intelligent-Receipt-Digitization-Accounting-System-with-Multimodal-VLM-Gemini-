'use client';

import React, { useRef, useState } from 'react';
import { Camera, UploadCloud, FileImage, AlertCircle, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import axios from 'axios';
import { ExtractResponse } from '@/types/receipt';

interface ReceiptUploaderProps {
  onExtractSuccess: (data: ExtractResponse, fileUrl: string) => void;
  isProcessing: boolean;
  setIsProcessing: (val: boolean) => void;
  backendUrl: string;
}

export const ReceiptUploader: React.FC<ReceiptUploaderProps> = ({
  onExtractSuccess,
  isProcessing,
  setIsProcessing,
  backendUrl,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Reset error
    setErrorMessage(null);
    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post<ExtractResponse>(
        `${backendUrl}/api/extract`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 90000, // 90s timeout untuk AI VLM call
        }
      );

      if (response.data.success) {
        // Gabungkan preview url dengan host backend jika relative
        const fullPreviewUrl = response.data.preview_url.startsWith('http')
          ? response.data.preview_url
          : `${backendUrl}${response.data.preview_url}`;

        onExtractSuccess(response.data, fullPreviewUrl);
      } else {
        throw new Error(response.data.error || 'Ekstraksi gagal diproses AI.');
      }
    } catch (err: any) {
      console.error('Error ekstraksi nota:', err);
      const detail =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        'Gagal menghubungi server backend. Pastikan server backend sedang aktif dan alamat API dapat diakses.';
      setErrorMessage(detail);
    } finally {
      setIsProcessing(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full">
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileChange}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={cameraInputRef}
        onChange={onFileChange}
        accept="image/*"
        capture="environment"
        className="hidden"
      />

      {/* Area Drag & Drop dengan Dark Mode support */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        role="button"
        tabIndex={isProcessing ? -1 : 0}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !isProcessing) {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        className={clsx(
          'border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center transition-all duration-200 cursor-pointer',
          'bg-white dark:bg-slate-900/60 dark:border-slate-800 dark:hover:border-teal-500/40 dark:hover:bg-slate-900/90',
          dragOver
            ? 'border-teal-500 bg-teal-50/30 dark:bg-teal-950/20'
            : isProcessing
            ? 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 opacity-85 cursor-wait'
            : 'border-slate-200 hover:border-slate-400 hover:bg-slate-50/50 shadow-sm'
        )}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        aria-label="Upload receipt image"
      >
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center py-6">
            <Loader2 className="w-10 h-10 text-teal-600 dark:text-teal-400 animate-spin mb-3.5" />
            <h4 className="text-base font-semibold text-slate-800 dark:text-slate-100">
              Membaca & Mengekstrak Nota dengan Gemini VLM...
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 max-w-sm">
              Mendeteksi nomor faktur, pelanggan, memisahkan barang baru & pola 'NOTA LAMA', serta mencocokkan formula DP.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <div className="w-13 h-13 mb-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-teal-400 shadow-2xs">
              <UploadCloud className="w-6 h-6" />
            </div>
            <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Klik atau Drag & Drop Foto Nota
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Mendukung format JPG, PNG, WEBP (cetak kasir atau tulisan tangan)
            </p>

            {/* Tombol Aksi */}
            <div
              className="flex flex-wrap items-center justify-center gap-3 mt-5"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white shadow-sm transition-colors active:scale-98"
              >
                <FileImage className="w-4 h-4 text-slate-300 dark:text-slate-700" />
                Pilih File Foto
              </button>
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 dark:hover:bg-emerald-500 text-white shadow-sm transition-colors active:scale-98"
              >
                <Camera className="w-4 h-4 text-emerald-100" />
                Buka Kamera HP
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="mt-4 p-3.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/80 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 flex items-start gap-2.5 text-xs transition-colors">
          <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-rose-800 dark:text-rose-300">Terjadi Kesalahan Saat Ekstraksi</p>
            <p className="mt-0.5 text-rose-700 dark:text-rose-200/90">{errorMessage}</p>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-rose-500 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 text-sm font-bold"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
