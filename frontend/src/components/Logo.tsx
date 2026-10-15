'use client';

import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ className = 'w-9 h-9', size = 36 }) => {
  return (
    <div
      className={`relative rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center p-1.5 shadow-sm overflow-hidden flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-sky-500/10 pointer-events-none" />

      <svg
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10"
      >
        <defs>
          {/* Linear gradient dari Teal (#2DD4BF) ke Soft Blue (#38BDF8) */}
          <linearGradient id="pf-gradient" x1="2" y1="4" x2="34" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2DD4BF" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>
          <linearGradient id="frame-gradient" x1="4" y1="4" x2="32" y2="16" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Siluet lembaran dokumen & bingkai presisi di bagian atas */}
        <rect
          x="6"
          y="4"
          width="24"
          height="12"
          rx="2"
          stroke="url(#frame-gradient)"
          strokeWidth="1.5"
          strokeDasharray="2 1.5"
          fill="none"
        />

        {/* Monogram P & F yang menyatu harmonis & modern */}
        {/* Batang vertikal utama yang menopang huruf P dan F */}
        <path
          d="M10 8.5V29.5"
          stroke="url(#pf-gradient)"
          strokeWidth="2.75"
          strokeLinecap="round"
        />

        {/* Loop huruf P di bagian atas */}
        <path
          d="M10 10.5H19.5C22.5 10.5 24.5 12.5 24.5 15.5C24.5 18.5 22.5 20.5 19.5 20.5H10"
          stroke="url(#pf-gradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Palang horizontal tengah huruf F yang memanjang sejajar */}
        <path
          d="M10 20.5H22"
          stroke="url(#pf-gradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Aksen sudut bingkai bawah kecil */}
        <path
          d="M26 25V28H23"
          stroke="#38BDF8"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity="0.8"
        />
      </svg>
    </div>
  );
};
