'use client';

import React from 'react';
import clsx from 'clsx';
import { AlertCircle, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  type: AlertType;
  title?: string;
  message: string;
  children?: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

const typeConfig: Record<AlertType, { icon: React.ReactNode; bgColor: string; borderColor: string; textColor: string; titleColor: string; iconColor: string }> = {
  success: {
    icon: <CheckCircle2 className="w-5 h-5" />,
    bgColor: 'bg-success-50',
    borderColor: 'border-success-300',
    textColor: 'text-success-900',
    titleColor: 'text-success-800',
    iconColor: 'text-success-600',
  },
  error: {
    icon: <AlertCircle className="w-5 h-5" />,
    bgColor: 'bg-danger-50',
    borderColor: 'border-danger-200',
    textColor: 'text-danger-800',
    titleColor: 'text-danger-800',
    iconColor: 'text-danger-500',
  },
  warning: {
    icon: <AlertTriangle className="w-5 h-5" />,
    bgColor: 'bg-warning-50',
    borderColor: 'border-warning-300',
    textColor: 'text-warning-900',
    titleColor: 'text-warning-900',
    iconColor: 'text-warning-600',
  },
  info: {
    icon: <Info className="w-5 h-5" />,
    bgColor: 'bg-primary-50',
    borderColor: 'border-primary-200',
    textColor: 'text-primary-900',
    titleColor: 'text-primary-900',
    iconColor: 'text-primary-600',
  },
};

export const Alert: React.FC<AlertProps> = ({
  type,
  title,
  message,
  children,
  onClose,
  className,
}) => {
  const config = typeConfig[type];

  return (
    <div
      className={clsx(
        'p-3.5 rounded-xl border flex items-start gap-2.5 text-xs animate-fadeIn',
        config.bgColor,
        config.borderColor,
        config.textColor,
        className
      )}
      role={type === 'error' ? 'alert' : 'status'}
      aria-live={type === 'error' ? 'assertive' : 'polite'}
    >
      <div className={clsx('flex-shrink-0 mt-0.5', config.iconColor)}>
        {config.icon}
      </div>

      <div className="flex-1">
        {title && (
          <p className={clsx('font-semibold', config.titleColor)}>
            {title}
          </p>
        )}
        <p className={title ? 'mt-0.5' : ''}>
          {message}
        </p>
        {children && <div className="mt-2">{children}</div>}
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 text-neutral-500 hover:text-neutral-700 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-500 rounded"
          aria-label="Close alert"
        >
          ✕
        </button>
      )}
    </div>
  );
};
