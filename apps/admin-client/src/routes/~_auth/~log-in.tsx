import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import AuthTitle from './components/AuthTitle';
import LogInForm from './components/LogInForm';
import { Button } from '@retailify/ui/components/ui/button';

export const Route = createFileRoute('/_auth/log-in')({
  component: LogInComponent,
});

function LogInComponent() {
  const { t, i18n } = useTranslation();

  return (
    <div className="flex flex-col w-full gap-16">
      <AuthTitle
        title={t('auth:logIn.title')}
        message={t('auth:logIn.message')}
      />
      <div className="flex flex-col">
        <Button onClick={() => i18n.changeLanguage('en')}>Set English</Button>
        <Button onClick={() => i18n.changeLanguage('uk-UA')}>
          Set Ukrainian
        </Button>
        <Button onClick={() => i18n.changeLanguage('ru')}>Set Russian</Button>
        {t('common:greeting')}
      </div>
      <LogInForm />
    </div>
  );
}
