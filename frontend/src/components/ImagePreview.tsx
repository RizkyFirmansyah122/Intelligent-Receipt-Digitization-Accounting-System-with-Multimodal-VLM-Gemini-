'use client';

import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCw, Maximize2, RefreshCw } from 'lucide-react';

interface ImagePreviewProps {
  imageUrl: string | null;
  altText?: string;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ imageUrl, altText = 'Foto Nota Asli' }) => {
  const [scale, setScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.25, 0.5));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);
  const handleReset = () => {
    setScale(1);
    setRotation(0);
  };

  if (!imageUrl) {
    return (
      <div className="h-full min-h-[350px] flex flex-col items-center justify-center bg-white border border-dashed border-slate-200 rounded-xl p-6 text-center text-slate-500">
        <div className="w-12 h-12 mb-3 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
          <Maximize2 className="w-6 h-6" />
        </div>
        <p className="font-semibold text-slate-700 text-sm">Belum ada foto nota yang dimuat</p>
        <p className="text-xs text-slate-400 mt-1">Upload atau foto nota fisik untuk melihat preview di sini.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-xl overflow-hidden shadow-sm border border-slate-800">
      {/* Toolbar Zoom & Rotate Subtle */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-900 border-b border-slate-800 text-slate-300">
        <span className="text-xs font-medium text-slate-300 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          Preview Foto Asli ({Math.round(scale * 100)}%)
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleZoomOut}
            title="Perkecil"
            className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleZoomIn}
            title="Perbesar"
            className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleRotate}
            title="Putar 90°"
            className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleReset}
            title="Reset Ukuran"
            className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors text-xs flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Container Gambar Interaktif */}
      <div className="relative flex-1 min-h-[420px] max-h-[700px] overflow-auto flex items-center justify-center p-4 bg-slate-950/90">
        <div
          className="transition-transform duration-200 ease-out origin-center select-none"
          style={{
            transform: `scale(${scale}) rotate(${rotation}deg)`,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={altText}
            className="max-w-full max-h-[600px] object-contain rounded shadow-2xl pointer-events-auto border border-slate-800/80"
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
};
