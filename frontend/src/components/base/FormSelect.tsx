'use client';

import React from 'react';
import clsx from 'clsx';

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  error,
  options,
  id,
  className,
  ...props
}) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${selectId}-error` : undefined;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
          {label}
        </label>
      )}

      <select
        id={selectId}
        aria-describedby={errorId}
        className={clsx(
          'w-full px-3 py-2 text-sm rounded-lg border transition-colors',
          'focus:ring-2 focus:outline-none',
          error
            ? 'border-rose-400 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200 focus:border-rose-500'
            : 'border-slate-200 bg-white text-slate-900 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-100 hover:border-slate-300 dark:hover:border-slate-700 focus:ring-slate-900/10 dark:focus:ring-teal-500/10 focus:border-slate-600 dark:focus:border-teal-500/60',
          props.disabled && 'opacity-60 cursor-not-allowed bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400',
          className
        )}
        {...props}
      >
        <option value="" className="dark:bg-slate-950 dark:text-slate-400">-- Pilih Opsi --</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="dark:bg-slate-950 dark:text-slate-100">
            {opt.label}
          </option>
        ))}
      </select>

      {error && (
        <p id={errorId} className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
          {error}
        </p>
      )}
    </div>
  );
};
