import i18next from 'i18next';
import * as middleware from 'i18next-http-middleware';
import Backend from 'i18next-fs-backend';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const initI18n = async () => {
  await i18next
    .use(Backend)
    .use(middleware.LanguageDetector)
    .init({
      fallbackLng: 'en',
      defaultNS: 'common',
      ns: ['common', 'content', 'errors', 'res'],
      backend: {
        loadPath: path.resolve(
          __dirname,
          '../../../../node_modules/@retailify/i18n/locales/{{lng}}/{{ns}}.json',
        ),
      },
    });

  return i18next;
};

export const i18n = i18next;
