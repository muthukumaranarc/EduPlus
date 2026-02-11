# Responsive Design System - EduPlus

**Date:** February 6, 2026  
**Version:** 1.0

## Overview

A comprehensive, mobile-first responsive design system that ensures EduPlus works perfectly on all screen sizes - from mobile phones to large desktop monitors.

## 📱 Breakpoints

Our system uses 5 standard breakpoints:

| Breakpoint | Size | Prefix | Devices |
|------------|------|--------|---------|
| **Mobile** | < 640px | (none) | Phones |
| **Small (sm)** | ≥ 640px | `sm:` | Large phones, small tablets |
| **Medium (md)** | ≥ 768px | `md:` | Tablets |
| **Large (lg)** | ≥ 1024px | `lg:` | Laptops, desktops |
| **Extra Large (xl)** | ≥ 1280px | `xl:` | Large desktops |

## 🎯 Mobile-First Approach

We use a **mobile-first** strategy:
1. Write styles for mobile by default (no prefix)
2. Add larger screen styles using prefixes (`sm:`, `md:`, `lg:`, `xl:`)
3. Styles cascade upward (mobile → tablet → desktop)

### Example
```html
<!-- Mobile: full width, Tablet+: half width, Desktop: one-third -->
<div class="w-full sm:w-1/2 lg:w-1/3">
  Content
</div>
```

## 📦 Container System

### Basic Container
```html
<div class="container">
  <!-- Content automatically centered with responsive padding -->
</div>
```

**Behavior:**
- Mobile: 100% width, 1rem padding
- Tablet (640px+): max-width 640px, 1.5rem padding
- Desktop (1024px+): max-width 1024px, 2rem padding
- XL (1280px+): max-width 1280px

## 🔤 Responsive Typography

### Automatic Scaling
Base font size automatically adjusts:
- Mobile: 14px
- Tablet (640px+): 15px
- Desktop (1024px+): 16px

### Text Size Classes
```html
<p class="text-xs">Extra small text</p>
<p class="text-sm">Small text</p>
<p class="text-base">Base text (default)</p>
<p class="text-lg">Large text</p>
<p class="text-xl">Extra large text</p>
<p class="text-2xl">2X large text</p>
<p class="text-3xl">3X large text</p>
<p class="text-4xl">4X large text</p>
```

## 📐 Layout Utilities

### Display
```html
<!-- Hide on mobile, show on desktop -->
<div class="hidden lg:block">Desktop only</div>

<!-- Show on mobile, hide on desktop -->
<div class="block lg:hidden">Mobile only</div>

<!-- Flex on all screens -->
<div class="flex">Flex container</div>

<!-- Grid on desktop only -->
<div class="grid-cols-1 lg:grid-cols-3">Grid layout</div>
```

### Flexbox
```html
<div class="flex flex-col sm:flex-row items-center justify-between gap-4">
  <!-- Mobile: stacked vertically -->
  <!-- Tablet+: horizontal row -->
</div>
```

**Flexbox Classes:**
- `flex` - Display flex
- `flex-col` / `flex-row` - Direction
- `flex-wrap` - Allow wrapping
- `items-center` / `items-start` / `items-end` - Align items
- `justify-center` / `justify-between` / `justify-around` - Justify content
- `gap-1` to `gap-8` - Gap between items

### Grid
```html
<!-- Mobile: 1 column, Tablet: 2 columns, Desktop: 4 columns -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
</div>
```

**Grid Classes:**
- `grid` - Display grid
- `grid-cols-1` to `grid-cols-6` - Number of columns
- Responsive: `sm:grid-cols-2`, `md:grid-cols-3`, `lg:grid-cols-4`

## 📏 Spacing

### Padding
```html
<div class="p-4 md:p-6 lg:p-8">
  <!-- Mobile: 1rem, Tablet: 1.5rem, Desktop: 2rem -->
</div>
```

**Padding Classes:**
- `p-0` to `p-8` - All sides
- `pt-4`, `pb-4`, `pl-4`, `pr-4` - Individual sides
- Responsive: `sm:p-6`, `md:p-8`, `lg:p-12`

### Margin
```html
<div class="m-4 md:m-6 lg:m-8">
  Content
</div>
```

**Margin Classes:**
- `m-0` to `m-8` - All sides
- `mt-4`, `mb-4`, `ml-4`, `mr-4` - Individual sides

### Gap (for Flex/Grid)
```html
<div class="flex gap-2 sm:gap-4 lg:gap-8">
  <!-- Responsive gap between items -->
</div>
```

## 📊 Width & Height

### Width
```html
<!-- Full width on mobile, half on tablet, third on desktop -->
<div class="w-full sm:w-1/2 lg:w-1/3">
  Content
</div>
```

**Width Classes:**
- `w-full` - 100%
- `w-auto` - Auto
- `w-1/2` - 50%
- `w-1/3`, `w-2/3` - 33%, 66%
- `w-1/4`, `w-3/4` - 25%, 75%

### Height
```html
<div class="h-screen">Full viewport height</div>
<div class="h-full">100% of parent</div>
<div class="h-auto">Auto height</div>
```

## 🖼️ Responsive Images

All images are automatically responsive:

```html
<!-- Automatically scales to container -->
<img src="image.jpg" alt="Description" />

<!-- Explicit responsive class -->
<img src="image.jpg" alt="Description" class="img-responsive" />
```

**Features:**
- `max-width: 100%` - Never overflow container
- `height: auto` - Maintain aspect ratio
- `display: block` - Remove inline spacing

## 📱 Mobile Optimizations

### Touch Targets
All interactive elements automatically have minimum 44x44px touch targets on mobile.

```html
<button>Click me</button>
<!-- Automatically 44px minimum on mobile -->
```

### Mobile Stack
```html
<div class="mobile-stack">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <!-- Automatically stacks on mobile with spacing -->
</div>
```

### Prevent Zoom on iOS
Body font-size is automatically 16px on mobile to prevent iOS zoom on input focus.

## 🎨 Common Patterns

### Responsive Card Grid
```html
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
  <div class="bg-card p-4 rounded shadow-md">Card 1</div>
  <div class="bg-card p-4 rounded shadow-md">Card 2</div>
  <div class="bg-card p-4 rounded shadow-md">Card 3</div>
</div>
```

### Responsive Navigation
```html
<nav class="flex flex-col lg:flex-row items-center justify-between p-4">
  <div class="text-2xl">Logo</div>
  <div class="flex flex-col lg:flex-row gap-4">
    <a href="#">Home</a>
    <a href="#">About</a>
    <a href="#">Contact</a>
  </div>
</nav>
```

### Two-Column Layout
```html
<div class="flex flex-col lg:flex-row gap-6">
  <aside class="w-full lg:w-1/4">Sidebar</aside>
  <main class="w-full lg:w-3/4">Main content</main>
</div>
```

### Responsive Hero Section
```html
<section class="container">
  <div class="flex flex-col lg:flex-row items-center gap-8 py-8 lg:py-16">
    <div class="w-full lg:w-1/2">
      <h1 class="text-3xl lg:text-4xl">Heading</h1>
      <p class="text-base lg:text-lg">Description</p>
    </div>
    <div class="w-full lg:w-1/2">
      <img src="hero.jpg" alt="Hero" />
    </div>
  </div>
</section>
```

### Responsive Form
```html
<form class="container max-w-2xl">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <input type="text" placeholder="First Name" class="p-3" />
    <input type="text" placeholder="Last Name" class="p-3" />
  </div>
  <input type="email" placeholder="Email" class="w-full p-3 mt-4" />
  <button class="w-full md:w-auto px-8 py-3 mt-4">Submit</button>
</form>
```

## 🎯 Best Practices

### Do's ✅
1. **Start with mobile** - Design for mobile first, then enhance
2. **Use semantic breakpoints** - sm for tablets, lg for desktops
3. **Test on real devices** - Emulators don't catch everything
4. **Use relative units** - rem, %, vh/vw instead of px
5. **Optimize images** - Use appropriate sizes for each breakpoint
6. **Touch-friendly** - Ensure 44px minimum tap targets
7. **Readable text** - Maintain 16px minimum on mobile

### Don'ts ❌
1. **Don't use fixed widths** - Use responsive units
2. **Don't ignore landscape** - Test both orientations
3. **Don't rely on hover** - Mobile has no hover state
4. **Don't use tiny text** - Keep text readable on small screens
5. **Don't overflow** - Prevent horizontal scrolling
6. **Don't nest too deep** - Keep responsive classes simple

## 📋 Quick Reference

### Common Responsive Patterns

```html
<!-- Hide on mobile, show on desktop -->
<div class="hidden lg:block">...</div>

<!-- Show on mobile, hide on desktop -->
<div class="block lg:hidden">...</div>

<!-- Stack on mobile, row on desktop -->
<div class="flex flex-col lg:flex-row">...</div>

<!-- 1 column mobile, 2 tablet, 3 desktop -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">...</div>

<!-- Full width mobile, half desktop -->
<div class="w-full lg:w-1/2">...</div>

<!-- Small padding mobile, large desktop -->
<div class="p-4 lg:p-8">...</div>

<!-- Center on mobile, left on desktop -->
<div class="text-center lg:text-left">...</div>
```

## 🧪 Testing Checklist

- [ ] Test on iPhone (Safari)
- [ ] Test on Android (Chrome)
- [ ] Test on iPad/tablet
- [ ] Test on desktop (1920px)
- [ ] Test on laptop (1366px)
- [ ] Test landscape orientation
- [ ] Test with browser zoom (150%, 200%)
- [ ] Test with slow network
- [ ] Verify touch targets (44px minimum)
- [ ] Check text readability
- [ ] Ensure no horizontal scroll
- [ ] Test form inputs on mobile

## 🛠️ Browser DevTools

### Chrome/Edge DevTools
1. Press `F12` or `Ctrl+Shift+I`
2. Click device toolbar icon (or `Ctrl+Shift+M`)
3. Select device or enter custom dimensions
4. Test different breakpoints

### Responsive Testing
```
Mobile: 375x667 (iPhone SE)
Tablet: 768x1024 (iPad)
Desktop: 1920x1080
```

## 📖 Resources

- [MDN Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [Google Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [Can I Use](https://caniuse.com/) - Browser compatibility

---

**Remember:** Mobile-first means starting small and building up, not desktop-first and scaling down!
