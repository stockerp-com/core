import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import AuthTitle from './components/AuthTitle';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  SignUpInput,
  signUpSchema,
} from '@retailify/validation/erp/auth/sign-up.schema';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@retailify/ui/components/ui/form';
import SubmitButton from '@retailify/ui/components/form/SubmitButton';
import { trpc } from '../../utils/trpc';
import { PasswordInput } from '@retailify/ui/components/form/PasswordInput';
import { Input } from '@retailify/ui/components/ui/input';
import { toast } from '@retailify/ui/lib/toast';
import { PiSignIn } from 'react-icons/pi';
import { EmployeeSession } from '@retailify/trpc/types/erp/auth/session.d';
import { useAuth } from '../../hooks/use-auth';
import { jwtDecode } from 'jwt-decode';

export const Route = createFileRoute('/_auth/sign-up')({
  component: SignUpComponent,
});

function SignUpComponent() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-16">
      <AuthTitle
        title={t('content:auth.sign_up.title')}
        subtitle={t('content:auth.sign_up.subtitle')}
      />
      <SignUpForm />
    </div>
  );
}

function SignUpForm() {
  const authCtx = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { mutate, isPending } = trpc.auth.signUp.useMutation({
    onSuccess({ message, accessToken }) {
      const session = jwtDecode(accessToken) as unknown as EmployeeSession;
      authCtx.setAccessToken(accessToken);
      authCtx.setSession(session);

      toast.success(message);
      navigate({
        to: '/',
      });
    },
    onError({ message }) {
      toast.error(message);
    },
  });

  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      preferredLanguage: i18n.language,
    },
  });

  function onSubmit(values: SignUpInput) {
    mutate(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>
                {t('content:auth.sign_up.form_fields.full_name.label')}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t(
                    'content:auth.sign_up.form_fields.full_name.placeholder',
                  )}
                  {...field}
                />
              </FormControl>
              <FormMessage t={t} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>
                {t('content:auth.sign_up.form_fields.email.label')}
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder={t(
                    'content:auth.sign_up.form_fields.email.placeholder',
                  )}
                  {...field}
                />
              </FormControl>
              <FormMessage t={t} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>
                {t('content:auth.sign_up.form_fields.password.label')}
              </FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder={t(
                    'content:auth.sign_up.form_fields.password.placeholder',
                  )}
                  t={t}
                  {...field}
                />
              </FormControl>
              <FormMessage t={t} />
            </FormItem>
          )}
        />
        <SubmitButton
          addMt
          loading={isPending}
          text={t('common:actions.sign_up')}
          icon={PiSignIn}
        />
      </form>
    </Form>
  );
}
