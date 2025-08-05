# Sass Structure

This directory contains the Sass source files for the Job Application Tracker.

## File Organization

```
sass/
├── main.scss              # Main entry point - imports all partials
├── _variables.scss        # Design tokens, colors, spacing, typography
├── _base.scss            # Base styles, resets, typography
├── _layout.scss          # Layout components (header, navigation, grid)
├── _components.scss      # UI components (buttons, cards, forms)
├── _themes.scss          # Theme variations (green, purple, orange, dark)
├── _responsive.scss      # Media queries and responsive design
├── _utilities.scss       # Forms, modals, charts, settings
└── README.md            # This file
```

## Compilation

The Sass files are compiled to `../styles.css` using the following npm scripts:

- `npm run sass` - Compile once
- `npm run sass:watch` - Watch for changes and compile automatically
- `npm run sass:build` - Compile with compression for production

## Architecture

### Variables (`_variables.scss`)
Contains all design tokens:
- Color palette (primary, status, contract colors)
- Typography (font families, sizes, weights)
- Spacing scale
- Breakpoints
- Transitions and animations

### Base (`_base.scss`)
Fundamental styles:
- CSS reset
- Typography rules
- RTL language support
- Utility classes

### Layout (`_layout.scss`)
Layout components:
- App container
- Header and navigation
- Tab system
- Actions bar
- Grid layouts

### Components (`_components.scss`)
Reusable UI components:
- Buttons
- Job cards
- Status badges
- Interview results
- Empty states

### Themes (`_themes.scss`)
Theme variations:
- Green theme
- Purple theme
- Orange theme
- Dark mode

### Responsive (`_responsive.scss`)
Mobile-first responsive design:
- Breakpoint definitions
- Mobile styles (default)
- Tablet enhancements
- Desktop enhancements
- Print styles

### Utilities (`_utilities.scss`)
Specialized components:
- Forms and form validation
- Modals and overlays
- Charts and reports
- Settings interface
- Archive styles

## Best Practices

1. **Mobile First**: Base styles are for mobile, then enhance for larger screens
2. **Variables**: Use design tokens from `_variables.scss` for consistency
3. **Nesting**: Keep nesting to 3 levels maximum
4. **BEM**: Use BEM methodology for component naming
5. **RTL Support**: Include RTL-specific styles for internationalization

## Adding New Styles

1. **New Component**: Add to `_components.scss`
2. **New Layout**: Add to `_layout.scss`
3. **New Theme**: Add to `_themes.scss`
4. **New Variable**: Add to `_variables.scss`
5. **New Utility**: Add to `_utilities.scss`

## Color Functions

The project uses modern Sass color functions. Replace deprecated functions:
- `darken($color, 10%)` → `color.adjust($color, $lightness: -10%)`
- `lighten($color, 5%)` → `color.adjust($color, $lightness: 5%)`

## RTL Support

RTL languages (Arabic, Persian, Kurdish) are supported with:
- Font family switching to Vazirmatn
- Direction-aware layouts
- Proper text alignment
- Icon and button positioning 