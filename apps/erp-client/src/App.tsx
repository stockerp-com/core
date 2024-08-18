import { createRouter, RouterProvider } from '@tanstack/react-router';
import ThemeProvider from './providers/theme-provider';
import { Toaster } from '@retailify/ui/components/ui/sonner';
import TrpcProvider from './providers/trpc-provider';
import { TooltipProvider } from '@retailify/ui/components/ui/tooltip';
import { routeTree } from './routeTree.gen';
import { AuthProvider } from './providers/auth-provider';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <TrpcProvider>
        <ThemeProvider>
          <TooltipProvider delayDuration={0}>
            <RouterProvider router={router} />
            <Toaster position="top-right" richColors toastOptions={{}} />
          </TooltipProvider>
        </ThemeProvider>
      </TrpcProvider>
    </AuthProvider>
  );
}
