# Color System Quick Reference

## 🎨 Most Used Variables

### Backgrounds
```css
--bg-primary      /* Main background (white/navy) */
--bg-secondary    /* Section background (light gray/lighter navy) */
--bg-card         /* Card background */
--bg-hover        /* Hover state */
```

### Text
```css
--text-primary    /* Main text (almost black/almost white) */
--text-secondary  /* Supporting text (gray) */
--text-tertiary   /* Hints, labels (light gray) */
```

### Borders
```css
--border-primary  /* Standard borders */
--border-focus    /* Focus state (blue) */
```

### Shadows
```css
--shadow-sm       /* Subtle */
--shadow-md       /* Standard cards */
--shadow-lg       /* Modals, dropdowns */
```

### Semantic
```css
--color-success   /* Green - confirmations */
--color-warning   /* Amber - warnings */
--color-danger    /* Red - errors */
--color-info      /* Blue - information */
```

### Buttons
```css
--button-primary-bg
--button-primary-hover
--button-primary-text

--button-secondary-bg
--button-secondary-hover
--button-secondary-text
```

### Inputs
```css
--input-bg
--input-border
--input-border-focus
--input-text
--input-placeholder
```

## 🚀 Quick Examples

### Card
```css
.my-card {
  background: var(--bg-card);
  border: 1px solid var(--border-primary);
  box-shadow: var(--shadow-md);
  border-radius: 12px;
}
```

### Button
```css
.my-button {
  background: var(--button-primary-bg);
  color: var(--button-primary-text);
  border-radius: 8px;
}

.my-button:hover {
  background: var(--button-primary-hover);
}
```

### Input
```css
.my-input {
  background: var(--input-bg);
  border: 1px solid var(--input-border);
  color: var(--input-text);
}

.my-input:focus {
  border-color: var(--input-border-focus);
}
```

### Success Message
```css
.success-alert {
  background: var(--color-success-bg);
  color: var(--color-success);
  border-left: 4px solid var(--color-success);
}
```

## 📋 Utility Classes

```html
<!-- Text -->
<p class="text-primary">Main text</p>
<p class="text-secondary">Secondary text</p>
<p class="text-muted">Muted text</p>

<!-- Backgrounds -->
<div class="bg-primary">White/Navy</div>
<div class="bg-secondary">Light gray/Lighter navy</div>

<!-- Borders & Radius -->
<div class="border rounded">8px radius</div>
<div class="border rounded-lg">12px radius</div>

<!-- Shadows -->
<div class="shadow-sm">Small shadow</div>
<div class="shadow-md">Medium shadow</div>
<div class="shadow-lg">Large shadow</div>
```

## ⚡ Pro Tips

1. **Always use variables** - Never hardcode colors
2. **Test both themes** - Check light AND dark mode
3. **Use semantic colors** - Success, warning, danger, info
4. **Maintain contrast** - Ensure text is readable
5. **Add hover states** - Make interactions clear

## 🎯 Color Meanings

| Color | Light Mode | Dark Mode | Use For |
|-------|-----------|-----------|---------|
| Success | `#10B981` | `#34D399` | Confirmations, completed actions |
| Warning | `#F59E0B` | `#FBBF24` | Cautions, important notices |
| Danger | `#EF4444` | `#F87171` | Errors, destructive actions |
| Info | `#3B82F6` | `#60A5FA` | Tips, information |
| Primary | `#2563EB` | `#3B82F6` | CTAs, links, brand |

---

For complete documentation, see [COLOR_SYSTEM.md](./COLOR_SYSTEM.md)
