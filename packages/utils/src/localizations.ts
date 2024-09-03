export const SUPPORTED_LOCALIZATIONS = ['en', 'ru', 'uk'] as const;
export type SupportedLocalization = (typeof SUPPORTED_LOCALIZATIONS)[number];
