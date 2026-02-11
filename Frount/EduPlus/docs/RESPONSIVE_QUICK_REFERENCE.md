# Mobile Responsive Quick Reference

## Quick Tips for Mobile Development

### 1. Always Use Flexible Widths
```css
/* ❌ DON'T */
.container {
  width: 500px;
}

/* ✅ DO */
.container {
  width: 90%;
  max-width: 500px;
}
```

### 2. Use Mobile-First Approach
```css
/* Mobile styles first (no media query) */
.element {
  font-size: 14px;
  padding: 10px;
}

/* Then add larger screen styles */
@media (min-width: 768px) {
  .element {
    font-size: 16px;
    padding: 20px;
  }
}
```

### 3. Touch-Friendly Targets
```css
/* All interactive elements on mobile */
button, a, input[type="button"] {
  min-height: 44px;
  min-width: 44px;
}
```

## Common Responsive Patterns

### Responsive Container
```css
.container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}
```

### Responsive Grid
```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
  gap: 1rem;
}
```

### Responsive Flexbox
```css
.flex-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.flex-item {
  flex: 1 1 300px; /* grow, shrink, basis */
}
```

### Responsive Images
```css
img {
  max-width: 100%;
  height: auto;
  display: block;
}
```

## Utility Classes Cheat Sheet

### Display
- `.hidden` - Hide element
- `.block` - Display block
- `.flex` - Display flex
- `.grid` - Display grid
- `.mobile-hidden` - Hide on mobile only
- `.tablet-hidden` - Hide on tablet only

### Width
- `.w-full` - 100% width
- `.w-screen` - 100vw width
- `.w-auto` - Auto width
- `.max-w-full` - Max 100% width
- `.max-w-xs` to `.max-w-4xl` - Various max widths

### Spacing
- `.p-0` to `.p-8` - Padding
- `.m-0` to `.m-8` - Margin
- `.gap-1` to `.gap-8` - Gap for flex/grid

### Text
- `.text-xs` to `.text-4xl` - Font sizes
- `.text-left` - Left align
- `.text-center` - Center align
- `.text-right` - Right align

### Responsive Prefixes
- `sm:` - Tablet (640px+)
- `md:` - Medium (768px+)
- `lg:` - Desktop (1024px+)
- `xl:` - Large (1280px+)

Example: `sm:flex md:grid lg:w-1/2`

## Breakpoints Reference

| Name | Min Width | Device Type |
|------|-----------|-------------|
| Default | 0px | Mobile |
| sm | 640px | Small Tablet |
| md | 768px | Tablet |
| lg | 1024px | Desktop |
| xl | 1280px | Large Desktop |

## Common Mobile Issues & Fixes

### Issue: Text Too Small
```css
/* Set minimum font size */
html {
  font-size: 16px; /* Prevents iOS zoom */
}
```

### Issue: Horizontal Scroll
```css
/* Prevent overflow */
html, body {
  overflow-x: hidden;
  width: 100%;
}

* {
  box-sizing: border-box;
}
```

### Issue: Fixed Width Breaking Layout
```css
/* Use max-width instead */
.element {
  width: 100%;
  max-width: 500px;
}
```

### Issue: Images Breaking Layout
```css
img {
  max-width: 100%;
  height: auto;
}
```

## Testing Checklist

- [ ] Test on iPhone SE (375px)
- [ ] Test on standard phone (390px)
- [ ] Test on large phone (430px)
- [ ] Test on tablet (768px)
- [ ] Test on desktop (1024px+)
- [ ] Test in portrait and landscape
- [ ] Check touch targets (44x44px minimum)
- [ ] Verify no horizontal scroll
- [ ] Check text readability
- [ ] Test with browser dev tools
- [ ] Test on real devices

## Performance Tips

1. Use CSS transforms for animations (GPU accelerated)
2. Minimize reflows and repaints
3. Use `will-change` sparingly
4. Optimize images for different screen sizes
5. Lazy load images below the fold
6. Use CSS containment where appropriate

## Accessibility

1. Maintain color contrast ratios
2. Ensure touch targets are 44x44px minimum
3. Support keyboard navigation
4. Test with screen readers
5. Use semantic HTML
6. Provide alt text for images
