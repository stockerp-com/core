import { Button } from '@retailify/ui/components/ui/button';
import {
  createRootRouteWithContext,
  Link,
  useRouterState,
} from '@tanstack/react-router';
import { Outlet } from '@tanstack/react-router';
import { ScrollRestoration } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import {
  PiCheckCircle,
  PiHouse,
  PiInfo,
  PiWarning,
  PiWarningCircle,
} from 'react-icons/pi';
import { trpcQueryUtils } from '../router';
import ThemeProvider from '../providers/theme-provider';
import { TooltipProvider } from '@retailify/ui/components/ui/tooltip';
import { Toaster } from '@retailify/ui/components/ui/sonner';
import { AuthProvider } from '../providers/auth-provider';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

export interface RouterAppContext {
  trpcQueryUtils: typeof trpcQueryUtils;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  const isFetching = useRouterState({ select: (s) => s.isLoading });

  return (
    <AuthProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Outlet />
          <Toaster
            position="top-right"
            toastOptions={{
              className: 'bg-card border shadow-lg rounded-md text-foreground',
            }}
            icons={{
              success: <PiCheckCircle className="h-5 w-5 text-green-500" />,
              info: <PiInfo className="h-5 w-5 text-blue-500" />,
              error: <PiWarningCircle className="h-5 w-5 text-red-500" />,
              warning: <PiWarning className="h-5 w-5 text-orange-500" />,
            }}
          />
          <ScrollRestoration />
          <TanStackRouterDevtools position="bottom-left" />
          <ReactQueryDevtools position="bottom" buttonPosition="bottom-right" />
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
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

function ErrorComponent() {
  const { t } = useTranslation();

  return (
    <div className="h-[100dvh] w-[100dvw] flex items-center justify-center">
      <div className="container max-w-screen-md flex flex-col gap-12 items-center justify-center text-center z-10">
        <div className="flex flex-col gap-8">
          <h1>{t('errors:unknown.title')}</h1>
          <p>{t('errors:unknown.subtitle')}</p>
        </div>
      </div>
    </div>
  );
}
