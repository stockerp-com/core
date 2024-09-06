import SubmitButton from '@core/ui/components/form/SubmitButton';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@core/ui/components/ui/card';
import { createFileRoute } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { PiKey } from 'react-icons/pi';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ChangePasswordInput,
  changePasswordSchema,
} from '@core/validation/erp/auth/change-password.schema';
import { toast } from '@core/ui/lib/toast';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@core/ui/components/ui/form';
import { PasswordInput } from '@core/ui/components/form/PasswordInput';
import { trpc } from '../../../router';

export const Route = createFileRoute('/_app/_settings/settings/security')({
  component: Component,
});

function Component() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1>{t('content:erp.settings.security.title')}</h1>
        <p className="muted">{t('content:erp.settings.security.subtitle')}</p>
      </div>
      <ChangePassword />
    </div>
  );
}

function ChangePassword() {
  const { t } = useTranslation();

  const form = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      newPassword: '',
    },
  });

  const { mutate, isPending } = trpc.auth.changePassword.useMutation({
    onSuccess: ({ message }) => {
      toast.success(message);
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  function onSubmit(values: ChangePasswordInput) {
    mutate(values);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t('content:erp.settings.security.change_password.title')}
        </CardTitle>
        <CardDescription>
          {t('content:erp.settings.security.change_password.subtitle')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>
                    {t(
                      'content:erp.auth.change_password.form_fields.new_password.label',
                    )}
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      autoComplete="new-password"
                      placeholder={t(
                        'content:erp.auth.change_password.form_fields.new_password.placeholder',
                      )}
                      t={t}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {t(
                      'content:erp.auth.change_password.form_fields.new_password.description',
                    )}
                  </FormDescription>
                  <FormMessage t={t} />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <SubmitButton
          onClick={form.handleSubmit(onSubmit)}
          icon={PiKey}
          text={t('common:actions.change_password')}
          pending={isPending}
          className="ml-auto"
        />
      </CardFooter>
    </Card>
  );
}
