import { zodResolver } from '@hookform/resolvers/zod';
import SubmitButton from '@retailify/ui/components/form/SubmitButton';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@retailify/ui/components/ui/form';
import { Input } from '@retailify/ui/components/ui/input';
import {
  LogInInput,
  logInSchema,
} from '@retailify/validation/admin/auth/log-in.schema';
import { SignIn } from 'phosphor-react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export default function LogInForm() {
  const { t } = useTranslation();

  const form = useForm<LogInInput>({
    resolver: zodResolver(logInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(values: LogInInput) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col w-full gap-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>{t('auth:form.email')}:</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder={t('auth:form.emailPlaceholder')}
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
              <FormLabel required>{t('auth:form.password')}:</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder={t('auth:form.passwordPlaceholder')}
                  {...field}
                />
              </FormControl>
              <FormMessage t={t} />
            </FormItem>
          )}
        />
        <SubmitButton addMt text={t('auth:button.logIn')} icon={SignIn} />
      </form>
    </Form>
  );
}
