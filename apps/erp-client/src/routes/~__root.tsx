import { Button } from '@retailify/ui/components/ui/button';
import { Link } from '@tanstack/react-router';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { ScrollRestoration } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { PiHouse } from 'react-icons/pi';

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootComponent() {
  return (
    <>
      <Outlet />
      <ScrollRestoration />
    </>
  );
}

function NotFoundComponent() {
  const { t } = useTranslation();

  return (
    <div className="h-[100dvh] w-[100dvw] flex items-center justify-center">
      <div className="container max-w-screen-md flex flex-col gap-12 items-center justify-center text-center z-10">
        <div className="flex flex-col gap-8">
          <h1>{t('errors:not_found.title')}</h1>
          <p>{t('errors:not_found.subtitle')}</p>
        </div>
        <div className="flex flex-col gap-4">
          <Button asChild size="lg" variant="secondary">
            <Link to="/" className="flex items-center gap-2">
              <PiHouse className="h-4 w-4" />
              {t('errors:not_found.go_home')}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
