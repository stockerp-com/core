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
  return (
    <Suspense fallback="loading...">
      <RouterProvider router={router} />
    </Suspense>
  );
}
