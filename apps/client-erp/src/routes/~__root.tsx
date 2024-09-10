import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { trpcQueryUtils } from '../router';
import { lazy, Suspense } from 'react';

const TanStackRouterDevtools = import.meta.env.PROD
  ? () => null // Render nothing in production
  : lazy(() =>
      // Lazy load in development
      import('@tanstack/router-devtools').then((res) => ({
        default: res.TanStackRouterDevtools,
        // For Embedded Mode
        // default: res.TanStackRouterDevtoolsPanel
      })),
    );

const TanStackQueryDevtools = import.meta.env.PROD
  ? () => null // Render nothing in production
  : lazy(() =>
      import('@tanstack/react-query-devtools').then((res) => ({
        default: res.ReactQueryDevtools,
      })),
    );

export interface RouterAppContext {
  trpcQueryUtils: typeof trpcQueryUtils;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  return (
    <>
      <Outlet />
      <Suspense>
        <TanStackRouterDevtools position="bottom-left" />
        <TanStackQueryDevtools
          position="bottom"
          buttonPosition="bottom-right"
        />
      </Suspense>
    </>
  );
}

function NotFoundComponent() {
  return <div>Not Found</div>;
}

function ErrorComponent() {
  return <div>Error</div>;
}
