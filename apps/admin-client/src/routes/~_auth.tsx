import { createFileRoute, Outlet } from '@tanstack/react-router';

// @ts-expect-error - required for image optimization
import logotype from '../assets/logotype-black.svg?format=webp';
import { Badge } from '@retailify/ui/components/ui/badge';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/_auth')({
  component: AuthComponent,
});

function AuthComponent() {
  const { t } = useTranslation();

  return (
    <div className="h-[100dvh] w-[100dvw] grid grid-cols-1 lg:grid-cols-2">
      <div className="flex items-center justify-center w-full container lg:border-r lg:border-input">
        <main className="max-w-md w-full flex flex-col">
          <Outlet />
        </main>
      </div>
      <div className="w-full h-full bg-muted flex flex-col gap-2 items-center justify-center">
        <img src={logotype} className="max-w-[30%] w-full drop-shadow-sm" />
        <Badge variant="outline">
          <i>{t('glossary:roles.admin')}</i>
        </Badge>
      </div>
    </div>
  );
}
