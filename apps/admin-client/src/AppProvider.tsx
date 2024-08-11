import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { routeTree } from './routeTree.gen';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { Suspense, useState } from 'react';
import { httpBatchLink } from '@trpc/client';
import { trpc } from './utils/trpc';
import SuperJSON from 'superjson';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export function AppProvider() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: 'http://localhost:3000/trpc',
          transformer: SuperJSON,
        }),
      ],
    }),
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback="loading...">
          <RouterProvider router={router} />
        </Suspense>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
