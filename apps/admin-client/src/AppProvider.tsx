import { useTranslation } from 'react-i18next';
import { routeTree } from './routeTree.gen';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { Suspense } from 'react';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export function AppProvider() {
  const { t, i18n } = useTranslation();

  return (
    <Suspense fallback="loading...">
      {t('greeting', { ns: 'common' })}
      <button onClick={() => i18n.changeLanguage('en')}>set to english</button>
      <button onClick={() => i18n.changeLanguage('ru')}>set to russian</button>
      <RouterProvider router={router} />
    </Suspense>
  );
}
