import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import AuthTitle from './components/AuthTitle';
import LogInForm from './components/LogInForm';

export const Route = createFileRoute('/_auth/log-in')({
  component: LogInComponent,
});

function LogInComponent() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col w-full gap-16">
      <AuthTitle
        title={t('auth:logIn.title')}
        message={t('auth:logIn.message')}
      />
      <LogInForm />
    </div>
  );
}
