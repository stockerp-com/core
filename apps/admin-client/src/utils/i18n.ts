import i18next, { InitOptions } from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    common: await import('@retailify/i18n/locales/en/common.json'),
  },
  ru: {
    common: await import('@retailify/i18n/locales/ru/common.json'),
  },
};

const options: InitOptions = {
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  defaultNS: 'common',
  resources,
};

i18next.use(initReactI18next).use(LanguageDetector).init(options);

export default i18next;
