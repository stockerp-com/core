import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@retailify/ui/components/ui/card';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/use-auth';
import { useForm } from 'react-hook-form';
import {
  addOrganizationSchema,
  AddOrganizationSchema,
} from '@retailify/validation/erp/organization/add.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { trpc, trpcQueryUtils } from '../router';
import { toast } from '@retailify/ui/lib/toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@retailify/ui/components/ui/form';
import { Input } from '@retailify/ui/components/ui/input';
import { Textarea } from '@retailify/ui/components/ui/textarea';
import { Button } from '@retailify/ui/components/ui/button';
import { PiArrowLeft, PiBuildingOffice } from 'react-icons/pi';
import SpinnerIcon from '@retailify/ui/components/ui/spinner-icon';
import { useState } from 'react';
import { useGetTheme } from '../hooks/use-get-theme';
import { Progress } from '@retailify/ui/components/ui/progress';
import { formatPercentage } from '@retailify/ui/lib/formatter';

export const Route = createFileRoute('/new-org')({
  component: Component,
});

function Component() {
  const [isStarted, setIsStarted] = useState(false);
  const [progress, setProgress] = useState(0);

  return (
    <div className="h-[100dvh] w-[100dvw] bg-background flex items-center justify-center">
      {isStarted ? (
        <OrgLoader progress={progress} setProgress={setProgress} />
      ) : (
        <CreateOrg setIsStarted={setIsStarted} />
      )}
    </div>
  );
}

function CreateOrg(props: { setIsStarted: (value: boolean) => void }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const authCtx = useAuth();

  const { mutate, isPending } = trpc.organization.add.useMutation({
    onSuccess: ({ message, accessToken }) => {
      navigate({
        to: '/settings/organizations',
      });
      authCtx.setAuth(accessToken);
      toast.success(message);
      trpcQueryUtils.organization.findMany.invalidate();
      trpcQueryUtils.organization.findManyInfinite.invalidate();
      props.setIsStarted(false);
    },
    onError: ({ message }) => {
      props.setIsStarted(false);
      toast.error(message);
    },
  });

  const form = useForm<AddOrganizationSchema>({
    resolver: zodResolver(addOrganizationSchema),
    defaultValues: {
      name: '',
      description: '',
    },
    disabled: isPending,
  });

  function onSubmit(values: AddOrganizationSchema) {
    mutate(values);
    props.setIsStarted(true);
  }

  return (
    <Card className="w-full max-w-screen-sm">
      <CardHeader>
        <CardTitle>{t('content:organization.add.title')}</CardTitle>
        <CardDescription>
          {t('content:organization.add.subtitle')}
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>
                    {t('content:organization.add.form_fields.name.label')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t(
                        'content:organization.add.form_fields.name.placeholder',
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>
                    {t(
                      'content:organization.add.form_fields.description.label',
                    )}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t(
                        'content:organization.add.form_fields.description.placeholder',
                      )}
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage t={t} />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex-col-reverse lg:flex-row lg:justify-end gap-4">
        <Button variant="secondary" asChild>
          <Link
            to="/settings/organizations"
            className="flex items-center gap-2"
            disabled={isPending}
          >
            <PiArrowLeft className="h-4 w-4" />
            {t('common:actions.back')}
          </Link>
        </Button>
        <Button
          className="flex items-center gap-2"
          disabled={isPending}
          onClick={form.handleSubmit(onSubmit)}
        >
          {isPending ? (
            <SpinnerIcon />
          ) : (
            <PiBuildingOffice className="h-4 w-4" />
          )}
          {t('content:organization.add.title')}
        </Button>
      </CardFooter>
    </Card>
  );
}

function OrgLoader(props: {
  progress: number;
  setProgress: (value: number) => void;
}) {
  trpc.organization.onAdd.useSubscription(undefined, {
    onData: ({ progress }) => props.setProgress(progress),
  });

  const { t, i18n } = useTranslation();
  const { actualTheme } = useGetTheme();

  return (
    <Card className="w-full max-w-screen-sm">
      <CardHeader>
        <CardTitle>{t('content:organization.add.adding')}</CardTitle>
        <CardDescription>
          {t('content:organization.add.adding_subtitle')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center gap-4 w-full h-48 bg-muted border rounded-md shadow">
          <img
            src={
              actualTheme === 'light'
                ? '/icon-black.svg'
                : actualTheme === 'dark'
                  ? '/icon-white.svg'
                  : '/icon-black.svg'
            }
            className="w-16 h-16 drop-shadow-sm"
          />
          <h1 className="text-6xl z-10 font-medium drop-shadow-sm">
            Retailify
          </h1>
        </div>
      </CardContent>
      <CardFooter className="flex w-full gap-4 mt-4">
        <Progress value={props.progress * 100} className="w-full" />
        <span>{formatPercentage(props.progress, i18n.language)}</span>
      </CardFooter>
    </Card>
  );
}
