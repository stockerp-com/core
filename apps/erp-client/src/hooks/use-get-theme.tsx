import { useTheme } from '@retailify/ui/components/providers/vite-theme-provider';
import { useEffect, useState } from 'react';

export function useGetTheme() {
  const { theme: selectedTheme } = useTheme();
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    let actualTheme: 'light' | 'dark' = 'light';

    if (selectedTheme) {
      if (selectedTheme === 'light' || selectedTheme === 'dark') {
        actualTheme = selectedTheme === 'light' ? 'light' : 'dark';
      } else if (
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      ) {
        actualTheme = 'dark';
      }
    }

    setActualTheme(actualTheme);
  }, [selectedTheme]);

  return {
    actualTheme,
  };
}
