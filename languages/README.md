# Language Files

This directory contains all the language files for the Job Application Tracker application.

## Available Languages

- **English (en.js)** - Default language
- **Spanish (es.js)** - Español
- **French (fr.js)** - Français
- **German (de.js)** - Deutsch
- **Italian (it.js)** - Italiano
- **Portuguese (pt.js)** - Português
- **Arabic (ar.js)** - العربية
- **Chinese (zh.js)** - 中文
- **Japanese (ja.js)** - 日本語
- **Korean (ko.js)** - 한국어

## File Structure

Each language file contains:
- **Main app elements** - App title, buttons, navigation
- **Sort options** - All sorting dropdown options
- **Reports** - Chart titles, filters, statistics
- **Settings** - Settings page elements
- **Modal elements** - Form labels, buttons, inputs
- **Contract options** - Contract type selections
- **Period options** - Salary period selections
- **Interview options** - Interview type selections
- **Result options** - Interview result selections
- **Action buttons** - Delete, save, cancel buttons
- **Status options** - Job application statuses
- **Filter options** - Various filter dropdowns
- **Theme options** - Color theme selections
- **Language options** - Language selector options
- **Other elements** - Archive, notifications, etc.
- **Placeholder translations** - Input field placeholders

## Usage

```javascript
// Import all languages
import { languages } from './languages/index.js';

// Import specific language
import en from './languages/en.js';

// Use in application
const currentLanguage = 'en';
const translations = languages[currentLanguage];
```

## Adding New Languages

1. Create a new file `xx.js` (where xx is the language code)
2. Copy the structure from an existing language file
3. Translate all the values to the target language
4. Add the new language to `index.js`
5. Update the language selector in the main application

## Translation Guidelines

- Keep translations concise but clear
- Maintain consistent terminology within each language
- Consider cultural context for job-related terms
- Test with native speakers when possible
- Use appropriate formal/informal language levels

## RTL Support

Arabic language includes RTL (Right-to-Left) support. The application automatically detects Arabic and applies RTL styling.

## Copyright Notice

All translations maintain the same copyright notice:
- English: "© 2024 Soma Moradi. All rights reserved."
- Each language has its own localized version
- License terms are also localized appropriately 