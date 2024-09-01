import { ReactNode } from 'react';
import { ThemeProvider as Provider } from '@core/ui/components/providers/vite-theme-provider';

export default function ThemeProvider(props: { children: ReactNode }) {
  return (
    <Provider defaultTheme="system" storageKey="stockerp-erp-theme">
      {props.children}
    </Provider>
  );
}
