import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { routeTree } from './routeTree.gen';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { Suspense, useState } from 'react';
import { httpBatchLink } from '@trpc/client';
import { trpc } from './utils/trpc';
import SuperJSON from 'superjson';
import { Toaster } from '@retailify/ui/components/ui/sonner';
import { TooltipProvider } from '@retailify/ui/components/ui/tooltip';
import { ThemeProvider } from '@retailify/ui/components/providers/vite-theme-provider';

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
          url: import.meta.env.VITE_API_URL as string,
          transformer: SuperJSON,
          fetch(url, options) {
            return fetch(url, {
              ...options,
              credentials: 'include',
            });
          },
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback="loading...">
          <ThemeProvider
            defaultTheme="system"
            storageKey="retailify-admin-theme"
          >
            <TooltipProvider delayDuration={0}>
              <RouterProvider router={router} />
              <Toaster position="top-right" richColors toastOptions={{}} />
            </TooltipProvider>
          </ThemeProvider>
        </Suspense>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
