# Professional Color System - EduPlus

**Date:** February 6, 2026  
**Version:** 2.0

## Overview

A comprehensive, professional color system designed for optimal readability, accessibility, and visual hierarchy in both light and dark modes.

## Design Principles

1. **High Contrast** - Ensures text is readable in all scenarios
2. **Semantic Meaning** - Colors convey purpose (success, warning, error, info)
3. **Consistency** - Unified color language across the application
4. **Accessibility** - WCAG 2.1 AA compliant contrast ratios
5. **Professional** - Modern, clean aesthetic suitable for educational platform

## Color Palette

### Light Mode

#### Brand Colors
- **Primary Blue**: `#2563EB` - Main brand color, CTAs, links
- **Secondary Purple**: `#7C3AED` - Accent color, highlights
- **Tertiary Cyan**: `#0EA5E9` - Additional accent

#### Backgrounds
- **Primary**: `#FFFFFF` - Pure white base
- **Secondary**: `#F8FAFC` - Subtle gray for sections
- **Tertiary**: `#F1F5F9` - Card backgrounds
- **Hover**: `#F1F5F9` - Interactive hover state
- **Active**: `#E2E8F0` - Pressed/active state

#### Text
- **Primary**: `#0F172A` - Main content (almost black)
- **Secondary**: `#475569` - Supporting text
- **Tertiary**: `#94A3B8` - Hints, labels
- **Muted**: `#64748B` - Disabled, less important

#### Borders
- **Primary**: `#E2E8F0` - Standard borders
- **Secondary**: `#CBD5E1` - Emphasized borders
- **Light**: `#F1F5F9` - Subtle dividers
- **Focus**: `#2563EB` - Focus rings

#### Semantic Colors
- **Success**: `#10B981` (Green) - Confirmations, success states
- **Warning**: `#F59E0B` (Amber) - Warnings, cautions
- **Danger**: `#EF4444` (Red) - Errors, destructive actions
- **Info**: `#3B82F6` (Blue) - Information, tips

### Dark Mode

#### Brand Colors (Adjusted)
- **Primary Blue**: `#3B82F6` - Brighter for dark backgrounds
- **Secondary Purple**: `#8B5CF6` - Enhanced visibility
- **Tertiary Cyan**: `#06B6D4` - Vibrant accent

#### Backgrounds
- **Primary**: `#0F172A` - Deep navy base
- **Secondary**: `#1E293B` - Lighter navy sections
- **Tertiary**: `#334155` - Card backgrounds
- **Hover**: `#334155` - Interactive hover
- **Active**: `#475569` - Pressed/active state

#### Text
- **Primary**: `#F8FAFC` - Almost white
- **Secondary**: `#CBD5E1` - Supporting text
- **Tertiary**: `#94A3B8` - Hints, labels
- **Muted**: `#64748B` - Disabled text

#### Borders
- **Primary**: `#334155` - Standard borders
- **Secondary**: `#475569` - Emphasized borders
- **Light**: `#1E293B` - Subtle dividers
- **Focus**: `#3B82F6` - Focus rings

#### Semantic Colors (Adjusted)
- **Success**: `#34D399` - Brighter green
- **Warning**: `#FBBF24` - Brighter amber
- **Danger**: `#F87171` - Softer red
- **Info**: `#60A5FA` - Brighter blue

## CSS Variables Reference

### Usage in Code

```css
/* Backgrounds */
background-color: var(--bg-primary);
background-color: var(--bg-secondary);
background-color: var(--bg-card);

/* Text */
color: var(--text-primary);
color: var(--text-secondary);
color: var(--text-muted);

/* Borders */
border: 1px solid var(--border-primary);
border-color: var(--border-focus);

/* Shadows */
box-shadow: var(--shadow-sm);
box-shadow: var(--shadow-md);
box-shadow: var(--shadow-lg);

/* Semantic */
color: var(--color-success);
background-color: var(--color-danger-bg);

/* Buttons */
background-color: var(--button-primary-bg);
color: var(--button-primary-text);

/* Inputs */
background-color: var(--input-bg);
border-color: var(--input-border);
```

## Utility Classes

Pre-built utility classes for common patterns:

### Text Colors
```html
<p class="text-primary">Primary text</p>
<p class="text-secondary">Secondary text</p>
<p class="text-muted">Muted text</p>
```

### Backgrounds
```html
<div class="bg-primary">White/Dark background</div>
<div class="bg-secondary">Subtle gray background</div>
<div class="bg-card">Card background</div>
```

### Borders & Radius
```html
<div class="border rounded">Standard border with 8px radius</div>
<div class="border-secondary rounded-lg">Emphasized border with 12px radius</div>
```

### Shadows
```html
<div class="shadow-sm">Small shadow</div>
<div class="shadow-md">Medium shadow</div>
<div class="shadow-lg">Large shadow</div>
```

## Interactive States

### Buttons
- **Hover**: Subtle lift effect + shadow
- **Active**: Returns to base position
- **Disabled**: 50% opacity, no interactions
- **Focus**: Blue outline ring for accessibility

### Inputs
- **Default**: Subtle border
- **Focus**: Blue border + soft glow
- **Disabled**: Grayed out, no interaction
- **Error**: Red border (use with semantic colors)

## Shadows

Professional shadow system for depth:

- **XS**: `--shadow-xs` - Minimal depth
- **SM**: `--shadow-sm` - Subtle elevation
- **MD**: `--shadow-md` - Standard cards
- **LG**: `--shadow-lg` - Modals, dropdowns
- **XL**: `--shadow-xl` - Maximum elevation

## Gradients

Brand gradients for special elements:

```css
background: var(--gradient-primary);  /* Blue to Purple */
background: var(--gradient-secondary); /* Cyan to Blue */
```

## Accessibility Features

1. **Focus Rings**: 2px solid outline with 2px offset
2. **Contrast Ratios**: All text meets WCAG AA standards
3. **Color Blindness**: Semantic colors work with patterns/icons
4. **Reduced Motion**: Respects `prefers-reduced-motion`

## Best Practices

### Do's ✅
- Use semantic colors for their intended purpose
- Maintain consistent spacing and hierarchy
- Use CSS variables for all colors
- Test in both light and dark modes
- Ensure sufficient contrast for text

### Don'ts ❌
- Don't use hardcoded color values
- Don't use too many colors in one view
- Don't ignore hover/focus states
- Don't use color alone to convey meaning
- Don't override system preferences

## Migration Guide

### Updating Existing Code

**Old:**
```css
background-color: #FFFFFF;
color: #000000;
border: 1px solid #CCCCCC;
```

**New:**
```css
background-color: var(--bg-primary);
color: var(--text-primary);
border: 1px solid var(--border-primary);
```

### Common Replacements

| Old Value | New Variable |
|-----------|-------------|
| `#FFFFFF` / `white` | `var(--bg-primary)` or `var(--bg-card)` |
| `#000000` / `black` | `var(--text-primary)` |
| Gray backgrounds | `var(--bg-secondary)` or `var(--bg-tertiary)` |
| Gray text | `var(--text-secondary)` or `var(--text-muted)` |
| Borders | `var(--border-primary)` |
| Success green | `var(--color-success)` |
| Error red | `var(--color-danger)` |

## Examples

### Card Component
```css
.card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  box-shadow: var(--shadow-md);
  padding: 1.5rem;
}

.card:hover {
  box-shadow: var(--shadow-lg);
}
```

### Button Component
```css
.btn-primary {
  background-color: var(--button-primary-bg);
  color: var(--button-primary-text);
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
}

.btn-primary:hover {
  background-color: var(--button-primary-hover);
}
```

### Input Component
```css
.input {
  background-color: var(--input-bg);
  border: 1px solid var(--input-border);
  color: var(--input-text);
  padding: 0.75rem;
  border-radius: 8px;
}

.input:focus {
  border-color: var(--input-border-focus);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}
```

## Testing Checklist

- [ ] Test all pages in light mode
- [ ] Test all pages in dark mode
- [ ] Verify text contrast ratios
- [ ] Check hover/focus states
- [ ] Test with keyboard navigation
- [ ] Verify on different screen sizes
- [ ] Check semantic colors in context
- [ ] Test form inputs and validation states

## Resources

- [WCAG Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Color Palette Tool](https://coolors.co/)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Note**: This color system is designed to be scalable and maintainable. Always use CSS variables instead of hardcoded values to ensure consistency across themes.
