import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { routeTree } from './routeTree.gen';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { Suspense, useState } from 'react';
import { httpBatchLink } from '@trpc/client';
import { trpc } from './utils/trpc';
import SuperJSON from 'superjson';
import { Toaster } from '@retailify/ui/components/ui/sonner';
import { TooltipProvider } from '@retailify/ui/components/ui/tooltip';
import { API_URL } from './utils/constants';
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
          url: API_URL,
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
              <Toaster
                position="top-right"
                richColors
                toastOptions={{
                  classNames: {
                    description: 'group-[.toast]:text-muted-foreground',
                    actionButton:
                      'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
                    cancelButton:
                      'group-[.toast]:bg-white group-[.toast]:text-black',
                    error:
                      'group toast group-[.toaster]:bg-red group-[.toaster]:text-red-600 dark:group-[.toaster]:text-foreground group-[.toaster]:shadow-lg',
                    success:
                      'group toast group-[.toaster]:bg-green group-[.toaster]:text-green-600 dark:group-[.toaster]:text-foreground group-[.toaster]:shadow-lg',
                    warning:
                      'group toast group-[.toaster]:bg-yellow group-[.toaster]:text-yellow-600 dark:group-[.toaster]:text-foreground group-[.toaster]:shadow-lg',
                    info: 'group toast group-[.toaster]:bg-blue group-[.toaster]:text-blue-600 dark:group-[.toaster]:text-foreground group-[.toaster]:shadow-lg',
                  },
                }}
              />
            </TooltipProvider>
          </ThemeProvider>
        </Suspense>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
