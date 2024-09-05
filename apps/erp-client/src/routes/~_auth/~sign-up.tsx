import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import AuthTitle from './components/AuthTitle';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  SignUpInput,
  signUpSchema,
} from '@core/validation/erp/auth/sign-up.schema';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@core/ui/components/ui/form';
import SubmitButton from '@core/ui/components/form/SubmitButton';
import { PasswordInput } from '@core/ui/components/form/PasswordInput';
import { Input } from '@core/ui/components/ui/input';
import { toast } from '@core/ui/lib/toast';
import { PiSignIn } from 'react-icons/pi';
import { useAuth } from '../../hooks/use-auth';
import { trpc } from '../../router';

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
      authCtx.setAuth(accessToken);

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
      locale: i18n.language,
    },
  });

  function onSubmit(values: SignUpInput) {
    mutate(values);
  }

  return (
    <div className="flex flex-col gap-8">
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
            onClick={form.handleSubmit(onSubmit)}
            addMt
            pending={isPending}
            text={t('common:actions.sign_up')}
            icon={PiSignIn}
          />
        </form>
      </Form>
      <div className="flex w-full items-center justify-center">
        <Link to="/sign-in" className="underline text-muted-foreground">
          {t('content:auth.sign_up.sign_in_message')}
        </Link>
      </div>
    </div>
  );
}
