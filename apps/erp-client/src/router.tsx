import type { AppRouter } from '@retailify/trpc/erp-server/routers/app.router';
import {
  createRouter as createTanStackRouter,
  ParseRoute,
} from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  createTRPCQueryUtils,
  createTRPCReact,
  httpBatchLink,
} from '@trpc/react-query';
import SuperJSON from 'superjson';
import { authStore } from './utils/auth-store';
import { fetcher } from './utils/fetcher';
import { routeTree } from './routeTree.gen';
import SpinnerIcon from '@retailify/ui/components/ui/spinner-icon';

export const queryClient = new QueryClient();

export const trpc = createTRPCReact<AppRouter>({});

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: import.meta.env.VITE_API_URL as string,
      transformer: SuperJSON,
      headers() {
        return {
          Authorization: authStore.getState().accessToken
            ? `Bearer ${authStore.getState().accessToken}`
            : '',
        };
      },
      fetch(url, options) {
        return fetcher(
          url,
          options,
          authStore.getState().accessToken ?? null,
          (accessToken) =>
            authStore.setState({
              accessToken,
              session: authStore.getState().session,
            }),
          (session) =>
            authStore.setState({
              accessToken: authStore.getState().accessToken,
              session,
            }),
          import.meta.env.VITE_API_URL as string,
        );
      },
    }),
  ],
});

export const trpcQueryUtils = createTRPCQueryUtils({
  queryClient,
  client: trpcClient,
});

export function createRouter() {
  const router = createTanStackRouter({
    routeTree,
    defaultPreload: 'intent',
    context: {
      trpcQueryUtils,
    },
    defaultPendingComponent: () => (
      <div className="absolute h-[100dvh] w-[100dvw] flex items-center justify-center">
        <SpinnerIcon className="h-6 w-6 text-muted-foreground" />
      </div>
    ),
    Wrap: ({ children }) => (
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </trpc.Provider>
    ),
  });

  return router;
}

export type ValidRoutes = ParseRoute<typeof routeTree>['fullPath'];

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
