import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { trpcQueryUtils } from '../router';

export interface RouterAppContext {
  trpcQueryUtils: typeof trpcQueryUtils;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  return <Outlet />;
}

function NotFoundComponent() {
  return <div>Not Found</div>;
}

function ErrorComponent() {
  return <div>Error</div>;
}
