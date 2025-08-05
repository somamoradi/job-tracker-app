# Images Directory

This directory contains all images and icons for the Job Application Tracker.

## Directory Structure

```
images/
├── job-tracker.png          # Main application logo
├── favicon.ico             # Website favicon
├── app-icon.png            # Main app icon (512x512)
├── icons.svg               # SVG sprite with all icons
├── status-icons/           # Job status specific icons
│   ├── status-to-apply.svg
│   ├── status-applied.svg
│   ├── status-interview-scheduled.svg
│   ├── status-rejected.svg
│   └── status-accepted.svg
├── action-icons/           # Action button icons
│   ├── add-job.svg
│   ├── edit-job.svg
│   └── delete-job.svg
└── README.md              # This file
```

## Icon Usage

### SVG Sprite Icons
The `icons.svg` file contains all icons as SVG symbols. To use them:

```html
<svg class="icon">
  <use href="assets/images/icons.svg#icon-add"></use>
</svg>
```

### Status Icons
Status icons are color-coded:
- **To Apply**: Orange (#f57c00)
- **Applied**: Blue (#1976d2)
- **Interview Scheduled**: Purple (#7b1fa2)
- **Rejected**: Red (#d32f2f)
- **Accepted**: Green (#2e7d32)

### Action Icons
Action icons use semantic colors:
- **Add**: Blue (#2196F3)
- **Edit**: Orange (#FF9800)
- **Delete**: Red (#d32f2f)

## Icon Categories

### Job Status Icons
- `icon-to-apply` - For jobs not yet applied
- `icon-applied` - For submitted applications
- `icon-interview` - For interview-related statuses
- `icon-rejected` - For rejected applications
- `icon-accepted` - For accepted offers

### Action Icons
- `icon-add` - Add new job
- `icon-edit` - Edit existing job
- `icon-delete` - Delete job
- `icon-archive` - Archive job
- `icon-unarchive` - Unarchive job

### Navigation Icons
- `icon-jobs` - Jobs tab
- `icon-reports` - Reports tab
- `icon-settings` - Settings tab
- `icon-archive-nav` - Archive tab

### View Icons
- `icon-list` - List view
- `icon-grid` - Grid view
- `icon-cards` - Cards view

### Utility Icons
- `icon-search` - Search functionality
- `icon-filter` - Filter options
- `icon-sort` - Sort options
- `icon-close` - Close modal/panel
- `icon-expand` - Expand section
- `icon-collapse` - Collapse section

### Theme Icons
- `icon-theme-light` - Light theme
- `icon-theme-dark` - Dark theme

### Language Icons
- `icon-language` - Language selection

### Export/Import Icons
- `icon-export` - Export data
- `icon-import` - Import data

### Notification Icons
- `icon-notification` - General notifications
- `icon-success` - Success messages
- `icon-error` - Error messages
- `icon-warning` - Warning messages

## Image Specifications

### App Icon
- **Size**: 512x512 pixels
- **Format**: PNG with transparency
- **Content**: Job tracker logo with briefcase and checkmark

### Favicon
- **Size**: 16x16, 32x32, 48x48 pixels
- **Format**: ICO
- **Content**: Simplified job tracker icon

### SVG Icons
- **ViewBox**: 24x24
- **Colors**: Semantic color coding
- **Style**: Material Design inspired

## Best Practices

1. **Use SVG for icons** - Scalable and lightweight
2. **Color coding** - Consistent color scheme
3. **Semantic naming** - Clear, descriptive names
4. **Accessibility** - Include alt text and ARIA labels
5. **Performance** - Optimize SVG files for web use

## Adding New Icons

1. Add the SVG symbol to `icons.svg`
2. Create individual SVG files if needed
3. Update this README with new icon documentation
4. Use semantic colors and naming conventions 