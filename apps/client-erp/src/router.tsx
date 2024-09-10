import type { AppRouter } from '@core/trpc/erp-server/routers/app.router';
import {
  createRouter as createTanStackRouter,
  ParseRoute,
  redirect,
} from '@tanstack/react-router';
import { QueryClient } from '@tanstack/react-query';
import { createWSClient, httpBatchLink, wsLink, splitLink } from '@trpc/client';
import { createTRPCReact, createTRPCQueryUtils } from '@trpc/react-query';
import SuperJSON from 'superjson';
import { authStore } from './utils/auth-store';
import { fetcher } from './utils/fetcher';
import { routeTree } from './routeTree.gen';
import { TrpcProvider } from './providers/trpc-provider';

// Create and export query client and trpc instance
export const queryClient = new QueryClient();
export const trpc = createTRPCReact<AppRouter>({});

// Counter for unauthorized WebSocket reconnection attempts
let wsUnauthedReconnections = 0;

/**
 * Create and configure WebSocket client
 */
export const wsClient = createWSClient({
  url: import.meta.env.VITE_WS_URL,
  connectionParams: () => ({
    token: authStore.getState().accessToken ?? undefined,
  }),
  async onClose(cause) {
    // WebSocket code 3000 is equivalent to HTTP 401 (unauthorized)
    if (cause?.code === 3000) {
      if (wsUnauthedReconnections >= 2) {
        wsUnauthedReconnections = 0;
        authStore.setState(null);
        throw redirect({ to: '/sign-in' });
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

/**
 * Configure HTTP link for tRPC
 */
const httpLink = httpBatchLink({
  url: `${import.meta.env.VITE_API_URL}/erp/trpc`,
  transformer: SuperJSON,
  headers: () => ({
    authorization: authStore.getAuthToken(),
  }),
  fetch: async (
    url: URL | RequestInfo,
    options?: RequestInit,
  ): Promise<Response> => {
    const response = await fetcher(url, options);
    if (!response) {
      throw new Error('Fetch failed');
    }
    return response;
  },
});

/**
 * Configure WebSocket link for tRPC
 */
const websocketLink = wsLink({
  client: wsClient,
  transformer: SuperJSON,
});

/**
 * Create and configure tRPC client
 */
export const trpcClient = trpc.createClient({
  links: [
    splitLink({
      condition: (op) => op.type === 'subscription',
      true: websocketLink,
      false: httpLink,
    }),
  ],
});

/**
 * Create tRPC query utils
 */
export const trpcQueryUtils = createTRPCQueryUtils({
  queryClient,
  client: trpcClient,
});

/**
 * Create and configure the router
 * @returns Configured router instance
 */
export function createRouter() {
  return createTanStackRouter({
    routeTree,
    defaultPreload: 'intent',
    context: {
      trpcQueryUtils,
    },
    defaultPendingComponent: () => <></>,
    Wrap: ({ children }: { children: React.ReactNode }) => (
      <TrpcProvider>{children}</TrpcProvider>
    ),
  });
}

// Type for valid routes
export type ValidRoutes = ParseRoute<typeof routeTree>['fullPath'];

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
