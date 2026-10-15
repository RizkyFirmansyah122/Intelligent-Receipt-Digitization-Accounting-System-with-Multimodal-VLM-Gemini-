'use client';

import React, { useState } from 'react';
import { ReceiptData, ExtractResponse } from '@/types/receipt';
import { ReceiptUploader } from '@/components/ReceiptUploader';
import { ImagePreview } from '@/components/ImagePreview';
import { VerificationForm } from '@/components/VerificationForm';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  Sparkles,
  FileCheck2,
  RefreshCw,
  Info,
  Layers,
} from 'lucide-react';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  'http://localhost:8000';

export default function Home() {
  const [extractedData, setExtractedData] = useState<ReceiptData | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [tempFileId, setTempFileId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleExtractSuccess = (res: ExtractResponse, imageUrl: string) => {
    setExtractedData(res.data);
    setPreviewImageUrl(imageUrl);
    setTempFileId(res.temp_file_id);
  };

  const handleReset = () => {
    setExtractedData(null);
    setPreviewImageUrl(null);
    setTempFileId(null);
  };

  return (
    <main className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-[#090D16] dark:text-slate-100 transition-colors duration-200">
      {/* 1. Header & Branding dengan Toggle Theme */}
      <header className="bg-slate-950 border-b border-slate-800/80 text-white sticky top-0 z-30 shadow-sm transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo Monogram "PF" */}
            <Logo size={36} />

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-white tracking-tight text-lg">
                  Pelangi Frame
                </h1>
                <span className="inline-flex items-center gap-1 bg-slate-800/70 text-teal-300 border border-teal-500/20 text-xs px-2.5 py-0.5 rounded-full font-medium">
                  <Sparkles className="w-3 h-3 text-teal-400" />
                  AI-Powered
                </span>
              </div>
              <p className="text-slate-400 text-xs">
                Digitalisasi Nota, Rekonsiliasi & Piutang Reseller
              </p>
            </div>
          </div>

          {/* Status Integrasi & Theme Toggle Button */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="hidden sm:flex items-center gap-2.5">
              <span className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800 text-slate-300 text-xs px-3 py-1.5 rounded-md font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
                Gemini VLM Powered
              </span>
              <span className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800 text-slate-300 text-xs px-3 py-1.5 rounded-md font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Sheets API v4 Connected
              </span>
            </div>

            {/* Tombol Toggle Dark/Light Mode */}
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {!extractedData ? (
          /* Step 1: Uploading Screen & Hero Banner */
          <div className="max-w-3xl mx-auto py-4 sm:py-6 animate-fadeIn">
            {/* 2. Hero Card ("Pindai & Rekonsiliasi Nota Fisik") */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950/80 border border-slate-800 dark:border-teal-500/20 rounded-2xl p-6 sm:p-8 text-white mb-8 shadow-sm dark:shadow-lg dark:shadow-teal-950/20 transition-all duration-200">
              <div className="flex flex-col gap-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                    Pindai & Rekonsiliasi Nota Fisik
                  </h2>
                  <p className="text-sm text-slate-400 mt-2 max-w-xl leading-relaxed">
                    Ubah foto nota kertas dan tulisan tangan kasir menjadi data digital terstruktur dengan akurasi tinggi dan rekonsiliasi otomatis.
                  </p>
                </div>

                {/* Daftar 4 Fitur dalam 2 Kolom Rapi */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 border-t border-slate-800/80">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Sparkles className="w-4 h-4 text-teal-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Ekstraksi Otomatis</p>
                      <p className="text-xs text-slate-400">Pemisahan barang baru & nota lama</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FileCheck2 className="w-4 h-4 text-teal-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Verifikasi & Edit</p>
                      <p className="text-xs text-slate-400">Koreksi kasir sebelum data disimpan</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <RefreshCw className="w-4 h-4 text-teal-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Sinkronisasi Instan</p>
                      <p className="text-xs text-slate-400">Tersimpan ke Sheets & Google Drive</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Layers className="w-4 h-4 text-teal-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Buku Piutang Reseller</p>
                      <p className="text-xs text-slate-400">Pelacakan akumulasi saldo berjalan</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Upload Section */}
            <div className="space-y-6">
              <ReceiptUploader
                onExtractSuccess={handleExtractSuccess}
                isProcessing={isProcessing}
                setIsProcessing={setIsProcessing}
                backendUrl={BACKEND_URL}
              />

              {/* Business Rules Quick Card */}
              <div className="bg-white dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-5 shadow-sm transition-colors duration-200">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2 mb-3">
                  <Info className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                  Aturan Khusus Akuntansi Pelangi Frame
                </h4>
                <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2.5 list-disc list-inside">
                  <li>
                    <strong className="text-slate-800 dark:text-slate-200">Pemisahan Piutang Bawaan:</strong> Pola tulisan{' '}
                    <code className="text-slate-800 dark:text-teal-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded font-mono text-[11px]">
                      NOTA LAMA [No Faktur] ([Tanggal]) [Nominal]
                    </code>{' '}
                    dipisahkan dari daftar barang baru untuk menghindari double-counting omzet.
                  </li>
                  <li>
                    <strong className="text-slate-800 dark:text-slate-200">Formula Rekonsiliasi:</strong> Grand Total =
                    Subtotal Barang Baru + Piutang Lama, Sisa Tagihan = Grand Total - DP.
                  </li>
                  <li>
                    <strong className="text-slate-800 dark:text-slate-200">Buku Piutang Reseller:</strong> Mutasi dicatat
                    ke sheet Buku_Piutang_Reseller jika pelanggan bertipe Reseller atau memiliki sisa tagihan berjalan.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          /* Step 2: Split-Screen Verification Dashboard */
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-1">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  Dashboard Verifikasi Nota
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Bandingkan visual nota fisik di panel kiri dengan data terstruktur di panel kanan.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Sisi Kiri / Atas: Preview Foto Nota Asli (Zoomable & Pannable) */}
              <div className="lg:col-span-5 lg:sticky lg:top-20">
                <ImagePreview
                  imageUrl={previewImageUrl}
                  altText={`Nota ${extractedData.nomor_faktur}`}
                />
              </div>

              {/* Sisi Kanan / Bawah: Verification Form */}
              <div className="lg:col-span-7">
                <VerificationForm
                  initialData={extractedData}
                  tempFileId={tempFileId}
                  backendUrl={BACKEND_URL}
                  onReset={handleReset}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800/80 py-4 text-center text-xs text-slate-500 dark:text-slate-400 transition-colors duration-200">
        &copy; {new Date().getFullYear()} Bengkel Bingkai & Cermin "Pelangi Frame". All rights reserved.
      </footer>
    </main>
  );
}
