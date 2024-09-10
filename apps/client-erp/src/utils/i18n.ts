import i18next, { InitOptions } from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';

/**
 * Configuration options for i18next
 */
const i18nOptions: InitOptions = {
  fallbackLng: 'en', // Default language if translation is missing
  interpolation: {
    escapeValue: false, // React already safes from XSS
  },
  defaultNS: 'common', // Default namespace
  ns: ['common', 'content', 'errors', 'res'], // List of namespaces
};

/**
 * Initialize i18next with plugins and configuration
 */
const initializeI18n = () => {
  return (
    i18next
      // Load language resources dynamically
      .use(
        resourcesToBackend(
          (language: string, namespace: string) =>
            import(`@core/i18n/locales/${language}/${namespace}.json`),
        ),
      )
      .use(initReactI18next) // Passes i18n down to react-i18next
      .use(LanguageDetector) // Detect user language
      .init(i18nOptions)
  ); // Initialize with options
};

// Initialize i18next
const i18n = initializeI18n();

export default i18n;
