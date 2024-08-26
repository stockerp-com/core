import i18next, { InitOptions } from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';

const options: InitOptions = {
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  defaultNS: 'common',
  ns: ['common', 'content', 'errors', 'res'],
};

i18next
  .use(
    resourcesToBackend(
      (language: string, namespace: string) =>
        import(`@retailify/i18n/locales/${language}/${namespace}.json`),
    ),
  )
  .use(initReactI18next)
  .use(LanguageDetector)
  .init(options);

export default i18next;
