import { ReactNode, Suspense, useState } from 'react';
import { trpc } from '../utils/trpc';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import SuperJSON from 'superjson';
import { useAuth } from '../hooks/use-auth';
import { fetcher } from '../utils/fetcher';

export default function TrpcProvider(props: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const auth = useAuth();

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: import.meta.env.VITE_API_URL as string,
          headers() {
            return {
              authorization: auth?.accessToken
                ? `Bearer ${auth.accessToken}`
                : '',
            };
          },
          transformer: SuperJSON,
          fetch(url, options) {
            return fetcher(
              url,
              options,
              auth?.accessToken ?? null,
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
        <Suspense fallback="loading...">{props.children}</Suspense>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
