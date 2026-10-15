# Pelangi Frame - Implementation Guide

**Document Purpose:** Specific code patterns, component examples, and step-by-step refactoring instructions.

---

## 1. SETUP: TAILWIND CONFIG UPDATE

**File:** `tailwind.config.js`

Replace entire file with:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          500: '#0284c7',
          600: '#0369a1',
          700: '#075985',
          800: '#0c3a52',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        danger: {
          50: '#fff5f5',
          100: '#ffe2e2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
        accent: {
          50: '#f0f4ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
        neutral: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
    },
  },
  plugins: [],
};
```

**Key changes:**
- Extended color palette with primary, success, warning, danger, accent, neutral
- All colors have 50–900 scale for light/dark mode ready
- Removed hardcoded `pelangi` colors (use `primary` instead)

---

## 2. SETUP: GLOBALS.CSS UPDATE

**File:** `src/app/globals.css`

Replace with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 15, 23, 42;
  --background-rgb: 248, 250, 252;
}

body {
  color: rgb(var(--foreground-rgb));
  background: rgb(var(--background-rgb));
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

/* Focus styles for accessibility */
:focus-visible {
  outline: 2px solid rgb(2, 132, 199);
  outline-offset: 2px;
}

/* Smooth scroll behavior */
html {
  scroll-behavior: smooth;
}

/* Print styles */
@media print {
  body {
    background: white;
  }
  button,
  [role="button"] {
    display: none;
  }
}

/* Utility: sr-only (screen readers only) */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Utility: smooth transitions */
.transition-smooth {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Animation: fade-in on page load */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 200ms ease-out;
}
```

**Key additions:**
- `:focus-visible` for keyboard focus (blue ring)
- `.sr-only` utility for screen reader-only text
- `.animate-fadeIn` for alert entrance animations

---

## 3. BASE COMPONENTS (Create in `src/components/base/`)

### 3.1 Button Component

**File:** `src/components/base/Button.tsx`

```typescript
import React from 'react';
import clsx from 'clsx';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'outline' | 'ghost';
type ButtonSize = 'lg' | 'md' | 'sm';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary-500 text-white hover:bg-primary-600 disabled:bg-neutral-400',
  secondary: 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 disabled:text-neutral-400 disabled:bg-neutral-100',
  danger: 'bg-danger-500 text-white hover:bg-danger-600 disabled:bg-neutral-400',
  success: 'bg-success-500 text-white hover:bg-success-600 disabled:bg-neutral-400',
  outline: 'border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 disabled:opacity-50',
  ghost: 'text-neutral-600 hover:bg-neutral-100 disabled:opacity-50',
};

const sizeClasses: Record<ButtonSize, string> = {
  lg: 'px-6 py-3 text-sm',
  md: 'px-4 py-2.5 text-xs',
  sm: 'px-3 py-1.5 text-xs',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  disabled,
  children,
  className,
  ...props
}) => {
  return (
    <button
      disabled={disabled || isLoading}
      className={clsx(
        'rounded-lg font-semibold transition shadow-sm inline-flex items-center gap-1.5 active:scale-95',
        'focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {children}
        </>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  );
};
```

**Usage:**
```jsx
<Button variant="primary" size="md">Save</Button>
<Button variant="danger" size="sm" icon={<Trash2 className="w-4 h-4" />}>Delete</Button>
<Button variant="outline">Cancel</Button>
<Button isLoading>Processing...</Button>
```

### 3.2 FormInput Component

**File:** `src/components/base/FormInput.tsx`

```typescript
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
        <label htmlFor={inputId} className="block text-xs font-semibold text-neutral-600 mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          id={inputId}
          aria-describedby={[helperId, errorId].filter(Boolean).join(' ')}
          className={clsx(
            'w-full px-3 py-2 text-sm rounded-lg border transition',
            'focus:ring-2 focus:ring-offset-0',
            error
              ? 'border-danger-500 bg-danger-50 focus:ring-danger-500 focus:border-danger-500'
              : 'border-neutral-300 bg-white focus:ring-primary-500 focus:border-primary-500',
            props.disabled && 'opacity-60 cursor-not-allowed bg-neutral-100',
            icon && 'pl-10',
            className
          )}
          {...props}
        />
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none">
            {icon}
          </div>
        )}
      </div>

      {error && (
        <p id={errorId} className="mt-1 text-xs text-danger-600 font-medium animate-fadeIn">
          {error}
        </p>
      )}

      {helperText && !error && (
        <p id={helperId} className="mt-1 text-xs text-neutral-500">
          {helperText}
        </p>
      )}
    </div>
  );
};
```

**Usage:**
```jsx
<FormInput
  label="Nomor Faktur"
  placeholder="Contoh: F-1002"
  value={value}
  onChange={onChange}
  error={errors.nomor_faktur}
  helperText="Format bebas, gunakan nomor unik dari nota asli"
/>
```

### 3.3 FormSelect Component

**File:** `src/components/base/FormSelect.tsx`

```typescript
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
        <label htmlFor={selectId} className="block text-xs font-semibold text-neutral-600 mb-1">
          {label}
        </label>
      )}

      <select
        id={selectId}
        aria-describedby={errorId}
        className={clsx(
          'w-full px-3 py-2 text-sm rounded-lg border transition',
          'focus:ring-2 focus:ring-offset-0',
          error
            ? 'border-danger-500 bg-danger-50 focus:ring-danger-500'
            : 'border-neutral-300 bg-white focus:ring-primary-500 focus:border-primary-500',
          props.disabled && 'opacity-60 cursor-not-allowed bg-neutral-100',
          className
        )}
        {...props}
      >
        <option value="">-- Pilih Opsi --</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && (
        <p id={errorId} className="mt-1 text-xs text-danger-600 font-medium animate-fadeIn">
          {error}
        </p>
      )}
    </div>
  );
};
```

**Usage:**
```jsx
<FormSelect
  label="Kategori Pelanggan"
  value={category}
  onChange={(e) => setCategory(e.target.value)}
  options={[
    { value: 'Umum', label: 'Umum (Reguler)' },
    { value: 'Reseller', label: 'Reseller (Buku Piutang)' },
  ]}
/>
```

### 3.4 Alert Component

**File:** `src/components/base/Alert.tsx`

```typescript
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
          className="flex-shrink-0 text-neutral-500 hover:text-neutral-700"
          aria-label="Close alert"
        >
          ✕
        </button>
      )}
    </div>
  );
};
```

**Usage:**
```jsx
<Alert type="success" title="Berhasil!" message="Data telah disimpan ke Google Sheets." />
<Alert type="error" message="Terjadi kesalahan: Email sudah terdaftar" onClose={() => setError(null)} />
<Alert type="warning" title="Peringatan" message="Terdapat ketidakcocokan dalam rekonsiliasi." />
```

### 3.5 Card Component

**File:** `src/components/base/Card.tsx`

```typescript
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
  const baseClasses = 'bg-white rounded-xl border border-neutral-200 transition-all';
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
```

**Usage:**
```jsx
<Card padding="md">
  <CardHeader>
    <h3 className="text-base font-bold text-neutral-800">Section Title</h3>
  </CardHeader>
  <CardContent>
    <p>Card content here</p>
  </CardContent>
  <CardFooter>
    <Button>Save</Button>
  </CardFooter>
</Card>
```

---

## 4. REFACTORING COMPONENTS

### 4.1 Update ReceiptUploader Component

**Key changes:**
- Use new Button component
- Use new Alert component for errors
- Improve loading state UX
- Better drag-and-drop feedback

**Updated structure:**
```jsx
import { Button } from '@/components/base/Button';
import { Alert } from '@/components/base/Alert';

// ... inside component ...

return (
  <div className="w-full">
    {/* Hidden inputs */}
    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" />
    <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" />

    {/* Upload Zone */}
    <div
      className={clsx(
        'border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 cursor-pointer',
        dragOver ? 'border-primary-500 bg-primary-50' : 'border-neutral-300 hover:border-primary-500 hover:bg-neutral-50 bg-white shadow-sm',
        isProcessing && 'border-neutral-300 bg-neutral-50 opacity-80 cursor-wait'
      )}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => !isProcessing && fileInputRef.current?.click()}
    >
      {isProcessing ? (
        <div className="flex flex-col items-center justify-center py-6">
          <svg className="w-12 h-12 text-primary-600 animate-spin mb-3" /* ... */ />
          <h4 className="text-base font-semibold text-neutral-800">
            Membaca & Mengekstrak Nota dengan Gemini VLM...
          </h4>
          <p className="text-xs text-neutral-500 mt-2 max-w-sm">
            Mendeteksi nomor faktur, pelanggan, memisahkan barang baru & pola NOTA LAMA...
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <div className="w-14 h-14 mb-4 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
            <UploadCloud className="w-7 h-7" />
          </div>
          <h4 className="text-lg font-bold text-neutral-900">
            Klik atau Drag & Drop Foto Nota
          </h4>
          <p className="text-xs text-neutral-500 mt-2">
            Mendukung JPG, PNG, WEBP
          </p>

          <div className="flex items-center gap-3 mt-6" onClick={(e) => e.stopPropagation()}>
            <Button
              size="md"
              onClick={() => fileInputRef.current?.click()}
              icon={<FileImage className="w-4 h-4" />}
            >
              Pilih File Foto
            </Button>
            <Button
              variant="success"
              size="md"
              onClick={() => cameraInputRef.current?.click()}
              icon={<Camera className="w-4 h-4" />}
            >
              Buka Kamera HP
            </Button>
          </div>
        </div>
      )}
    </div>

    {/* Error Alert */}
    {errorMessage && (
      <Alert
        type="error"
        title="Terjadi Kesalahan Saat Ekstraksi"
        message={errorMessage}
        onClose={() => setErrorMessage(null)}
      />
    )}
  </div>
);
```

### 4.2 Update VerificationForm Component

**Strategy:** Break into smaller sub-components for maintainability.

**New structure:**
```
VerificationForm.tsx (main orchestrator)
├── FormHeader.tsx (reset button, title)
├── ReconciliationBanner.tsx (formula validation)
├── ReceiptHeaderSection.tsx (nomor_faktur, tanggal, pelanggan, kategori)
├── ItemsTableSection.tsx (items list with add/delete)
├── CarryOverDebtSection.tsx (nota lama section with toggle)
├── ReconciliationSummary.tsx (subtotal, piutang, grand total, DP, sisa)
├── NotesSection.tsx (catatan tambahan)
└── ActionButtons.tsx (Hitung Ulang Formula, Simpan)
```

**Example: ReconciliationBanner.tsx**

```typescript
import React from 'react';
import { CheckCircle2, AlertTriangle, Calculator } from 'lucide-react';
import { Button } from '@/components/base/Button';
import clsx from 'clsx';

interface ReconciliationBannerProps {
  isFormulaValid: boolean;
  onReconcile: () => void;
  diffGrandTotal: number;
  diffSisa: number;
}

export const ReconciliationBanner: React.FC<ReconciliationBannerProps> = ({
  isFormulaValid,
  onReconcile,
  diffGrandTotal,
  diffSisa,
}) => {
  return (
    <div
      className={clsx(
        'p-4 rounded-xl border flex items-center justify-between text-xs transition-colors',
        isFormulaValid
          ? 'bg-success-50 border-success-200 text-success-800'
          : 'bg-warning-50 border-warning-300 text-warning-900'
      )}
    >
      <div className="flex items-center gap-3">
        {isFormulaValid ? (
          <CheckCircle2 className="w-5 h-5 text-success-600 flex-shrink-0" />
        ) : (
          <AlertTriangle className="w-5 h-5 text-warning-600 flex-shrink-0 animate-pulse" />
        )}
        <div>
          <span className="font-semibold block">
            {isFormulaValid
              ? 'Formula Akuntansi Valid (100% Cocok)'
              : 'Peringatan: Selisih Rekonsiliasi Terdeteksi'}
          </span>
          <span className="text-[11px] opacity-90">
            {isFormulaValid
              ? 'Subtotal Barang Baru + Piutang Lama - DP = Sisa Tagihan telah terverifikasi.'
              : `Selisih Grand Total: Rp ${diffGrandTotal.toLocaleString('id-ID')} | Sisa: Rp ${diffSisa.toLocaleString('id-ID')}`}
          </span>
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={onReconcile}
        icon={<Calculator className="w-3.5 h-3.5 text-primary-600" />}
      >
        Sinkronkan Otomatis
      </Button>
    </div>
  );
};
```

**Example: ItemsTableSection.tsx**

```typescript
import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { ItemBarang } from '@/types/receipt';
import { FormInput, FormSelect } from '@/components/base/';
import { Button } from '@/components/base/Button';

interface ItemsTableSectionProps {
  items: ItemBarang[];
  onItemChange: (index: number, field: keyof ItemBarang, value: any) => void;
  onAddItem: () => void;
  onDeleteItem: (index: number) => void;
}

export const ItemsTableSection: React.FC<ItemsTableSectionProps> = ({
  items,
  onItemChange,
  onAddItem,
  onDeleteItem,
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-bold text-neutral-800 flex items-center gap-2">
          Daftar Barang Fisik Baru
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-800 font-semibold">
            {items.length} Item
          </span>
        </h4>
        <Button
          variant="outline"
          size="sm"
          onClick={onAddItem}
          icon={<Plus className="w-3.5 h-3.5" />}
        >
          Tambah Baris
        </Button>
      </div>

      <div className="overflow-x-auto border border-neutral-200 rounded-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-100 text-neutral-700 uppercase font-semibold border-b border-neutral-200">
            <tr>
              <th className="py-2.5 px-3">Nama / Ukuran Barang</th>
              <th className="py-2.5 px-3 w-20">Banyak</th>
              <th className="py-2.5 px-3 w-32">Harga Satuan (Rp)</th>
              <th className="py-2.5 px-3 w-32">Subtotal (Rp)</th>
              <th className="py-2.5 px-3 w-28">Kategori</th>
              <th className="py-2.5 px-2 w-10 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {items.map((item, idx) => (
              <tr key={idx} className="hover:bg-neutral-50/60">
                <td className="p-2">
                  <FormInput
                    placeholder="Nama bingkai / kaca..."
                    value={item.nama_barang}
                    onChange={(e) => onItemChange(idx, 'nama_barang', e.target.value)}
                  />
                </td>
                <td className="p-2">
                  <FormInput
                    type="number"
                    step="any"
                    value={item.banyaknya}
                    onChange={(e) => onItemChange(idx, 'banyaknya', e.target.value)}
                  />
                </td>
                <td className="p-2">
                  <FormInput
                    type="number"
                    value={item.harga_satuan}
                    onChange={(e) => onItemChange(idx, 'harga_satuan', e.target.value)}
                    className="font-mono"
                  />
                </td>
                <td className="p-2">
                  <FormInput
                    type="number"
                    value={item.jumlah_subtotal}
                    onChange={(e) => onItemChange(idx, 'jumlah_subtotal', e.target.value)}
                    className="font-mono font-semibold bg-neutral-50"
                    disabled
                  />
                </td>
                <td className="p-2">
                  <FormSelect
                    value={item.kategori_item || 'Bingkai'}
                    onChange={(e) => onItemChange(idx, 'kategori_item', e.target.value)}
                    options={[
                      { value: 'Bingkai', label: 'Bingkai' },
                      { value: 'Kaca', label: 'Kaca' },
                      { value: 'Cermin', label: 'Cermin' },
                      { value: 'Aksesoris', label: 'Aksesoris' },
                      { value: 'Jasa', label: 'Jasa' },
                    ]}
                  />
                </td>
                <td className="p-2 text-center">
                  <button
                    type="button"
                    onClick={() => onDeleteItem(idx)}
                    className="p-1 rounded text-danger-500 hover:bg-danger-50 transition"
                    title="Hapus baris"
                    aria-label={`Delete item ${idx + 1}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-6 text-neutral-400 text-xs">
                  Tidak ada barang fisik yang tercatat. Klik "Tambah Baris" untuk menambahkan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
```

---

## 5. PAGE LAYOUT IMPROVEMENTS

### 5.1 Update Home Page (page.tsx)

**Key changes:**
- Better hero section typography
- Clearer separation of upload zone and business rules
- Improved responsive padding

```jsx
'use client';

import React, { useState } from 'react';
import { ReceiptData, ExtractResponse } from '@/types/receipt';
import { ReceiptUploader } from '@/components/ReceiptUploader';
import { ImagePreview } from '@/components/ImagePreview';
import { VerificationForm } from '@/components/VerificationForm';
import {
  Layers,
  Sparkles,
  FileCheck2,
  Info
} from 'lucide-react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

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
    <main className="min-h-screen flex flex-col bg-neutral-50">
      {/* Header: Sticky, dark background */}
      <header className="bg-neutral-900 border-b border-neutral-800 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-pink-500 p-0.5 flex items-center justify-center shadow-md">
              <div className="w-full h-full bg-neutral-900 rounded-[10px] flex items-center justify-center">
                <Layers className="w-5 h-5 text-sky-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base tracking-tight text-white">
                  Pelangi Frame
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30">
                  AI Receipt Intelligence
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Digitalisasi Nota, Rekonsiliasi Otomatis & Piutang Reseller
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-xs text-neutral-300">
            <span className="flex items-center gap-1.5 bg-neutral-800 px-3 py-1.5 rounded-lg border border-neutral-700">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Gemini VLM Powered
            </span>
            <span className="flex items-center gap-1.5 bg-neutral-800 px-3 py-1.5 rounded-lg border border-neutral-700">
              <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
              Sheets API v4 Connected
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 max-w-2xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {!extractedData ? (
          /* Upload Screen */
          <div className="py-4 sm:py-8">
            {/* Hero Section */}
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
                Pindai & Rekonsiliasi Nota Fisik
              </h2>
              <p className="text-sm text-neutral-600 mt-3 leading-relaxed max-w-lg mx-auto">
                Ambil foto nota dari kamera ponsel atau unggah file foto. Sistem AI akan secara otomatis mengekstrak item barang, memisahkan catatan NOTA LAMA, serta mencocokkan perhitungan DP.
              </p>
            </div>

            {/* Upload Zone */}
            <ReceiptUploader
              onExtractSuccess={handleExtractSuccess}
              isProcessing={isProcessing}
              setIsProcessing={setIsProcessing}
              backendUrl={BACKEND_URL}
            />

            {/* Business Rules Card */}
            <div className="mt-8 bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
              <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wide flex items-center gap-2 mb-3">
                <Info className="w-4 h-4 text-primary-600" />
                Aturan Khusus Akuntansi Pelangi Frame
              </h4>
              <ul className="text-xs text-neutral-600 space-y-2 list-disc list-inside">
                <li>
                  <strong className="text-neutral-800">Pemisahan Piutang Bawaan:</strong> Pola tulisan{' '}
                  <code className="text-primary-700 bg-primary-50 px-1 py-0.5 rounded font-mono text-[10px]">
                    NOTA LAMA [No] ([Tgl]) [Nominal]
                  </code>{' '}
                  dipisahkan dari daftar barang baru untuk menghindari double-counting omzet.
                </li>
                <li>
                  <strong className="text-neutral-800">Formula Rekonsiliasi:</strong> Grand Total = Subtotal Barang Baru + Piutang Lama, Sisa Tagihan = Grand Total - DP.
                </li>
                <li>
                  <strong className="text-neutral-800">Buku Piutang Reseller:</strong> Mutasi dicatat ke worksheet Buku_Piutang_Reseller jika pelanggan bertipe Reseller atau memiliki sisa tagihan.
                </li>
              </ul>
            </div>
          </div>
        ) : (
          /* Verification Dashboard */
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-neutral-900">
                  Dashboard Verifikasi Nota
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  Bandingkan visual nota asli di sebelah kiri dengan data terstruktur di sebelah kanan.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left: Image Preview (sticky on desktop) */}
              <div className="lg:col-span-5 lg:sticky lg:top-24">
                <ImagePreview
                  imageUrl={previewImageUrl}
                  altText={`Nota ${extractedData.nomor_faktur}`}
                />
              </div>

              {/* Right: Verification Form */}
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
      <footer className="bg-white border-t border-neutral-200 py-4 text-center text-xs text-neutral-500">
        &copy; {new Date().getFullYear()} Bengkel Bingkai & Cermin "Pelangi Frame". All rights reserved.
      </footer>
    </main>
  );
}
```

---

## 6. ACCESSIBILITY CHECKLIST

After implementing components, verify:

- [ ] All buttons/links have visible focus indicators (Tab key)
- [ ] Form labels are associated with inputs via `htmlFor`
- [ ] Error messages are announced to screen readers (`role="alert"`)
- [ ] Color contrast passes WCAG AA (4.5:1 for text)
- [ ] Icon buttons have `aria-label`
- [ ] Modal focus is trapped (Tab doesn't escape)
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] No content is hidden from keyboard users

**Testing commands:**
```bash
# Run Lighthouse audit in Chrome DevTools
# Test with keyboard only (no mouse)
# Test with screen reader (NVDA on Windows, VoiceOver on macOS)
```

---

## 7. TESTING STRATEGY

### Unit Tests (Jest)

Example test for Button component:

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/base/Button';
import { Trash2 } from 'lucide-react';

describe('Button', () => {
  it('renders primary button', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toHaveClass('bg-primary-500');
  });

  it('renders loading state', () => {
    render(<Button isLoading>Save</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByRole('button')).toHaveClass('animate-spin');
  });

  it('renders with icon', () => {
    render(
      <Button icon={<Trash2 data-testid="icon" />}>
        Delete
      </Button>
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

---

## Conclusion

This implementation guide provides specific code patterns and examples for refactoring the Pelangi Frame frontend according to the design system spec. Follow phases 1–4 sequentially to avoid breaking existing functionality while systematically improving UX/UI.

