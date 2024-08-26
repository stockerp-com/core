import { useTheme } from '@retailify/ui/components/providers/vite-theme-provider';

export function useGetTheme() {
  const { theme: selectedTheme } = useTheme();

  return {
    getActualTheme: () => {
      let actualTheme: 'light' | 'dark' = 'light';

      if (selectedTheme) {
        if (selectedTheme === 'light' || selectedTheme === 'dark') {
          actualTheme = selectedTheme === 'light' ? 'light' : 'dark';
        }
      } else if (
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      ) {
        actualTheme = 'dark';
      }

      return actualTheme;
    },
  };
}
