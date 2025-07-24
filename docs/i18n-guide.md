# Internationalization (i18n) Guide

This guide explains how to use the internationalization (i18n) features in the ZooProcess frontend application.

## Overview

The application uses [react-i18next](https://react.i18next.com/) for internationalization, which is a powerful framework for translating React applications. It reuses the translation files from the previous Next.js implementation.

## Available Languages

The application currently supports the following languages:

- English (`en`)
- French (`fr`)
- Test language (`xx`) - for development purposes only

## Translation Files

Translation files are located in the `messages` directory at the root of the project:

- `messages/en.json` - English translations
- `messages/fr.json` - French translations
- `messages/xx.json` - Test translations

These files contain nested JSON objects with translation keys organized by namespaces.

## Using Translations in Components

### Basic Usage

To use translations in your components, import the `useTranslation` hook from `react-i18next`:

```jsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('common.title')}</h1>
      <p>{t('common.description')}</p>
    </div>
  );
}
```

### Changing the Language

To change the language programmatically, use the `i18n` instance from the `useTranslation` hook:

```jsx
import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = lng => {
    i18n.changeLanguage(lng);
  };

  return (
    <div>
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('fr')}>French</button>
    </div>
  );
}
```

### Checking if a Translation Key Exists

You can use the `keyExists` utility function to check if a translation key exists:

```jsx
import { useTranslation } from 'react-i18next';
import { keyExists } from '@/lib/i18nUtils';

function MyComponent() {
  const { t } = useTranslation();

  // Check if a key exists before using it
  const hasKey = keyExists('some.key', t);

  return <div>{hasKey ? <p>{t('some.key')}</p> : <p>Key not found</p>}</div>;
}
```

## Example Component

The project includes a `TranslationExample` component that demonstrates how to use translations:

```jsx
import TranslationExample from '@/components/TranslationExample';

function MyPage() {
  return (
    <div>
      {/* Basic usage */}
      <TranslationExample />

      {/* With a specific namespace */}
      <TranslationExample namespace="Login" />
    </div>
  );
}
```

## Adding New Translations

To add new translations:

1. Add your translation keys to the appropriate namespace in each language file
2. Use the translation keys in your components with the `t` function

For example, to add a new "welcome" message:

1. Add to `messages/en.json`:

   ```json
   {
     "common": {
       "welcome": "Welcome to ZooProcess"
     }
   }
   ```

2. Add to `messages/fr.json`:

   ```json
   {
     "common": {
       "welcome": "Bienvenue à ZooProcess"
     }
   }
   ```

3. Use in your component:
   ```jsx
   const { t } = useTranslation();
   return <h1>{t('common.welcome')}</h1>;
   ```

## Configuration

The i18n configuration is located in `lib/i18n.config.ts`. If you need to modify the i18n behavior, such as adding new languages or changing options, edit this file.
