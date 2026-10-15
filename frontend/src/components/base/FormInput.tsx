'use client';

import React from 'react';
import clsx from 'clsx';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  helperText,
  icon,
  id,
  className,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const helperId = helperText ? `${inputId}-helper` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={inputId}
          aria-describedby={[helperId, errorId].filter(Boolean).join(' ')}
          className={clsx(
            'w-full px-3 py-2 text-sm rounded-lg border transition-colors',
            'focus:ring-2 focus:outline-none',
            error
              ? 'border-rose-400 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200 focus:border-rose-500 focus:ring-rose-500/20'
              : 'border-slate-200 bg-white text-slate-900 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-100 dark:placeholder:text-slate-600 hover:border-slate-300 dark:hover:border-slate-700 focus:ring-slate-900/10 dark:focus:ring-teal-500/10 focus:border-slate-600 dark:focus:border-teal-500/60',
            props.disabled && 'opacity-60 cursor-not-allowed bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400',
            icon && 'pl-10',
            className
          )}
          {...props}
        />
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none">
            {icon}
          </div>
        )}
      </div>

      {error && (
        <p id={errorId} className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
          {error}
        </p>
      )}

      {helperText && !error && (
        <p id={helperId} className="mt-1 text-xs text-slate-400 dark:text-slate-500">
          {helperText}
        </p>
      )}
    </div>
  );
};
