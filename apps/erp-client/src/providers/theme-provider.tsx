import { ReactNode } from 'react';
import { ThemeProvider as Provider } from '@retailify/ui/components/providers/vite-theme-provider';

export default function ThemeProvider(props: { children: ReactNode }) {
  return (
    <Provider defaultTheme="system" storageKey="retailify-admin-theme">
      {props.children}
    </Provider>
  );
}
