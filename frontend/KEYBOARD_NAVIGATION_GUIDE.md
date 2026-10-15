# Keyboard Navigation Guide
## Quick Reference for Users & Developers

---

## For End Users

### How to Navigate with Keyboard

#### Using Tab Key
- **Tab:** Move focus to the next interactive element
- **Shift + Tab:** Move focus to the previous interactive element
- Look for the blue outline (focus indicator) to see which element is active

#### Upload Screen (Keyboard Navigation)
```
START → Upload Zone → Choose File Button → Open Camera Button → END
         (Press Enter/Space to upload)
```

1. **Press Tab** - Focus goes to Upload Zone (you'll see blue outline)
2. **Press Enter or Space** - Opens file picker dialog
3. **Select image** - Proceeds to Verification Screen

**Alternative:**
- **Press Tab twice** - Focus goes to "Choose File" button
- **Press Enter or Space** - Opens file picker

**Mobile:**
- **Press Tab three times** - Focus goes to "Open Camera" button
- **Press Enter or Space** - Opens camera application

#### Verification Dashboard (Keyboard Navigation)

**Review Receipt Header:**
1. Press **Tab** - Focus on Back button (go back to upload)
2. Press **Tab** - Focus on Recalculate button (auto-calculates totals)
3. Press **Tab** - Focus on Invoice Number field (edit with keyboard)
4. Press **Tab** - Focus on Date field
5. Press **Tab** - Focus on Customer Name field
6. Press **Tab** - Focus on Customer Category dropdown
   - Use **Arrow Keys ↑↓** to select category
   - Press **Enter** to confirm

**Manage Items (Edit Products):**
1. Press **Tab** - Focus on "Add Row" button (adds new item)
2. Press **Tab** - Focus on first item row Name field
   - Press **Type** - Edit item name
   - Press **Tab** - Move to Quantity field
   - Press **Type** - Enter quantity
   - Press **Tab** - Move to Unit Price field
   - Press **Type** - Enter price
   - Press **Tab** - Skip Subtotal (auto-calculated)
   - Press **Tab** - Move to Category dropdown
   - Use **Arrow Keys** to select category
   - Press **Tab** - Move to Delete button
   - Press **Enter/Space** to delete item

**Edit Debt (if Old Invoice):**
1. Press **Tab** - Focus on Old Invoice Number field
2. Press **Tab** - Focus on Old Invoice Date field
3. Press **Tab** - Focus on Old Debt Amount field

**Final Steps:**
1. Press **Tab** - Focus on Down Payment field (enter down payment amount)
2. Press **Tab** - Focus on Additional Notes field
3. Press **Tab** - Focus on "Recalculate Formula" button
4. Press **Tab** - Focus on "Save to Google Sheets" button (FINAL BUTTON)
5. Press **Enter or Space** - Submit form and save to Google Sheets

### Common Keyboard Keys

| Key | Function |
|-----|----------|
| **Tab** | Move to next element |
| **Shift + Tab** | Move to previous element |
| **Enter** | Activate button or confirm action |
| **Space** | Activate button or upload zone |
| **Arrow Keys (↑↓)** | Select option in dropdown |
| **Type/Letters** | Enter text in input fields |
| **Backspace/Delete** | Edit/delete text in input fields |

### Focus Indicator

**What You're Looking For:**
- A **2-pixel blue outline** around interactive elements
- The outline appears around buttons, fields, and other clickable elements
- When you press Tab, this outline moves to the next element
- This shows you which element has focus and will respond to Enter/Space

**Colors:**
- **Blue outline (Sky-500):** Normal buttons, upload zone, form fields
- **Red outline:** Delete buttons
- **Gray outline:** Close/dismiss buttons

---

## For Developers

### Focus Styling Guidelines

#### Button Focus Style
```typescript
// In Button component
'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500'

// Or by variant (danger buttons)
'focus-visible:outline-danger-500'
```

#### Form Input Focus Style
```typescript
// In FormInput/FormSelect components
'focus:ring-2 focus:ring-offset-0'
// Color varies: focus:ring-primary-500 or focus:ring-danger-500
```

#### Custom Button/Interactive Element Focus Style
```typescript
// For any custom interactive element
className={clsx(
  'focus-visible:outline-2',
  'focus-visible:outline-offset-2',
  'focus-visible:outline-primary-500' // or appropriate color
)}
```

### Making Elements Keyboard Accessible

#### To Make a Div Clickable (Like Upload Zone)
```typescript
<div
  role="button"
  tabIndex={isEnabled ? 0 : -1}  // 0 = focusable, -1 = not focusable
  onKeyDown={(e) => {
    if ((e.key === 'Enter' || e.key === ' ') && !isDisabled) {
      e.preventDefault();
      handleClick();
    }
  }}
  onClick={handleClick}
  aria-label="Description for screen readers"
  className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
>
  {/* Content */}
</div>
```

#### To Add Aria Label to Custom Elements
```typescript
// For buttons without visible text
<button
  aria-label="Hapus item 1"  // Describes action in user's language
  className="focus-visible:outline-2..."
>
  <TrashIcon />
</button>
```

#### To Link Form Field Labels
```typescript
// In FormInput component
const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

<label htmlFor={inputId}>Label Text</label>
<input
  id={inputId}
  aria-describedby={[helperId, errorId].filter(Boolean).join(' ')}
  {...props}
/>
```

### Tab Order Best Practices

1. **Use Natural HTML Order**
   - Don't use positive `tabIndex` values (bad: `tabIndex="1"`)
   - Keep elements in HTML source order matching visual order
   - Use CSS to rearrange visually if needed

2. **Remove from Tab Order When Appropriate**
   ```typescript
   // Disabled elements
   tabIndex={isDisabled ? -1 : 0}
   
   // Hidden elements
   tabIndex={-1}  // Also use CSS `display: none` or `visibility: hidden`
   ```

3. **Skip Non-Interactive Elements**
   - Don't add `tabIndex` to divs that aren't interactive
   - Use `role="button"` only for actual interactive divs
   - Prefer native buttons: `<button>` over `<div role="button">`

4. **Logical Tab Order in Complex Forms**
   ```
   Sections flow top-to-bottom
   Within sections: left-to-right
   Skip disabled/hidden elements
   Buttons typically last
   ```

### Testing Keyboard Accessibility

#### Manual Testing Checklist
```
☐ Can navigate entire page with only Tab key
☐ Can reverse navigate with Shift + Tab
☐ All buttons activate with Enter and Space
☐ Can close alerts with close button or external action
☐ Focus indicator visible on all interactive elements
☐ Tab order makes sense (not random or confusing)
☐ No elements trap focus permanently
☐ Form inputs respond to keyboard input
☐ Dropdowns respond to arrow keys
☐ Delete/destructive actions don't activate on accident
```

#### Browser DevTools Test
```javascript
// In browser console, press Tab to navigate
// Or press F12 to open DevTools → Elements → Computed Styles
// Look for :focus-visible pseudo-class when element has focus
```

#### Screen Reader Test
```
1. Install screen reader (NVDA, JAWS, VoiceOver)
2. Enable and navigate with Tab
3. Verify each element is announced
4. Verify aria-labels are read correctly
5. Verify error messages are announced
```

### Common Issues & Solutions

#### Issue: Focus outline not visible
**Problem:** User can't see which element has focus
**Solution:**
```typescript
// Add focus-visible styles
'focus-visible:outline-2 focus-visible:outline-offset-2'
// Ensure outline color has 3:1 contrast
```

#### Issue: Tab order is wrong
**Problem:** Tab doesn't move through elements in logical order
**Solution:**
```typescript
// Don't use positive tabIndex
// ❌ Bad:
tabIndex="5"  // Creates confusing tab order

// ✅ Good:
tabIndex={0}  // Or just rely on natural order
```

#### Issue: Dropdown opens on Space key in form
**Problem:** Form input with dropdown type activates form on Space
**Solution:**
```typescript
// Use onKeyDown to prevent
<select
  onKeyDown={(e) => {
    if (e.key === ' ') {
      e.preventDefault();  // Prevent form submission
    }
  }}
/>
```

#### Issue: Delete button accidentally activates
**Problem:** Users delete items by accident
**Solution:**
```typescript
// Show confirmation or require double-click
// Add visual warning
className="text-danger-500"  // Red color for danger

// Add aria-label
aria-label="Hapus item (tidak dapat dikembalikan)"  // Can't undo
```

---

## File Reference

### Key Accessibility Files

| File | Purpose |
|------|---------|
| `src/app/globals.css` | Global focus styles `:focus-visible` |
| `src/components/base/Button.tsx` | Button focus styling |
| `src/components/base/FormInput.tsx` | Form input focus styling |
| `src/components/base/FormSelect.tsx` | Select focus styling |
| `src/components/base/Alert.tsx` | Alert close button focus styling |
| `src/components/ReceiptUploader.tsx` | Upload zone keyboard support |
| `src/components/VerificationForm/ItemsTableSection.tsx` | Delete button focus styling |

### Documentation Files

| File | Purpose |
|------|---------|
| `ACCESSIBILITY_AUDIT.md` | Comprehensive 18-section audit report |
| `KEYBOARD_NAVIGATION_GUIDE.md` | This guide |
| `PHASE_4_TASK_1_CHANGES.md` | Summary of changes made |

---

## Focus Indicator Design System

### Outline Specification

```css
/* Default button/element focus */
focus-visible:outline-2              /* 2px thick line */
focus-visible:outline-offset-2       /* 2px space from element */
focus-visible:outline-primary-500    /* Sky-500 color */

/* For danger elements */
focus-visible:outline-danger-500     /* Red color */

/* For neutral elements */
focus-visible:outline-neutral-500    /* Gray color */
```

### Colors Used

| Semantic | Tailwind | RGB | Use Case |
|----------|----------|-----|----------|
| Primary | primary-500 | rgb(59, 130, 246) | Buttons, form fields |
| Danger | danger-500 | rgb(239, 68, 68) | Delete buttons |
| Neutral | neutral-500 | rgb(107, 114, 128) | Close buttons |
| Success | success-500 | rgb(34, 197, 94) | Save buttons |

---

## Accessibility Standards

### WCAG 2.1 Compliance

| Criterion | Level | Status |
|-----------|-------|--------|
| 2.1.1 Keyboard | A | ✅ Met |
| 2.1.2 No Keyboard Trap | A | ✅ Met |
| 2.4.3 Focus Order | A | ✅ Met |
| 2.4.7 Focus Visible | AA | ✅ Met |
| 3.2.1 On Focus | A | ✅ Met |

### Section 508 Compliance

| Requirement | Status |
|------------|--------|
| Keyboard Access | ✅ Met |
| Focus Visible | ✅ Met |
| No Keyboard Trap | ✅ Met |

---

## Quick Command Reference

### To Test Keyboard Accessibility
```bash
# Start development server
npm run dev

# Open in browser
http://localhost:3000

# Use Tab to navigate
# Look for blue focus outline
# Press Enter/Space to activate
```

### To Build and Verify
```bash
# Build production version
npm run build

# No errors should appear
# All accessibility features included
```

---

## Tips for Power Users

### Keyboard Shortcuts (If Implemented)
- **Ctrl+S:** Save form (when focused on form)
- **Escape:** Cancel operation (if applicable)
- **?:** Show keyboard help (if help page exists)

### Efficiency Tips
1. **Tab through once:** Scan what's available
2. **Shift+Tab back:** Jump to missed field
3. **Arrow keys in dropdown:** Faster than tabbing through options
4. **Type numbers directly:** Most number fields support direct input

---

## Support & Questions

### If Focus Indicator Not Visible
1. Check browser support (Chrome 88+, Firefox 85+, Safari 15+)
2. Check if using incognito/private mode (sometimes extensions hidden)
3. Press F12 to verify element has `:focus-visible` class
4. Report issue with browser and version info

### If Can't Navigate Somewhere
1. Try pressing Tab to find element
2. Check if element is disabled (can't focus)
3. Verify you're using Enter or Space to activate
4. Use arrow keys in dropdown selects

### If Delete Button Activates Accidentally
1. Verify you're pressing Enter (not clicking)
2. Focus on delete button with Tab
3. Be careful pressing Enter on delete buttons
4. Delete action cannot be undone - be sure before confirming

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2024 | Initial keyboard navigation & focus management implementation |

---

**Last Updated:** 2024  
**Status:** Phase 4 Task 1 Complete  
**Next:** Phase 4 Task 2 - Color Contrast & WCAG AA Compliance
