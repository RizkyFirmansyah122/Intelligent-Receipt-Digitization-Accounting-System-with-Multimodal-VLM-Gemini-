# Component Patterns & Advanced Styling Guide

**Document Purpose:** Specific patterns for complex components, edge cases, and advanced Tailwind usage.

---

## 1. FORM PATTERNS

### 1.1 Multi-Column Form Grid

**Pattern for responsive form layouts:**

```jsx
{/* 4-column on desktop, 2-column on tablet, 1-column on mobile */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <FormInput label="Field 1" {...props} />
  <FormInput label="Field 2" {...props} />
  <FormInput label="Field 3" {...props} />
  <FormInput label="Field 4" {...props} />
</div>
```

**Why:** Mobile-first approach ensures usability on small screens. Progressive enhancement scales to larger screens.

### 1.2 Form Section with Background & Padding

**Pattern for grouped inputs:**

```jsx
<div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-4">
  <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wide mb-4">
    Section Title
  </h4>
  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <FormInput label="Field 1" />
    <FormInput label="Field 2" />
  </div>
</div>
```

**Key classes:**
- `bg-neutral-50`: Subtle background to group related fields
- `p-4`: Standard padding for breathing room
- `space-y-4`: Consistent vertical spacing between elements
- `rounded-xl`: Modern corner radius (12px)
- `border border-neutral-200`: Light border for separation

### 1.3 Toggle Checkbox with Label

**Pattern for boolean switches:**

```jsx
<label className="relative inline-flex items-center cursor-pointer">
  <input
    type="checkbox"
    checked={checked}
    onChange={(e) => setChecked(e.target.checked)}
    className="sr-only peer"
  />
  <div className="w-9 h-5 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-600"></div>
  <span className="ml-2 text-xs font-semibold text-neutral-700">
    Label Text
  </span>
</label>
```

**Breakdown:**
- `sr-only`: Hides the actual input (seen only by screen readers)
- `peer`: Allows styling parent based on input state
- `peer-checked:bg-primary-600`: Background changes when checked
- `peer-checked:after:translate-x-full`: Slider moves right when checked
- `after:transition-all`: Smooth animation

**Why:** Custom toggles look modern while remaining accessible (uses hidden native input).

### 1.4 Form with Inline Validation Icons

**Pattern for real-time validation feedback:**

```jsx
<div className="relative">
  <FormInput
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    onBlur={() => validateEmail()}
    error={errors.email}
    className="pr-10"
  />
  
  {!errors.email && email && (
    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-success-500">
      <CheckCircle2 className="w-5 h-5" />
    </div>
  )}
  
  {errors.email && (
    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-danger-500">
      <AlertCircle className="w-5 h-5" />
    </div>
  )}
</div>
```

**Key classes:**
- `pr-10`: Right padding to make room for icon
- `absolute right-3 top-1/2 -translate-y-1/2`: Centers icon vertically on right

**Why:** Visual feedback without extra DOM elements; icon placement is consistent.

---

## 2. TABLE & LIST PATTERNS

### 2.1 Responsive Table (Desktop Optimized)

**Pattern for data tables:**

```jsx
<div className="overflow-x-auto border border-neutral-200 rounded-xl shadow-sm">
  <table className="w-full text-sm text-left">
    <thead className="bg-neutral-100 border-b border-neutral-200 sticky top-0">
      <tr>
        <th className="px-4 py-3 font-semibold text-neutral-700 font-bold">Column 1</th>
        <th className="px-4 py-3 font-semibold text-neutral-700 text-right">Amount</th>
        <th className="px-4 py-3 font-semibold text-neutral-700 text-center">Status</th>
        <th className="px-4 py-3 font-semibold text-neutral-700 text-right w-12">Actions</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-neutral-200">
      {items.map((item) => (
        <tr key={item.id} className="hover:bg-neutral-50/60 transition">
          <td className="px-4 py-3 text-neutral-900">{item.name}</td>
          <td className="px-4 py-3 text-right font-mono font-semibold text-neutral-800">
            Rp {item.amount.toLocaleString('id-ID')}
          </td>
          <td className="px-4 py-3 text-center">
            <Badge status={item.status} />
          </td>
          <td className="px-4 py-3 text-right">
            <button aria-label="Delete" className="text-danger-500 hover:bg-danger-50 p-1 rounded">
              <Trash2 className="w-4 h-4" />
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

**Key classes:**
- `overflow-x-auto`: Allows horizontal scroll on small screens
- `sticky top-0`: Header stays at top during scroll
- `hover:bg-neutral-50/60`: Subtle row highlight on hover
- `text-right`: Right-align numeric columns for alignment
- `divide-y divide-neutral-200`: Light dividers between rows

**Mobile adaptation:**
```jsx
{/* For small screens, convert to card layout */}
<div className="space-y-3 md:hidden">
  {items.map((item) => (
    <div key={item.id} className="bg-white border border-neutral-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-neutral-900">{item.name}</span>
        <Badge status={item.status} />
      </div>
      <div className="mt-2 text-sm text-neutral-600">
        Amount: <span className="font-mono font-semibold">Rp {item.amount.toLocaleString('id-ID')}</span>
      </div>
      <button className="mt-3 w-full text-xs text-danger-600 hover:bg-danger-50 py-1 rounded">
        Delete
      </button>
    </div>
  ))}
</div>

{/* Desktop version */}
<div className="hidden md:block">
  {/* Full table */}
</div>
```

### 2.2 Empty State

**Pattern for empty tables/lists:**

```jsx
<div className="text-center py-12">
  <svg className="w-12 h-12 text-neutral-300 mx-auto mb-4" /* icon SVG */ />
  <h3 className="text-sm font-semibold text-neutral-800">Tidak ada data</h3>
  <p className="text-xs text-neutral-500 mt-1">
    Mulai dengan mengklik tombol "Tambah" di atas.
  </p>
</div>
```

**Why:** Friendly empty states reduce user confusion; guides next action.

---

## 3. CARD & SECTION PATTERNS

### 3.1 Card with Header/Footer Separation

**Pattern for complex card layouts:**

```jsx
<div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
  {/* Header with background color */}
  <div className="bg-neutral-50 border-b border-neutral-200 px-5 py-4">
    <h3 className="text-base font-bold text-neutral-900">Card Title</h3>
    <p className="text-xs text-neutral-500 mt-1">Subtitle or description</p>
  </div>

  {/* Content */}
  <div className="p-5 space-y-4">
    {/* Content here */}
  </div>

  {/* Footer with buttons */}
  <div className="border-t border-neutral-200 bg-neutral-50 px-5 py-4 flex items-center justify-end gap-3">
    <Button variant="outline">Cancel</Button>
    <Button>Save</Button>
  </div>
</div>
```

**Key classes:**
- `overflow-hidden`: Corners stay rounded (no bleed)
- `bg-neutral-50 border-b`: Header section has subtle background & border
- `px-5 py-4`: Standard padding for headers/footers
- `space-y-4`: Consistent spacing in content area

### 3.2 Highlight/Alert Card

**Pattern for important information:**

```jsx
<div className="bg-accent-50 border-2 border-accent-300 rounded-xl p-4">
  <div className="flex items-start gap-3">
    <ShieldAlert className="w-5 h-5 text-accent-600 mt-0.5 flex-shrink-0" />
    <div>
      <h4 className="font-semibold text-accent-900 text-sm">
        Special Accounting Rule
      </h4>
      <p className="text-sm text-accent-800 mt-1">
        This section follows domain-specific accounting rules. Pay close attention.
      </p>
    </div>
  </div>
</div>
```

**Key classes:**
- `border-2` (not `border-1`): Thicker border for emphasis
- `bg-accent-50`: Light background color
- `flex-shrink-0`: Icon doesn't resize
- `mt-0.5`: Slight top margin to align icon with text baseline

---

## 4. BUTTON & INTERACTIVE PATTERNS

### 4.1 Button Group (Segmented Control)

**Pattern for grouped buttons:**

```jsx
<div className="inline-flex gap-1 bg-neutral-100 p-1 rounded-lg border border-neutral-200">
  <button
    onClick={() => setView('list')}
    className={clsx(
      'px-4 py-2 rounded-md text-xs font-semibold transition',
      view === 'list'
        ? 'bg-white text-neutral-900 shadow-sm'
        : 'text-neutral-600 hover:text-neutral-900'
    )}
  >
    List View
  </button>
  <button
    onClick={() => setView('grid')}
    className={clsx(
      'px-4 py-2 rounded-md text-xs font-semibold transition',
      view === 'grid'
        ? 'bg-white text-neutral-900 shadow-sm'
        : 'text-neutral-600 hover:text-neutral-900'
    )}
  >
    Grid View
  </button>
</div>
```

**Key classes:**
- `inline-flex gap-1`: Tight grouping with small gap
- `bg-neutral-100 p-1`: Container background with internal padding
- `shadow-sm`: Selected button has subtle shadow for depth

### 4.2 Icon Button (Tertiary Action)

**Pattern for icon-only buttons in tables/lists:**

```jsx
<button
  onClick={() => deleteItem(id)}
  aria-label="Delete item"
  className="p-2 rounded-lg text-neutral-600 hover:bg-neutral-100 hover:text-danger-600 transition"
  title="Delete"
>
  <Trash2 className="w-4 h-4" />
</button>
```

**Key classes:**
- `p-2`: 32px minimum touch target (accessible)
- `text-neutral-600` → `hover:text-danger-600`: Color changes on hover
- `hover:bg-neutral-100`: Background highlight on hover
- `aria-label`: Accessibility for screen readers

### 4.3 Link Button (Tertiary)

**Pattern for link-styled buttons:**

```jsx
<button
  onClick={handleClick}
  className="text-primary-600 hover:text-primary-700 hover:underline font-medium transition text-sm"
>
  Open File →
</button>
```

---

## 5. MODAL & OVERLAY PATTERNS

### 5.1 Confirmation Modal

**Pattern for confirmation dialogs:**

```jsx
{showConfirm && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    {/* Backdrop (semi-transparent) */}
    <div
      className="fixed inset-0 bg-neutral-900/50 transition-opacity"
      onClick={onCancel}
      aria-hidden="true"
    />

    {/* Modal */}
    <div
      className="relative bg-white rounded-2xl shadow-lg max-w-sm w-full p-6 space-y-4 border border-neutral-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <h2 id="dialog-title" className="text-lg font-bold text-neutral-900">
        Confirm Action
      </h2>

      <p className="text-sm text-neutral-600">
        Are you sure you want to delete this item? This action cannot be undone.
      </p>

      <div className="flex gap-3 justify-end pt-4 border-t border-neutral-200">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Delete
        </Button>
      </div>
    </div>
  </div>
)}
```

**Key classes:**
- `fixed inset-0`: Full-screen overlay
- `z-50`: Above all other content
- `bg-neutral-900/50`: Semi-transparent backdrop (darkening effect)
- `backdrop-blur` (optional): Add for additional effect on modern browsers
- `role="dialog"` + `aria-modal="true"`: Semantic for screen readers
- `max-w-sm w-full`: Responsive width (max 384px, but adapts to smaller screens)

### 5.2 Focus Trap in Modal

**React pattern for keyboard navigation (focus trap):**

```jsx
import { useEffect, useRef } from 'react';

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const firstButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }

      // Focus trap: keep focus within modal
      if (e.key === 'Tab') {
        // Get all focusable elements
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
        const activeElement = document.activeElement;

        if (e.shiftKey) {
          // Shift+Tab
          if (activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          // Tab
          if (activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    firstButtonRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-neutral-900/50" onClick={onClose} />
      <div
        ref={modalRef}
        className="relative bg-white rounded-2xl shadow-lg p-6"
        role="dialog"
        aria-modal="true"
      >
        {children}
        <button ref={firstButtonRef} type="button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};
```

---

## 6. NOTIFICATION & TOAST PATTERNS

### 6.1 Toast Notification (Success/Error)

**Pattern for temporary notifications:**

```jsx
{notification && (
  <div
    className={clsx(
      'fixed bottom-4 right-4 z-50 max-w-sm p-4 rounded-xl shadow-lg border animate-slideUp',
      notification.type === 'success'
        ? 'bg-success-50 border-success-300 text-success-900'
        : 'bg-danger-50 border-danger-200 text-danger-800'
    )}
    role="status"
    aria-live="polite"
    aria-atomic="true"
  >
    <div className="flex items-center gap-3">
      {notification.type === 'success' ? (
        <CheckCircle2 className="w-5 h-5 text-success-600 flex-shrink-0" />
      ) : (
        <AlertCircle className="w-5 h-5 text-danger-500 flex-shrink-0" />
      )}
      <div className="flex-1">
        <p className="font-semibold text-sm">{notification.title}</p>
        <p className="text-xs opacity-90 mt-0.5">{notification.message}</p>
      </div>
      <button
        onClick={() => setNotification(null)}
        className="text-neutral-600 hover:text-neutral-900"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  </div>
)}
```

**Add animation to globals.css:**
```css
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slideUp {
  animation: slideUp 300ms ease-out;
}
```

---

## 7. LOADING & SKELETON PATTERNS

### 7.1 Loading Skeleton

**Pattern for placeholder while loading:**

```jsx
export const SkeletonCard: React.FC = () => (
  <div className="bg-white rounded-xl border border-neutral-200 p-5 animate-pulse">
    <div className="h-4 bg-neutral-200 rounded w-1/3 mb-3" />
    <div className="space-y-2">
      <div className="h-3 bg-neutral-100 rounded" />
      <div className="h-3 bg-neutral-100 rounded w-5/6" />
      <div className="h-3 bg-neutral-100 rounded w-4/6" />
    </div>
  </div>
);
```

**Why:** Shows loading progress; prevents layout shift when actual content loads.

### 7.2 Spinner Overlay

**Pattern for full-page loading:**

```jsx
{isLoading && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 backdrop-blur">
    <div className="bg-white rounded-xl shadow-lg p-8 text-center space-y-4">
      <svg className="w-12 h-12 text-primary-600 animate-spin mx-auto" /* spinner SVG */ />
      <h3 className="text-base font-semibold text-neutral-900">Loading...</h3>
      <p className="text-xs text-neutral-500">Please wait while we process your request.</p>
    </div>
  </div>
)}
```

---

## 8. RESPONSIVE PATTERNS

### 8.1 Mobile-First Media Query Pattern

**Pattern for responsive design:**

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns */}
</div>
```

### 8.2 Hidden/Visible Elements

**Pattern for device-specific visibility:**

```jsx
{/* Show on mobile only */}
<div className="md:hidden">
  Mobile-only content
</div>

{/* Hide on mobile, show on desktop */}
<div className="hidden md:block">
  Desktop-only content
</div>

{/* Show on tablets and up */}
<div className="hidden sm:block">
  Tablet+ content
</div>
```

### 8.3 Responsive Text Sizes

**Pattern for scaling typography:**

```jsx
<h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black">
  Responsive Title
</h1>
```

---

## 9. SPACING & LAYOUT EDGE CASES

### 9.1 Negative Margins (Extend to Edges)

**Pattern for full-width sections inside containers:**

```jsx
<div className="p-6">
  <div className="bg-primary-50 -mx-6 -mb-6 px-6 py-4 rounded-b-xl border-t-2 border-primary-300">
    <p>This section extends to the edges of the container.</p>
  </div>
</div>
```

**Key classes:**
- `-mx-6`: Negative margin to extend left/right
- `-mb-6`: Negative margin to extend bottom
- `px-6 py-4`: Re-adds padding inside the section

### 9.2 Aspect Ratio (Images)

**Pattern for maintaining aspect ratios:**

```jsx
<div className="aspect-video bg-neutral-100 rounded-xl overflow-hidden">
  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
</div>
```

**Aspect ratio utilities (Tailwind 3.x):**
- `aspect-auto`, `aspect-square`, `aspect-video`, `aspect-[4/3]`

---

## 10. ADVANCED TAILWIND UTILITIES

### 10.1 Using @apply for Reusable Styles

**Pattern in globals.css:**

```css
@layer components {
  .btn-primary {
    @apply px-4 py-2.5 rounded-lg font-semibold text-xs bg-primary-500 text-white hover:bg-primary-600 transition active:scale-95;
  }

  .input-base {
    @apply w-full px-3 py-2 text-sm rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary-500 transition;
  }

  .card-base {
    @apply bg-white border border-neutral-200 rounded-xl shadow-sm p-5;
  }
}
```

**Usage in components:**
```jsx
<button className="btn-primary">Click</button>
<input className="input-base" />
<div className="card-base">Content</div>
```

**Why:** Reduces repetition; easy to maintain in one place.

### 10.2 Arbitrary Values

**Pattern for values outside Tailwind scale:**

```jsx
{/* Arbitrary color */}
<div className="bg-[#f0f9ff] text-[#075985]">Content</div>

{/* Arbitrary sizing */}
<div className="w-[420px] h-[280px]">Content</div>

{/* Arbitrary spacing */}
<div className="pt-[42px]">Content</div>
```

**Use sparingly:** If you need arbitrary values, consider adding them to `tailwind.config.js` instead.

---

## Conclusion

These patterns provide proven solutions for common UI scenarios in Pelangi Frame. Use them as templates; adapt as needed for specific requirements.

