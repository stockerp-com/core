import { QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { trpc, queryClient, trpcClient } from '../router';

/**
 * Props for the TrpcProvider component
 */
interface TrpcProviderProps {
  children: ReactNode;
}

/**
 * TrpcProvider component
 *
 * This component wraps the application with tRPC and React Query providers.
 * It ensures that tRPC client and React Query are available throughout the app.
 *
 * @param {TrpcProviderProps} props - The component props
 * @param {ReactNode} props.children - The child components to be wrapped
 * @returns {JSX.Element} The wrapped children with tRPC and React Query providers
 */
export function TrpcProvider({ children }: TrpcProviderProps) {
  return (
    // tRPC provider wraps the entire app, providing the tRPC client
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      {/* React Query provider manages the global query cache */}
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
