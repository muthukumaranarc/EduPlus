# Dark Mode Implementation Guide

## Overview
This document describes the Dark Mode feature implementation in the EduPlus application.

## Implementation Summary

### 1. **Theme Context & Provider**
Created a centralized theme management system:
- **ThemeContext.js**: React context for theme state
- **ThemeProvider.jsx**: Provider component that:
  - Manages theme state (light/dark)
  - Persists theme preference to localStorage
  - Applies theme to document root via `data-theme` attribute
  - Provides `toggleTheme()` function and `isDark` boolean

### 2. **CSS Custom Properties (CSS Variables)**
Updated `index.css` with comprehensive theme variables:

#### Light Theme Variables:
- Background colors: `--bg-primary`, `--bg-secondary`, `--bg-tertiary`, `--bg-card`
- Text colors: `--text-primary`, `--text-secondary`, `--text-tertiary`
- Border colors: `--border-primary`, `--border-secondary`
- Shadow colors: `--shadow-sm`, `--shadow-md`, `--shadow-lg`
- Accent colors: `--accent-primary`, `--accent-danger`, `--accent-success`, `--accent-info`

#### Dark Theme Variables:
- Dark backgrounds with proper contrast ratios
- Light text colors for readability
- Adjusted borders and shadows for dark mode
- Consistent accent colors

### 3. **Component Updates**

#### Settings Component (Settings.jsx)
- Integrated ThemeContext
- Made Theme option clickable with `toggleTheme()` function
- Displays current theme dynamically ("Light mode" / "Dark mode")

#### Styled Components
Updated CSS files to use CSS variables:
- **Settings.css**: All colors converted to CSS variables
- **Home.css**: Navigation and layout colors updated
- Both desktop and mobile responsive styles updated

### 4. **App Integration**
- Updated `main.jsx` to wrap the app with ThemeProvider
- ThemeProvider is placed at the top of the provider hierarchy

## How It Works

1. **Initial Load**: Theme is loaded from localStorage (defaults to 'light' if not set)
2. **Theme Application**: The `data-theme` attribute is set on `document.documentElement`
3. **CSS Switching**: CSS variables automatically update based on `data-theme` attribute
4. **User Toggle**: Clicking the Theme option in Settings toggles between light/dark
5. **Persistence**: Theme preference is saved to localStorage on every change
6. **Smooth Transitions**: CSS transitions provide smooth color changes (0.3s ease)

## Usage

### For Users:
1. Navigate to Settings page (Home → Settings)
2. Under "App Settings", click on the "Theme" option
3. Theme will toggle between Light and Dark mode
4. Preference is automatically saved and persists across sessions

### For Developers:

#### Using Theme Context in Components:
```javascript
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

function MyComponent() {
    const { theme, toggleTheme, isDark } = useContext(ThemeContext);
    
    return (
        <div>
            <p>Current theme: {theme}</p>
            <button onClick={toggleTheme}>Toggle Theme</button>
            {isDark && <p>Dark mode is active!</p>}
        </div>
    );
}
```

#### Using CSS Variables in Stylesheets:
```css
.my-component {
    background-color: var(--bg-primary);
    color: var(--text-primary);
    border: 1px solid var(--border-primary);
    box-shadow: var(--shadow-md);
}
```

## Extending the Theme System

### Adding New Components:
1. Replace hardcoded colors with CSS variables
2. Use the predefined variables from `index.css`
3. Test in both light and dark modes

### Adding New Theme Variables:
1. Add to both `:root` (light) and `[data-theme="dark"]` sections in `index.css`
2. Follow the naming convention: `--category-variant`
3. Ensure proper contrast ratios for accessibility

### Creating Additional Themes:
```css
[data-theme="custom"] {
    --bg-primary: #yourcolor;
    --text-primary: #yourcolor;
    /* ... other variables */
}
```

## Browser Compatibility
- Modern browsers with CSS custom properties support
- localStorage API for persistence
- Graceful fallback to light theme if localStorage is unavailable

## Performance Considerations
- CSS variables provide instant theme switching
- No page reload required
- Minimal JavaScript overhead
- Smooth transitions without layout shifts

## Accessibility
- Proper contrast ratios maintained in both themes
- Smooth transitions don't cause disorientation
- User preference is respected and persisted
- No forced theme changes

## Future Enhancements
Potential improvements:
1. System theme detection (prefers-color-scheme)
2. Scheduled theme switching (auto dark mode at night)
3. Additional theme variants (e.g., high contrast)
4. Theme customization options
5. Per-component theme overrides

## Files Modified
- `src/context/ThemeContext.js` (new)
- `src/context/ThemeProvider.jsx` (new)
- `src/main.jsx`
- `src/index.css`
- `src/pages/home/settings/Settings.jsx`
- `src/pages/home/settings/Settings.css`
- `src/pages/home/Home.css`

## Testing Checklist
- [x] Theme toggles correctly in Settings
- [x] Theme persists after page refresh
- [x] All components render correctly in both themes
- [x] Mobile responsive design works in both themes
- [x] Smooth transitions between themes
- [x] No console errors
- [x] localStorage saves theme preference

## Support
For issues or questions about the Dark Mode implementation, please refer to this documentation or contact the development team.
