import { ReactNode, useState } from 'react';
import { trpc } from '../utils/trpc';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import SuperJSON from 'superjson';
import { useAuth } from '../hooks/use-auth';
import { fetcher } from '../utils/fetcher';

export default function TrpcProvider(props: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const authCtx = useAuth();

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: import.meta.env.VITE_API_URL as string,
          headers() {
            return {
              authorization: authCtx?.accessToken
                ? `Bearer ${authCtx.accessToken}`
                : '',
            };
          },
          transformer: SuperJSON,
          fetch(url, options) {
            return fetcher(
              url,
              options,
              authCtx?.accessToken ?? null,
              authCtx?.setAccessToken ?? (() => {}),
              authCtx?.setSession ?? (() => {}),
              import.meta.env.VITE_API_URL as string,
            );
          },
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
