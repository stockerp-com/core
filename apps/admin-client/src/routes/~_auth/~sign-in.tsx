import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import AuthTitle from './components/AuthTitle';
import { trpc } from '../../utils/trpc';
import { toast } from '@retailify/ui/lib/toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  SignInInput,
  signInSchema,
} from '@retailify/validation/admin/auth/sign-in.schema';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@retailify/ui/components/ui/form';
import { Input } from '@retailify/ui/components/ui/input';
import { PasswordInput } from '@retailify/ui/components/form/PasswordInput';
import SubmitButton from '@retailify/ui/components/form/SubmitButton';
import { PiSignIn } from 'react-icons/pi';

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
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { mutate, isPending } = trpc.auth.signIn.useMutation({
    onSuccess({ message }) {
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
  );
}
