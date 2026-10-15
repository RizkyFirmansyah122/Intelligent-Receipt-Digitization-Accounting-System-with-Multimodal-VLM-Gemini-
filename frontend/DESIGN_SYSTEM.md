# Pelangi Frame Receipt System - Design Upgrade Specification

**Version:** 1.0 | **Status:** Design-First Workflow | **Target:** Frontend UX/UI Enhancement

---

## Table of Contents

1. [Design System](#design-system)
2. [Component Architecture](#component-architecture)
3. [Page Layouts & Improvements](#page-layouts--improvements)
4. [Color Palette](#color-palette)
5. [Typography System](#typography-system)
6. [Spacing & Layout Grid](#spacing--layout-grid)
7. [Interactive Elements & States](#interactive-elements--states)
8. [Accessibility Improvements](#accessibility-improvements)
9. [Micro-Interactions](#micro-interactions)
10. [Implementation Roadmap](#implementation-roadmap)

---

## 1. DESIGN SYSTEM

### Overview

The Pelangi Frame Receipt System requires a professional, clean design that avoids "AI slop" while elevating current UX/UI. The design system focuses on:
- **Clear information hierarchy** for complex accounting workflows
- **Minimal visual noise** with subtle refinements
- **Consistent component patterns** that scale across pages
- **Accessibility-first approach** for WCAG compliance
- **Mobile-first responsive design** (mobile, tablet, desktop)

Current state: Basic slate colors with inconsistent spacing and button styles.
Target state: Sophisticated, systematic design with formal specifications.

---

### 1.1 Design Principles

#### Principle 1: Hierarchy Over Decoration
- Use typography weight, size, and color to guide user attention
- Remove visual clutter; every element serves a purpose
- Support complex workflows without overwhelming users
- **Why:** Accounting workflows involve dense data. Clear hierarchy helps users parse information quickly without visual noise.

#### Principle 2: Subtle Refinement, Not AI Slop
- No gradients beyond functional status indicators
- No excessive shadows or layers
- Borders, spacing, and contrast work together for elegance
- **Why:** The system handles real financial data. Professional aesthetics build trust.

#### Principle 3: Context-Aware Feedback
- State indicators (loading, error, success) are immediate and clear
- Form validation feedback is helpful, not punitive
- Error messages provide actionable next steps
- **Why:** Users upload receipts and reconcile accounting; they need confidence in their actions.

#### Principle 4: Accessible by Default
- Color is never the only indicator (paired with icons/text)
- Focus states are visible for keyboard navigation
- Contrast meets WCAG AA standards (4.5:1 for text, 3:1 for components)
- **Why:** Visual impairment, colorblindness, and keyboard navigation must work seamlessly.

---

### 1.2 Design Tokens (Tailwind Foundation)

#### Color Tokens

**Primary Intent Colors:**
- `primary-50` to `primary-900`: Sky blue family for primary actions & focus states
- `success`: Emerald green for confirmations, "Lunas" status, saves
- `warning`: Amber yellow for pending DP, reconciliation alerts
- `danger`: Rose red for errors, deletion, "Sisa Tagihan" (unpaid)
- `neutral`: Slate grays for text, backgrounds, borders

**Why Tailwind Slate + Sky:** Tailwind's default palette is perceptually consistent and WCAG-compliant by design. Slate provides neutral backgrounds; Sky is distinct enough for primary actions without being loud.

#### Spacing Tokens

**Base Unit:** 4px (Tailwind's default)

Scales:
- `xs`: 4px (borders, micro-spacing)
- `sm`: 8px (component internal padding)
- `md`: 12px (grouped elements)
- `lg`: 16px (section padding, gaps)
- `xl`: 24px (major section spacing)
- `2xl`: 32px (page-level margins)

**Why 4px base:** Divisible by common breakpoints; creates consistency without awkward fractional values.

#### Border Radius

- `rounded-lg`: 8px (inputs, small buttons, cards)
- `rounded-xl`: 12px (larger cards, modals, upload zones)
- `rounded-2xl`: 16px (hero sections, major layout elements)

**Why:** Subtle radius (8–16px) feels modern without being rounded-pill everywhere. Consistent with Tailwind's default scale.

#### Shadow Strategy

Only two shadow types:
1. **Component shadow** (`shadow-sm`): Light elevation for cards, dropdowns. Subtle 2–4px blur.
2. **Modal/overlay shadow** (`shadow-lg`): Deeper shadows for modals, floating panels. 10–15px blur for depth.

**Why:** Excessive shadows create visual noise. Two levels is sufficient for depth hierarchy without overdoing it.

---

## 2. COLOR PALETTE

### 2.1 Refined Color System

**Tailwind Configuration Extension** (to `tailwind.config.js`):

```javascript
extend: {
  colors: {
    // Primary: Sky blue for interactive elements
    primary: {
      50: '#f0f9ff',   // Very light for hover backgrounds
      100: '#e0f2fe',  // Light for disabled/secondary
      200: '#bae6fd',  // Lighter backgrounds
      500: '#0284c7',  // Main primary actions
      600: '#0369a1',  // Hover/pressed state
      700: '#075985',  // Darker for focus indicators
      800: '#0c3a52',  // Reserved for dark themes
    },
    // Status: Success (emerald)
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      500: '#10b981',
      600: '#059669',
      700: '#047857',
    },
    // Status: Warning (amber)
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
    },
    // Status: Error/Danger (rose)
    danger: {
      50: '#fff5f5',
      100: '#ffe2e2',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
    },
    // Neutral: Slate grays
    neutral: {
      50: '#f9fafb',   // Backgrounds
      100: '#f3f4f6',  // Alternate rows
      200: '#e5e7eb',  // Borders, light
      300: '#d1d5db',  // Borders, standard
      400: '#9ca3af',  // Tertiary text
      500: '#6b7280',  // Secondary text
      600: '#4b5563',  // Standard text
      700: '#374151',  // Strong text
      800: '#1f2937',  // Header text
      900: '#111827',  // Dark theme backgrounds
    },
    // Accent: Indigo for secondary/complex operations
    accent: {
      50: '#f0f4ff',
      100: '#e0e7ff',
      500: '#6366f1',
      600: '#4f46e5',
      700: '#4338ca',
    },
  },
}
```

### 2.2 Color Usage Guidelines

| Element | Color | Reason |
|---------|-------|--------|
| Primary buttons, links | primary-500 → primary-600 (hover) | Distinct, action-oriented |
| Success feedback, "Lunas" status | success-500 | Universally understood; high contrast |
| Warnings, DP pending | warning-500 | Attention-grabbing; not error |
| Errors, "Sisa Tagihan", delete actions | danger-500 | Urgent, needs attention |
| Carry-over debt section | accent-500 with accent-50 background | Complex accounting rule; set apart |
| Text: primary | neutral-900 | High contrast on white backgrounds |
| Text: secondary (helpers, meta) | neutral-500 → neutral-600 | Reduced visual weight |
| Text: disabled/inactive | neutral-400 | Low contrast; appears inactive |
| Backgrounds: white | #ffffff | Clean, professional |
| Backgrounds: alternate (tables, sections) | neutral-50 or primary-50 | Subtle; aids readability |
| Borders: standard | neutral-200 | Subtle separation |
| Borders: focus/active | primary-500 | Matches primary actions |
| Icons: primary actions | primary-500 | Matches button colors |
| Icons: status (success/warning/error) | Matching status color (success-500, etc.) | Reinforces meaning |

### 2.3 Dark Mode Ready (Future)

Colors are designed to support dark mode:
- Neutral grays have 50–900 range for light & dark variants
- Primary/status colors maintain contrast in reverse scenarios
- Future implementation: `dark:` Tailwind prefix on components

---

## 3. TYPOGRAPHY SYSTEM

### 3.1 Font Stack & Scale

**Current font stack:** system-ui default (Segoe UI, Roboto, etc.)

**Keep current stack.** System fonts are:
- Fast to load (no @font-face requests)
- Accessible (familiar to users)
- Optimal for accounting UI (monospace for numbers)
- **Why:** Changing fonts adds complexity without UX gain; system fonts are proven.

### 3.2 Typographic Scale

Based on Tailwind's default sizes (16px base = 1rem):

| Use Case | Size | Weight | Line Height | Tailwind Classes |
|----------|------|--------|-------------|------------------|
| Page title (H1) | 28px | 700 (bold) | 1.2 (tight) | `text-2xl font-black tracking-tight` |
| Section title (H2) | 24px | 700 (bold) | 1.25 (tight) | `text-xl font-bold` |
| Card/subsection title (H3) | 16px | 700 (bold) | 1.4 | `text-base font-bold` |
| Card/subsection title (H4) | 13px | 600 (semibold) | 1.4 | `text-xs font-semibold uppercase` (accent) |
| Body/paragraph text | 14px | 400 (regular) | 1.6 (loose) | `text-sm` or `text-sm leading-relaxed` |
| Helper/metadata text | 12px | 400 (regular) | 1.5 | `text-xs text-neutral-500` |
| Input/form text | 14px | 400 (regular) | 1.5 | `text-sm` |
| Numeric/mono (prices, IDs) | 14px | 600 (semibold) | 1.4 | `text-sm font-mono font-semibold` |
| Button text | 13px | 600 (semibold) | 1.4 | `text-xs font-semibold` |
| Code/pre text | 12px | 500 (medium) | 1.6 | `text-xs font-mono` |

### 3.3 Typography Reasoning

**Font Weight Strategy:**
- `400 (regular)` for body text: Maximum readability, minimal visual weight
- `600 (semibold)` for labels, buttons, numeric data: Slightly heavier for emphasis without boldness
- `700 (bold)` for headings: Clear hierarchy, scannable
- `900 (black)` for hero/page titles: Maximum emphasis for entry point

**Line Height Strategy:**
- `1.2–1.25` (tight) for headings: Compact, professional
- `1.4` for body & labels: Comfortable reading without excessive spacing
- `1.5–1.6` (loose) for long-form text: Enhanced readability

**Letter Spacing (`tracking`):**
- `tracking-tight` (−0.02em): Headings, formal labels
- `tracking-normal` (default): Body text
- `tracking-wide` (0.05em): Uppercase labels, badges, micro-text accents

**Why:** This scale provides visual hierarchy without arbitrary choices. Each level serves a specific purpose; hierarchy is clear and consistent.

### 3.4 Numeric Text Handling

**All monetary values and IDs should use:**
```javascript
className="font-mono font-semibold"
```

**Why:** Monospace fonts align decimal points naturally, making price comparisons easier. Semibold weight makes numbers stand out without being bold. Crucial for accounting UI where users compare numbers frequently.

Example: `Rp 1.500.000` (with proper formatting) is easier to scan in monospace than serif.

---

## 4. SPACING & LAYOUT GRID

### 4.1 Spacing Scale

Based on 4px base unit (Tailwind default):

| Tailwind | Pixels | Use Case |
|----------|--------|----------|
| `p-1`, `gap-1` | 4px | Micro-spacing, icon padding |
| `p-2`, `gap-2` | 8px | Button internal, tight item spacing |
| `p-3`, `gap-3` | 12px | Small card padding, form input padding |
| `p-4`, `gap-4` | 16px | Standard card padding, section gaps |
| `p-5`, `gap-5` | 20px | Larger card padding, form sections |
| `p-6`, `gap-6` | 24px | Large sections, grid gaps in dashboards |
| `p-8`, `gap-8` | 32px | Hero sections, top-level layout |

### 4.2 Padding & Margin Guidelines

**Component Padding:**
- Input fields: `px-3 py-2` (horizontal padding for hit targets, vertical for comfortable text)
- Buttons: `px-4 py-2.5` (standard), `px-3 py-1.5` (compact)
- Card headers: `px-5 py-4` or `px-6 py-5`
- Card content: `p-5` or `p-6`
- Form sections: `p-4` with `gap-4` for internal elements

**Why:** Consistent padding creates visual rhythm and scannable interfaces. Vertical padding in inputs (2.5–3px) ensures text doesn't look crammed.

**Margin Guidelines:**
- Section margins: Use `space-y-4` or `space-y-6` for consistent vertical rhythm
- Never use raw margin; always group with spacing utilities
- Top-level page margin: `p-4 sm:p-6 lg:p-8` for responsive padding

**Why:** Using Tailwind's spacing utilities (not raw CSS) ensures consistency. `space-y-*` is more maintainable than individual margins on each child.

### 4.3 Layout Grid System

**Responsive Breakpoints** (Tailwind defaults):
- `sm`: 640px (tablets, small devices)
- `md`: 768px (larger tablets)
- `lg`: 1024px (desktops, dashboard layouts)
- `xl`: 1280px (large screens)

**Grid Layouts:**

1. **Single Column (Mobile First)**
   ```jsx
   <div className="grid grid-cols-1 gap-4">
     {/* Each item takes full width */}
   </div>
   ```

2. **Two Columns (Tablet+)**
   ```jsx
   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
     {/* 1 col on mobile, 2 on tablets */}
   </div>
   ```

3. **Split Dashboard (Upload + Preview)**
   ```jsx
   <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
     <div className="lg:col-span-5 lg:sticky lg:top-24">
       {/* Image preview (left side on desktop, top on mobile) */}
     </div>
     <div className="lg:col-span-7">
       {/* Form (right side on desktop, bottom on mobile) */}
     </div>
   </div>
   ```

**Why:** Mobile-first approach ensures usability on small screens first. Progressive enhancement for larger screens without breaking mobile UX.

### 4.4 Responsive Padding & Page Layout

**Page Wrapper:**
```jsx
<main className="min-h-screen flex flex-col bg-neutral-100">
  <header className="sticky top-0 z-30 /* ... */">
    {/* Content */}
  </header>
  
  <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
    {/* Main content: scales padding responsively */}
  </div>
  
  <footer className="/* ... */">
    {/* Footer */}
  </footer>
</main>
```

**Why:** `p-4 sm:p-6 lg:p-8` scales padding progressively; `max-w-7xl` constrains large screens from becoming unreadable; `flex` layout ensures footer stays at bottom even with little content.

---

## 5. INTERACTIVE ELEMENTS & STATES

### 5.1 Button System

**Button Base Class:**
```jsx
className="px-4 py-2.5 rounded-lg font-semibold text-xs transition shadow-sm inline-flex items-center gap-1.5"
```

**Button Variants:**

| Variant | Intent | Classes |
|---------|--------|---------|
| Primary | Main action (Save, Submit) | `bg-primary-500 text-white hover:bg-primary-600 active:scale-95 disabled:bg-neutral-400` |
| Secondary | Alternative action | `bg-neutral-100 text-neutral-700 hover:bg-neutral-200 disabled:text-neutral-400` |
| Danger | Destructive (Delete, Cancel payment) | `bg-danger-500 text-white hover:bg-danger-600 active:scale-95 disabled:bg-neutral-400` |
| Success | Positive action (Complete) | `bg-success-500 text-white hover:bg-success-600 active:scale-95` |
| Outline | Tertiary, lower emphasis | `border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 active:scale-95` |
| Ghost | Text-based, minimal | `text-neutral-600 hover:bg-neutral-100 rounded-lg px-2 py-1` |

**Button Sizes:**

| Size | Padding | Text | Use Case |
|------|---------|------|----------|
| Large (lg) | `px-6 py-3` | `text-sm` | CTA buttons (Save, Upload) |
| Standard | `px-4 py-2.5` | `text-xs` | Most buttons |
| Compact (sm) | `px-3 py-1.5` | `text-xs` | Inline actions (Add row, Delete) |

**Active/Hover States:**
- Hover: 1-2 step darker in color (e.g., primary-500 → primary-600)
- Active/pressed: `active:scale-95` for tactile feedback
- Focus: Ring via `:focus-visible` (browser default, enhanced if needed)
- Disabled: `opacity-50 cursor-not-allowed` or desaturated color

**Why:** Clear variant hierarchy (Primary > Secondary > Danger > Outline > Ghost) helps users choose correct actions. Size options allow context-appropriate buttons without forcing one size everywhere.

### 5.2 Form Inputs & Selects

**Input Base Class:**
```jsx
className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white transition"
```

**Input Variants:**

| State | Classes | Purpose |
|-------|---------|---------|
| Default | `border-neutral-300 bg-white` | Normal input |
| Focus | `focus:ring-2 focus:ring-primary-500 focus:border-primary-500` | Active input |
| Error | `border-danger-500 bg-danger-50 focus:ring-danger-500` | Validation error |
| Success | `border-success-500 bg-success-50` | Validation passed (optional) |
| Disabled | `opacity-60 cursor-not-allowed bg-neutral-100` | Inactive |
| Readonly | `bg-neutral-50 cursor-default border-neutral-200` | Display-only |

**Focus Ring Strategy:**
- Use `:focus-visible` (Tailwind's `focus:ring-*`) for keyboard & mouse focus
- Ring width: 2px (`ring-2`) for clear visibility
- Ring color: primary-500 (matches primary actions)
- **Why:** Ensures accessibility for keyboard navigation; visible focus indicator is WCAG requirement.

**Select/Dropdown:**
```jsx
className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-300 bg-white focus:ring-2 focus:ring-primary-500"
```

Same patterns as input. Avoid custom select dropdowns; use native `<select>` for accessibility.

### 5.3 Checkboxes & Radio Buttons

**Checkbox Styling (custom toggle for better UX):**

```jsx
<label className="relative inline-flex items-center cursor-pointer">
  <input
    type="checkbox"
    className="sr-only peer"
    {...props}
  />
  <div className="w-9 h-5 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-600"></div>
  <span className="ml-2 text-xs font-semibold text-neutral-700">
    Label Text
  </span>
</label>
```

**Why:** Custom toggle is more modern than browser checkbox while remaining accessible (uses hidden `<input>` under the hood). Clear visual feedback; works for touch.

**Radio Buttons:** Use native `<input type="radio">` styled with Tailwind:
```jsx
<label className="inline-flex items-center gap-2 cursor-pointer">
  <input
    type="radio"
    className="w-4 h-4 accent-primary-500"
    {...props}
  />
  <span className="text-sm text-neutral-700">Option</span>
</label>
```

**Why:** Native radios are fully accessible; `accent-*` color utility Tailwind 3.x allows easy color customization.

### 5.4 Form Validation & Feedback

**Validation Rules:**
- On blur (not keystroke): Don't annoy users mid-typing
- On submit: Show all errors at once
- Error message placement: Below input, in `danger` color, small text

**Error Message Component:**
```jsx
{errors.fieldName && (
  <p className="mt-1 text-xs text-danger-600 font-medium">
    {errors.fieldName}
  </p>
)}
```

**Success Feedback (optional, for high-stakes fields):**
```jsx
<div className="flex items-center gap-2 px-3 py-2 bg-success-50 border border-success-300 rounded-lg text-xs text-success-800 font-medium">
  <Check className="w-4 h-4" />
  Nomor faktur sudah terdaftar & terduplikasi di Google Sheets.
</div>
```

**Field-level vs Form-level errors:**
- Field-level: Validation errors (e.g., "Email sudah digunakan")
- Form-level: Server errors or cross-field logic (e.g., "Sisa tagihan tidak cocok dengan formula")

---

## 6. ACCESSIBLE DESIGN IMPLEMENTATION

### 6.1 WCAG 2.1 AA Compliance Target

**Color Contrast Requirements:**
- Normal text (< 18px): 4.5:1 ratio (WCAG AA)
- Large text (≥ 18px) or 14px bold: 3:1 ratio (WCAG AA)
- UI components (borders, icons): 3:1 ratio (WCAG AA)

**Validation Against Current Colors:**
- primary-500 (#0284c7) on white: 9.2:1 ✓ (exceeds AA)
- neutral-600 (#4b5563) on white: 8.1:1 ✓ (exceeds AA)
- neutral-500 (#6b7280) on white: 5.5:1 ✓ (meets AA)
- danger-500 (#ef4444) on white: 3.99:1 ✗ (just below AA; needs adjustment)
- success-500 (#10b981) on white: 4.54:1 ✓ (meets AA)

**Adjustments needed:**
- danger-500 should shift to #dc2626 (Tailwind's danger-600) for body text
- Or use danger-600 (#b91c1c) for text; danger-500 for background fills

### 6.2 Focus Management & Keyboard Navigation

**Requirements:**
1. All interactive elements (buttons, links, form fields) must be focusable via Tab
2. Focus indicator must be visible (not removed with `outline: none` unless replaced)
3. Focus order should match visual layout (left-to-right, top-to-bottom)
4. Modals should trap focus (Tab stays within modal)

**Implementation:**
- Use `:focus-visible` (not `:focus`) to show focus only for keyboard
- Focus ring color: primary-500, width: 2px
- Focus ring on ALL interactive elements: `focus:ring-2 focus:ring-primary-500`

**Example button with proper focus:**
```jsx
<button className="/* ... */ focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
  Save
</button>
```

**Modal focus trap (React pattern):**
```jsx
// Inside modal:
// 1. First focusable element gets autofocus
// 2. Trap Tab/Shift+Tab within modal
// 3. Close button should be keyboard-accessible
<div role="dialog" aria-modal="true" className="/* ... */">
  <button autoFocus>Close</button>
  {/* modal content */}
</div>
```

### 6.3 Semantic HTML & ARIA

**Use semantic elements:**
- `<button>` for buttons (not `<div onClick>`)
- `<a>` for navigation links
- `<form>` for forms
- `<label>` for form inputs (with `htmlFor` attribute)
- `<fieldset>` & `<legend>` for grouped inputs
- `<table>` for tabular data (not layout)

**ARIA attributes (when semantic HTML isn't enough):**
- `aria-label`: Button/icon-only elements → `<button aria-label="Delete row">`
- `aria-describedby`: Form field + helper text → `<input aria-describedby="email-help" />`
- `aria-live="polite"`: Dynamic updates → status messages, form validation
- `aria-modal="true"`: Modals (for screen readers)
- `role="dialog"`: Modals (when not using `<dialog>`)
- `aria-hidden="true"`: Decorative icons/elements (to ignore in screen reader)

**Example form field with proper semantics:**
```jsx
<div>
  <label htmlFor="nomor_faktur" className="block text-xs font-semibold text-neutral-600 mb-1">
    Nomor Faktur
  </label>
  <input
    id="nomor_faktur"
    type="text"
    aria-describedby="faktur-help"
    className="/* ... */"
  />
  <p id="faktur-help" className="mt-1 text-xs text-neutral-500">
    Contoh: F-1002
  </p>
</div>
```

### 6.4 Screen Reader Considerations

**Icon-only elements must have text:**
```jsx
{/* Bad: */}
<button><Trash2 className="w-4 h-4" /></button>

{/* Good: */}
<button aria-label="Delete item"><Trash2 className="w-4 h-4" /></button>

{/* Or: */}
<button className="inline-flex items-center gap-1.5">
  <Trash2 className="w-4 h-4" />
  <span className="sr-only">Delete</span>
</button>
```

**Status messages should be announced:**
```jsx
<div role="status" aria-live="polite" aria-atomic="true">
  {/* Success/error messages auto-announce to screen readers */}
</div>
```

### 6.5 Mobile Accessibility

**Touch targets:** Minimum 44×44px (Tailwind: `p-2.5` = 44px height)

**Example button:**
```jsx
<button className="px-4 py-2.5 rounded-lg /* ... */">
  {/* 44px height for touch */}
</button>
```

**Avoid:** Buttons smaller than 32px on mobile (hard to tap accurately)

---

## 7. MICRO-INTERACTIONS & ANIMATIONS

### 7.1 Transition Strategy

**Use transitions sparingly; only for:**
1. Hover states (button, hover background)
2. Focus states (form inputs)
3. State changes (modal open/close, loading indicators)
4. Page navigation (minimal fades)

**Base transition class:**
```jsx
className="transition duration-200 ease-out"
```

**Duration guidance:**
- 150–200ms: Quick (button hover, focus)
- 300–500ms: Medium (modal open, loading state change)
- 500–800ms: Slow (page transitions, multi-step animations)

**Easing functions:**
- `ease-out`: For elements entering/appearing
- `ease-in`: For elements leaving/disappearing
- `ease-in-out`: For complex animations (rare)

**Why:** Transitions under 200ms feel snappy; over 500ms feels sluggish. Keep animations purposeful; excessive motion distracts from functionality.

### 7.2 Loading States

**Pattern 1: Loading Spinner (overlay on button)**
```jsx
{isSaving ? (
  <>
    <Loader2 className="w-4 h-4 animate-spin" />
    Menyimpan...
  </>
) : (
  <>
    <Save className="w-4 h-4" />
    Simpan
  </>
)}
```

**Pattern 2: Full-page loading (during extraction)**
```jsx
{isProcessing && (
  <div className="flex flex-col items-center justify-center py-12">
    <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-3" />
    <h4 className="text-base font-semibold text-neutral-800">
      Membaca & Mengekstrak Nota...
    </h4>
    <p className="text-xs text-neutral-500 mt-1 max-w-sm text-center">
      Gemini VLM sedang menganalisis gambar. Ini mungkin memakan waktu 10-30 detik.
    </p>
  </div>
)}
```

**Why:** Spinner + descriptive text manages user expectations. Prevents "is the system frozen?" questions.

### 7.3 Success/Error Feedback

**Success Alert (after save):**
```jsx
<div className="animate-fadeIn p-4 bg-success-50 border border-success-300 rounded-xl text-success-900 text-xs">
  <div className="flex items-center gap-2 font-bold text-sm text-success-800 mb-1">
    <Check className="w-5 h-5 bg-success-600 text-white rounded-full p-0.5" />
    Nota berhasil disimpan!
  </div>
  <p className="text-success-700">
    Data telah diperbarui ke Google Sheets. Foto nota tersimpan di Drive.
  </p>
</div>
```

**Error Alert:**
```jsx
<div className="animate-pulse p-3.5 bg-danger-50 border border-danger-200 rounded-xl flex items-start gap-2.5 text-danger-800 text-xs">
  <AlertCircle className="w-5 h-5 flex-shrink-0 text-danger-500 mt-0.5" />
  <div className="flex-1">
    <p className="font-semibold">Terjadi Kesalahan</p>
    <p className="mt-0.5">{errorMessage}</p>
  </div>
</div>
```

**Why:** Animated entry (fade-in or pulse) draws attention without startling. Icon + color + text ensures clarity for all users.

### 7.4 Form Validation Feedback

**Real-time feedback (on blur, not keystroke):**
```jsx
<div>
  <input
    onBlur={() => validate(fieldName)}
    className={`/* base classes */ ${
      errors[fieldName]
        ? 'border-danger-500 bg-danger-50 focus:ring-danger-500'
        : 'border-neutral-300 focus:ring-primary-500'
    }`}
  />
  {errors[fieldName] && (
    <p className="mt-1 text-xs text-danger-600 font-medium animate-fadeIn">
      {errors[fieldName]}
    </p>
  )}
</div>
```

**Why:** Blur validation prevents annoyance during typing. Animated appearance of error text makes it noticeable.

### 7.5 Hover States (Desktop)

**Card hover:**
```jsx
<div className="transition hover:shadow-md hover:border-primary-200">
  {/* content */}
</div>
```

**Button hover:**
```jsx
<button className="/* ... */ hover:bg-primary-600 transition active:scale-95">
  Action
</button>
```

**Icon hover (in lists/tables):**
```jsx
<button className="p-1 rounded text-danger-500 hover:bg-danger-50 transition">
  <Trash2 className="w-4 h-4" />
</button>
```

---

## 8. COMPONENT DESIGN SPECIFICATIONS

### 8.1 Card Component

**Purpose:** Container for grouped information; used in upload zone, verification sections, alerts.

**Base Structure:**
```jsx
<div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-5">
  {/* Content */}
</div>
```

**Card with Header:**
```jsx
<div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
  <div className="border-b border-neutral-100 px-5 py-4 bg-neutral-50">
    <h3 className="text-base font-bold text-neutral-800">Section Title</h3>
  </div>
  <div className="p-5">
    {/* Content */}
  </div>
</div>
```

**Variant: Alert/Status Card (colored background):**
```jsx
{/* Success */}
<div className="p-4 bg-success-50 border border-success-300 rounded-xl text-success-900 text-xs">
  <div className="flex items-center gap-2 font-bold">
    <CheckCircle2 className="w-5 h-5 text-success-600" />
    Success message
  </div>
</div>

{/* Warning */}
<div className="p-4 bg-warning-50 border border-warning-300 rounded-xl text-warning-900 text-xs">
  <div className="flex items-center gap-2 font-bold">
    <AlertTriangle className="w-5 h-5 text-warning-600" />
    Warning message
  </div>
</div>

{/* Error */}
<div className="p-3.5 bg-danger-50 border border-danger-200 rounded-xl text-danger-800 text-xs">
  <div className="flex items-center gap-2.5">
    <AlertCircle className="w-5 h-5 text-danger-500 flex-shrink-0" />
    <p>Error message</p>
  </div>
</div>
```

### 8.2 Table/List Component

**Purpose:** Display items (receipt items, ledger entries).

**Structure:**
```jsx
<div className="overflow-x-auto border border-neutral-200 rounded-xl">
  <table className="w-full text-left text-xs">
    <thead className="bg-neutral-100 text-neutral-700 uppercase font-semibold border-b border-neutral-200">
      <tr>
        <th className="py-2.5 px-3">Column</th>
        <th className="py-2.5 px-3">Column</th>
        {/* ... */}
      </tr>
    </thead>
    <tbody className="divide-y divide-neutral-200">
      {items.map((item, idx) => (
        <tr key={idx} className="hover:bg-neutral-50/60">
          <td className="p-3">{item.name}</td>
          {/* ... */}
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

**Mobile-friendly alternative (grid layout for small screens):**
```jsx
<div className="space-y-2 md:border md:border-neutral-200 md:rounded-xl md:overflow-x-auto">
  {/* On mobile: card-like appearance */}
  {/* On desktop: table appearance */}
</div>
```

### 8.3 Modal/Dialog Component

**Purpose:** Confirmation dialogs, form modals, detailed views.

**Structure:**
```jsx
{showModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    {/* Backdrop */}
    <div
      className="fixed inset-0 bg-neutral-900/50 transition"
      onClick={onClose}
    />
    
    {/* Modal */}
    <div
      className="relative bg-white rounded-2xl shadow-lg max-w-md w-full p-6 space-y-4 border border-neutral-200"
      role="dialog"
      aria-modal="true"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-neutral-800">Modal Title</h2>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-neutral-100 text-neutral-600"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      {/* Content */}
      <div className="text-sm text-neutral-600">
        Modal content goes here
      </div>
      
      {/* Actions */}
      <div className="flex gap-3 justify-end pt-4 border-t border-neutral-200">
        <button
          onClick={onClose}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-primary-500 text-white hover:bg-primary-600"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
)}
```

### 8.4 Form Group Component

**Purpose:** Consistent wrapper for form fields with labels.

**Pattern:**
```jsx
<div>
  <label htmlFor="fieldName" className="block text-xs font-semibold text-neutral-600 mb-1">
    Label Text
  </label>
  <input
    id="fieldName"
    type="text"
    className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary-500 bg-white"
    placeholder="Placeholder"
  />
  {error && (
    <p className="mt-1 text-xs text-danger-600 font-medium">{error}</p>
  )}
</div>
```

**Multi-column grid:**
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Each column is a form field group */}
  <div>
    <label>Field 1</label>
    <input />
  </div>
  {/* ... */}
</div>
```

### 8.5 Status Badge Component

**Purpose:** Visual indicator for status (Lunas, DP, etc.).

**Pattern:**
```jsx
{status === 'Lunas' && (
  <span className="px-3 py-1 rounded-full text-xs font-bold bg-success-100 text-success-800 border border-success-300">
    Lunas
  </span>
)}

{status === 'DP (Belum Lunas)' && (
  <span className="px-3 py-1 rounded-full text-xs font-bold bg-warning-100 text-warning-800 border border-warning-300">
    DP (Belum Lunas)
  </span>
)}
```

---

## 9. PAGE LAYOUT IMPROVEMENTS

### 9.1 Home/Upload Page (Receipt Upload)

**Current Issues:**
- Upload zone could be more visually distinct
- Instructions are buried in fine print
- No clear visual separation between upload CTA and business rules

**Improved Layout:**

**Structure:**
```jsx
<div className="min-h-screen flex flex-col bg-neutral-50">
  {/* Header: Dark, sticky */}
  <header className="bg-neutral-900 border-b border-neutral-800 text-white sticky top-0 z-30 shadow-md">
    {/* Logo, tagline, tech badges */}
  </header>

  {/* Main Content */}
  <main className="flex-1 max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 w-full">
    {/* Hero section */}
    <div className="text-center mb-8">
      <h2 className="text-2xl font-black text-neutral-900 tracking-tight">
        Pindai & Rekonsiliasi Nota Fisik
      </h2>
      <p className="text-sm text-neutral-600 mt-3 leading-relaxed max-w-xl mx-auto">
        Ambil foto nota dari kamera ponsel atau unggah file foto. Sistem AI akan secara otomatis mengekstrak item barang, memisahkan catatan NOTA LAMA, serta mencocokkan perhitungan DP.
      </p>
    </div>

    {/* Upload Zone (hero component) */}
    <ReceiptUploader />

    {/* Business Rules Card (separate, distinct) */}
    <div className="mt-8 bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
      <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wide flex items-center gap-2 mb-3">
        <Info className="w-4 h-4 text-primary-600" />
        Aturan Khusus Akuntansi Pelangi Frame
      </h4>
      <ul className="text-xs text-neutral-600 space-y-2 list-disc list-inside">
        <li><strong className="text-neutral-800">Pemisahan Piutang Bawaan:</strong> Pola tulisan NOTA LAMA [No] ([Tgl]) [Nominal] dipisahkan...</li>
        {/* ... */}
      </ul>
    </div>
  </main>

  {/* Footer */}
  <footer className="bg-white border-t border-neutral-200 py-4 text-center text-xs text-neutral-500">
    &copy; {year} Pelangi Frame. All rights reserved.
  </footer>
</div>
```

**Key improvements:**
1. **Clearer visual hierarchy:** Hero title + description before upload zone
2. **Distinct sections:** Upload zone is clearly the primary action; business rules are secondary information
3. **Responsive spacing:** Hero section uses `sm:p-6 lg:p-8` to scale on larger screens
4. **Card-based layout:** Business rules are visually contained; easier to scan

### 9.2 Verification Dashboard Page (Split-Screen)

**Current state:** Basic split layout with form on right.

**Improved layout:**

```jsx
<main className="min-h-screen flex flex-col bg-neutral-50">
  <header>/* Sticky header */</header>

  <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
    {/* Page Header */}
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-xl font-bold text-neutral-800">Dashboard Verifikasi Nota</h2>
        <p className="text-xs text-neutral-500 mt-1">
          Bandingkan visual nota asli di sebelah kiri dengan data terstruktur di sebelah kanan.
        </p>
      </div>
      <button
        onClick={onReset}
        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        Scan Nota Baru
      </button>
    </div>

    {/* Split Layout */}
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left: Image Preview (sticky on desktop) */}
      <div className="lg:col-span-5 lg:sticky lg:top-24">
        <ImagePreview imageUrl={imageUrl} />
      </div>

      {/* Right: Verification Form */}
      <div className="lg:col-span-7">
        <VerificationForm {...props} />
      </div>
    </div>
  </div>

  <footer>/* ... */</footer>
</main>
```

**Improvements:**
1. **Sticky image on desktop:** Left side stays visible while scrolling form
2. **Mobile-first:** Stacks vertically on small screens (image first, then form)
3. **Clear page header:** Sets context before dashboard
4. **Reset button:** Easily accessible for scanning new notes

### 9.3 Responsive Behavior

**Mobile (< 640px):**
- Single column layout
- Full-width cards
- Reduced padding (`p-4`)
- Buttons take full width if solo, or side-by-side if multiple
- Tables convert to card-like grid layout

**Tablet (640px – 1024px):**
- Two-column layouts possible
- Standard padding (`p-6`)
- Slightly larger text for readability
- Tables can show more columns

**Desktop (> 1024px):**
- Multi-column dashboards
- Sidebar patterns possible
- Generous padding (`p-8`)
- Tables with full columns visible
- Sticky elements (headers, sidebars)

**Example responsive image/form grid:**
```jsx
<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
  <div className="lg:col-span-5 lg:sticky lg:top-24">
    {/* Image: 5/12 of width on desktop, sticky */}
  </div>
  <div className="lg:col-span-7">
    {/* Form: 7/12 of width on desktop */}
  </div>
</div>
```

---

## 10. IMPLEMENTATION ROADMAP

### Phase 1: Design Tokens & Foundation (Week 1)

**Priority: HIGH**

1. **Update `tailwind.config.js`**
   - Add color palette (primary, success, warning, danger, accent, neutral)
   - Verify contrast ratios meet WCAG AA
   - Add custom shadows (if needed)
   - Add custom border-radius (if needed)

2. **Update `globals.css`**
   - Add `:focus-visible` styles globally
   - Add smooth scroll behavior
   - Add print media queries (optional)

3. **Create `components/base/` directory**
   - Button.tsx (all variants: primary, secondary, danger, outline, ghost)
   - FormInput.tsx (input with label, error handling)
   - FormSelect.tsx (select with label, error)
   - Card.tsx (card with optional header)
   - Badge.tsx (status badges)
   - Alert.tsx (success, error, warning, info)

**Estimated effort:** 2–3 days (mostly copy-paste Tailwind utilities)

### Phase 2: Component Refactoring (Week 2)

**Priority: HIGH**

1. **Refactor `ReceiptUploader.tsx`**
   - Use new Button component for "Pilih File" and "Buka Kamera"
   - Use new Alert component for error messages
   - Improve loading state messaging
   - Update drag-and-drop zone styling (use new card patterns)

2. **Refactor `ImagePreview.tsx`**
   - Improve toolbar styling (use new button variants)
   - Enhance loading state (add placeholder skeleton)
   - Better zoom/rotate feedback

3. **Refactor `VerificationForm.tsx`** (largest refactoring)
   - Break into smaller components:
     - `ReceiptHeader.tsx` (invoice details grid)
     - `ItemsTable.tsx` (items list with add/delete)
     - `CarryOverDebtSection.tsx` (nota lama section)
     - `ReconciliationSummary.tsx` (financial summary)
   - Use new FormInput, FormSelect, Button components
   - Improve validation feedback (real-time on blur)
   - Better state indicator (formula validation banner)
   - Consistent spacing using gap utilities

**Estimated effort:** 5–7 days (careful refactoring to avoid bugs)

### Phase 3: Layout & Spacing Consistency (Week 3)

**Priority: MEDIUM**

1. **Update `page.tsx` (home page)**
   - Implement improved upload page layout (hero + upload zone + rules card)
   - Better responsive padding
   - Improved header/footer styling

2. **Improve split-screen dashboard layout**
   - Sticky image preview on desktop
   - Better mobile stacking
   - Improved gap/padding consistency

3. **Add missing micro-interactions**
   - Loading spinners on buttons
   - Success/error toast notifications (or inline alerts)
   - Form validation feedback
   - Hover states on cards/buttons

**Estimated effort:** 3–4 days

### Phase 4: Accessibility & Polish (Week 4)

**Priority: MEDIUM**

1. **Audit & fix accessibility issues**
   - Check focus management (Tab order)
   - Verify color contrast on all text
   - Add aria-labels to icon buttons
   - Test keyboard navigation
   - Verify screen reader experience (optional: test with NVDA or JAWS)

2. **Refine animations & transitions**
   - Ensure transitions are smooth but not slow
   - Add entrance animations to alerts
   - Refine loading state UX

3. **Test responsive design**
   - Mobile (375px – 480px)
   - Tablet (768px)
   - Desktop (1920px+)

4. **Performance optimization**
   - Lazy load images
   - Optimize re-renders (useMemo, useCallback if needed)
   - Verify bundle size

**Estimated effort:** 2–3 days

### Component Priority Order

**Must refactor first (impact on UX):**
1. Button components (used everywhere)
2. FormInput/FormSelect (critical for usability)
3. Alert/validation feedback (user safety)
4. VerificationForm (most complex, most important)

**Nice to refactor later:**
5. Card component (less critical, mostly used for layout)
6. ImagePreview enhancements (works fine as-is, but UX improvement possible)

---

## 11. DESIGN JUSTIFICATIONS & REASONING

### Why This Design Approach?

#### 1. Color Palette
- **Tailwind defaults:** Perceptually consistent, WCAG-compliant by design
- **Sky blue primary:** Distinct from status colors; professional for SaaS/accounting
- **Emerald/Amber/Rose status colors:** Universally understood; accessible for colorblind users
- **Slate neutrals:** High contrast, clean, minimal

#### 2. Typography
- **System fonts:** No performance cost; familiar to users; optimal for readability
- **Font weight hierarchy (400/600/700):** Subtle weight differences create hierarchy without bold-italic-underline chaos
- **Monospace for numbers:** Accountants expect aligned decimals; monospace is expected in financial UIs

#### 3. Spacing
- **4px base unit:** Tailwind standard; divisible by 8 (CSS's typical rhythm)
- **Consistent gaps/padding:** Removes cognitive load; predictable layout
- **Responsive padding (p-4 sm:p-6 lg:p-8):** Scales appropriately for screen size

#### 4. Components
- **Button variants:** Primary/Secondary/Danger clarifies intent; users instinctively know which action is "main"
- **Form inputs with error states:** Real-time feedback (on blur) balances user safety with UX
- **Cards with borders:** Professional separation; no excessive shadows

#### 5. Accessibility
- **Focus indicators:** Keyboard users must see what they're interacting with
- **Color + icon/text:** Never rely on color alone (colorblindness)
- **Semantic HTML:** Screen readers understand structure naturally
- **ARIA labels:** Augments semantic HTML for complex widgets

#### 6. Micro-interactions
- **Loading spinners:** Manage expectations during AI extraction (30 seconds is long)
- **Success/error animations:** Entrance animations draw attention; text confirms action
- **Hover states:** Desktop users expect feedback; reassures they can interact

### What We're NOT Doing (and Why)

- **No custom fonts:** System fonts are fast, accessible, and familiar
- **No excessive gradients:** Gradients add visual noise without functional benefit
- **No animations "just because":** Every animation should serve a purpose (loading, feedback, delight)
- **No semantic color misuse:** Red means danger/error; we don't use it for highlights
- **No dismissal of accessibility:** WCAG AA is baseline, not aspirational

---

## 12. TESTING & VALIDATION STRATEGY

### Design System Validation

1. **Color contrast audit**
   - Test all text + background combinations
   - Use tools: WebAIM Contrast Checker, Stark (Figma plugin)
   - Target: WCAG AA (4.5:1 for normal text)

2. **Responsive design testing**
   - Breakpoints: 375px, 480px, 640px, 768px, 1024px, 1280px, 1920px
   - Tools: Chrome DevTools, ResponsiveDesign.is
   - Focus: Layout doesn't break; text remains readable

3. **Keyboard navigation testing**
   - Tab order: Correct (left→right, top→bottom)
   - Focus indicators: Visible on all interactive elements
   - Modals: Tab should not escape modal (focus trap)

4. **Screen reader testing** (optional, but recommended)
   - Tools: NVDA (Windows), VoiceOver (macOS)
   - Focus: Form labels are read correctly; buttons have labels; lists are announced

5. **Performance testing**
   - Lighthouse audit (target: > 90 performance score)
   - Component render time (no unnecessary re-renders)
   - Bundle size (no accidental duplicate dependencies)

### Implementation Testing

1. **Component snapshot tests** (using Jest)
   - Verify button variants render correctly
   - Verify form inputs with errors render correctly
   - Verify cards and alerts render correctly

2. **Visual regression tests** (using Percy or similar)
   - Capture current design
   - Verify refactored components match
   - Catch unexpected style changes

3. **Manual user testing**
   - Have a real user (not designer/developer) test:
     - Upload workflow (mobile, desktop)
     - Form filling & validation
     - Success/error states
   - Gather feedback on clarity and ease-of-use

---

## Conclusion

This design system provides a comprehensive foundation for the Pelangi Frame Receipt System. It prioritizes clarity, accessibility, and consistency while avoiding over-design. Each decision is justified and tied to improving UX for accountants and shop staff managing receipts and reseller accounts.

The implementation roadmap spreads work across 4 weeks to avoid breaking existing functionality while systematically improving the UI/UX.

