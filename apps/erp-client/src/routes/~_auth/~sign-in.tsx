import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import AuthTitle from './components/AuthTitle';
import { trpc } from '../../utils/trpc';
import { toast } from '@retailify/ui/lib/toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  SignInInput,
  signInSchema,
} from '@retailify/validation/erp/auth/sign-in.schema';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@retailify/ui/components/ui/form';
import { Input } from '@retailify/ui/components/ui/input';
import { PasswordInput } from '@retailify/ui/components/form/PasswordInput';
import SubmitButton from '@retailify/ui/components/form/SubmitButton';
import { PiSignIn } from 'react-icons/pi';
import { useAuth } from '../../hooks/use-auth';
import { jwtDecode } from 'jwt-decode';
import { EmployeeSession } from '@retailify/trpc/types/erp/auth/session.d';

export const Route = createFileRoute('/_auth/sign-in')({
  component: SignInComponent,
});

function SignInComponent() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-16">
      <AuthTitle
        title={t('content:auth.sign_in.title')}
        subtitle={t('content:auth.sign_in.subtitle')}
      />
      <SignInForm />
    </div>
  );
}

function SignInForm() {
  const authCtx = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { mutate, isPending } = trpc.auth.signIn.useMutation({
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

  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(values: SignInInput) {
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>
                  {t('content:auth.sign_in.form_fields.email.label')}
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={t(
                      'content:auth.sign_in.form_fields.email.placeholder',
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
                  {t('content:auth.sign_in.form_fields.password.label')}
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder={t(
                      'content:auth.sign_in.form_fields.password.placeholder',
                    )}
                    t={t}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  <Link className="text-muted-foreground hover:underline">
                    {t('content:auth.sign_in.forgot_password')}
                  </Link>
                </FormDescription>
                <FormMessage t={t} />
              </FormItem>
            )}
          />
          <SubmitButton
            addMt
            loading={isPending}
            text={t('common:actions.sign_in')}
            icon={PiSignIn}
          />
        </form>
      </Form>
      <div className="flex w-full items-center justify-center">
        <Link to="/sign-up" className="underline text-muted-foreground">
          {t('content:auth.sign_in.sign_up_message')}
        </Link>
      </div>
    </div>
  );
}
