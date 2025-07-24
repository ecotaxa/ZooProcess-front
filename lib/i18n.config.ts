import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enMessages from '../messages/en.json';
import frMessages from '../messages/fr.json';
import xxMessages from '../messages/xx.json';

i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    resources: {
      en: enMessages,
      fr: frMessages,
      xx: xxMessages,
    },
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    // Allow keys to be in format 'namespace:key'
    nsSeparator: ':',

    // React settings
    react: {
      useSuspense: true,
    },
  });
