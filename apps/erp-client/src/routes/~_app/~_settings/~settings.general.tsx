import { Label } from '@retailify/ui/components/ui/label';
import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { PiLaptop, PiMoon, PiSun } from 'react-icons/pi';
import {
  RadioGroup,
  RadioGroupItem,
} from '@retailify/ui/components/ui/radio-group';
import { useTheme } from '@retailify/ui/components/providers/vite-theme-provider';
import { cn } from '@retailify/ui/lib/utils';

export const Route = createFileRoute('/_app/_settings/settings/general')({
  component: Component,
});

function Component() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1>{t('erp:settings.pages.general.title')}</h1>
        <p className="muted">{t('erp:settings.pages.general.subtitle')}</p>
      </div>
      <Profile />
      <Other />
    </div>
  );
}

function Profile() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4">
      <h2>{t('erp:settings.pages.general.profile.title')}</h2>
    </div>
  );
}

function Other() {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-col gap-4">
      <h2>{t('erp:settings.pages.general.appearance.title')}</h2>
      <div className="space-y-2">
        <Label htmlFor="theme">
          {t('erp:settings.pages.general.appearance.theme.title')}
        </Label>
        <RadioGroup
          defaultValue={theme}
          onValueChange={(value) => setTheme(value as typeof theme)}
          id="theme"
          className="flex items-center gap-2"
        >
          <div className="flex items-center">
            <RadioGroupItem value="light" id="light" className="peer sr-only" />
            <Label
              htmlFor="light"
              className={cn(
                'flex p-4 items-center gap-2 rounded-md shadow-sm border bg-paper cursor-pointer',
                theme === 'light' ? 'border-primary' : 'border-input',
              )}
            >
              <PiSun className="h-4 w-4" />
              {t('erp:settings.pages.general.appearance.theme.options.light')}
            </Label>
          </div>
          <div className="flex items-center">
            <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
            <Label
              htmlFor="dark"
              className={cn(
                'flex p-4 items-center gap-2 rounded-md shadow-sm border bg-paper cursor-pointer',
                theme === 'dark' ? 'border-primary' : 'border-input',
              )}
            >
              <PiMoon className="h-4 w-4" />
              {t('erp:settings.pages.general.appearance.theme.options.dark')}
            </Label>
          </div>
          <div className="flex items-center">
            <RadioGroupItem
              value="system"
              id="system"
              className="peer sr-only"
            />
            <Label
              htmlFor="system"
              className={cn(
                'flex p-4 items-center gap-2 rounded-md shadow-sm border bg-paper cursor-pointer',
                theme === 'system' ? 'border-primary' : 'border-input',
              )}
            >
              <PiLaptop className="h-4 w-4" />
              {t('erp:settings.pages.general.appearance.theme.options.system')}
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
