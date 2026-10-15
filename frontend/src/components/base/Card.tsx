'use client';

import React from 'react';
import clsx from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'sm' | 'md' | 'lg';
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

const paddingClasses = {
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-6',
};

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  padding = 'md',
}) => {
  const baseClasses = 'bg-white rounded-xl border border-neutral-200 transition-all duration-200 ease-in-out hover:shadow-lg hover:scale-[1.01]';
  const variantClasses = {
    default: 'shadow-sm',
    elevated: 'shadow-md',
    outlined: 'shadow-none',
  };

  return (
    <div
      className={clsx(baseClasses, variantClasses[variant], paddingClasses[padding], className)}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => (
  <div className={clsx('border-b border-neutral-100 px-5 py-4 bg-neutral-50 rounded-t-xl -m-5 mb-0', className)}>
    {children}
  </div>
);

export const CardContent: React.FC<CardContentProps> = ({ children, className }) => (
  <div className={clsx('text-sm text-neutral-700', className)}>
    {children}
  </div>
);

export const CardFooter: React.FC<CardFooterProps> = ({ children, className }) => (
  <div className={clsx('border-t border-neutral-100 pt-4 mt-4 flex items-center justify-end gap-3', className)}>
    {children}
  </div>
);
