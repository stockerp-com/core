import type { AppRouter } from '@core/trpc/erp-server/routers/app.router';
import {
  createRouter as createTanStackRouter,
  ParseRoute,
  redirect,
} from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createWSClient, httpBatchLink, wsLink, splitLink } from '@trpc/client';
import { createTRPCReact, createTRPCQueryUtils } from '@trpc/react-query';
import SuperJSON from 'superjson';
import { authStore } from './utils/auth-store';
import { fetcher } from './utils/fetcher';
import { routeTree } from './routeTree.gen';
import SpinnerIcon from '@core/ui/components/ui/spinner-icon';

export const queryClient = new QueryClient();
export const trpc = createTRPCReact<AppRouter>({});

let wsUnauthedReconnections = 0;

export const wsClient = createWSClient({
  url: import.meta.env.VITE_WS_URL,
  connectionParams: () => ({
    token: authStore.getState().accessToken ?? undefined,
  }),
  async onClose(cause) {
    // Unauthorized, equivalent to HTTP 401
    if (cause?.code === 3000) {
      if (wsUnauthedReconnections >= 2) {
        wsUnauthedReconnections = 0;
        authStore.setState(null);
        throw redirect({
          to: '/sign-in',
        });
      }
      wsUnauthedReconnections++;
      await authStore.refreshTokens();
      wsClient.reconnect();
    }
  },
  onOpen() {
    wsUnauthedReconnections = 0;
  },
});

const httpLink = httpBatchLink({
  url: `${import.meta.env.VITE_API_URL}/erp/trpc`,
  transformer: SuperJSON,
  headers() {
    return {
      authorization: authStore.getAuthToken(),
    };
  },
  fetch(url, options) {
    return fetcher(url, options);
  },
});

const websocketLink = wsLink({
  client: wsClient,
  transformer: SuperJSON,
});

export const trpcClient = trpc.createClient({
  links: [
    splitLink({
      condition: (op) => {
        // You can add custom logic here to determine which link to use
        // For example, use WebSocket for subscriptions and HTTP for everything else
        return op.type === 'subscription';
      },
      true: websocketLink,
      false: httpLink,
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
      <div className="absolute top-0 left-0 z-50 bg-background h-[100dvh] w-[100dvw] flex items-center justify-center">
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
