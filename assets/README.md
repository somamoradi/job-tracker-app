# Assets Directory

This directory contains all static assets for the Job Application Tracker.

## Directory Structure

```
assets/
├── js/                    # JavaScript files
│   └── app.js            # Main application logic
├── styles/               # CSS stylesheets
│   └── styles.css        # Main stylesheet
├── images/               # Image files (icons, logos, etc.)
├── fonts/                # Local font files (if any)
├── icons/                # App icons and favicons
├── manifest.json         # PWA manifest file
└── README.md            # This file
```

## File Organization

- **JavaScript**: All JS files are in `js/` directory
- **CSS**: All stylesheets are in `styles/` directory  
- **Images**: Place all images in `images/` directory
- **Fonts**: Local font files go in `fonts/` directory
- **Icons**: App icons and favicons in `icons/` directory
- **Manifest**: PWA manifest file at root of assets

## Usage

The main HTML file (`index.html`) references these assets with relative paths:
- CSS: `assets/styles/styles.css`
- JS: `assets/js/app.js`
- Manifest: `assets/manifest.json`

## Adding New Assets

When adding new assets:
1. Place them in the appropriate subdirectory
2. Update any references in the HTML/CSS/JS files
3. Update this README if adding new file types 