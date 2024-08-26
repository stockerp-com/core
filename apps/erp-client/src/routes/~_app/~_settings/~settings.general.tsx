import { Label } from '@retailify/ui/components/ui/label';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { PiCheck, PiLaptop, PiMoon, PiSignOut, PiSun } from 'react-icons/pi';
import {
  RadioGroup,
  RadioGroupItem,
} from '@retailify/ui/components/ui/radio-group';
import { useTheme } from '@retailify/ui/components/providers/vite-theme-provider';
import { cn } from '@retailify/ui/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@retailify/ui/components/ui/select';
import { useAuth } from '../../../hooks/use-auth';
import { useForm } from 'react-hook-form';
import {
  EditProfileInput,
  editProfileSchema,
} from '@retailify/validation/erp/account/edit-profile.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { trpc } from '../../../utils/trpc';
import { toast } from '@retailify/ui/lib/toast';
import { useEffect, useState } from 'react';
import useUpload from '../../../hooks/use-upload';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@retailify/ui/components/ui/form';
import { Input } from '@retailify/ui/components/ui/input';
import { DropzoneFileInput } from '@retailify/ui/components/ui/file-select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@retailify/ui/components/ui/card';
import SubmitButton from '@retailify/ui/components/form/SubmitButton';
import { IconType } from 'react-icons';
import { Skeleton } from '@retailify/ui/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@retailify/ui/components/ui/dialog';
import { Button } from '@retailify/ui/components/ui/button';
import SpinnerIcon from '@retailify/ui/components/ui/spinner-icon';

export const Route = createFileRoute('/_app/_settings/settings/general')({
  component: Component,
});

function Component() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1>{t('content:settings.general.title')}</h1>
        <p className="muted">{t('content:settings.general.subtitle')}</p>
      </div>
      <Profile />
      <Appearance />
      <SignOut />
    </div>
  );
}

function Profile() {
  const { t } = useTranslation();
  const authCtx = useAuth();

  const form = useForm<EditProfileInput>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      email: '',
      fullName: '',
    },
  });

  const utils = trpc.useUtils();

  const { mutate, isPending } = trpc.account.editProfile.useMutation({
    onSuccess: ({ message }) => {
      toast.success(message);
      utils.employee.findOne.invalidate({
        id: authCtx.session?.id,
      });
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });
  const { data, isLoading } = trpc.employee.findOne.useQuery({
    id: authCtx.session?.id as unknown as number,
  });

  useEffect(() => {
    if (data) {
      form.reset({
        email: data.employee?.email ?? '',
        fullName: data.employee?.fullName ?? '',
        picture: data.employee?.picture
          ? {
              key: data.employee.picture.key,
              name: data.employee.picture.name,
              size: data.employee.picture.size,
              type: data.employee.picture.type,
            }
          : null,
      });
    }
  }, [data, form]);

  const { uploadOne } = useUpload();

  function onSubmit(values: EditProfileInput) {
    mutate(values);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('content:settings.general.profile.title')}</CardTitle>
        <CardDescription>
          {t('content:settings.general.profile.subtitle')}
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
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>
                    {t(
                      'content:account.edit_profile.form_fields.full_name.label',
                    )}
                  </FormLabel>
                  <FormControl>
                    {isLoading ? (
                      <Skeleton className="h-9" />
                    ) : (
                      <Input
                        placeholder={t(
                          'content:account.edit_profile.form_fields.full_name.placeholder',
                        )}
                        {...field}
                      />
                    )}
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
                    {t('content:account.edit_profile.form_fields.email.label')}
                  </FormLabel>
                  <FormControl>
                    {isLoading ? (
                      <Skeleton className="h-9" />
                    ) : (
                      <Input
                        type="email"
                        placeholder={t(
                          'content:account.edit_profile.form_fields.email.placeholder',
                        )}
                        {...field}
                      />
                    )}
                  </FormControl>
                  <FormMessage t={t} />
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <Label htmlFor="edit_profile_picture">
                {t('content:account.edit_profile.form_fields.picture.label')}
              </Label>
              <DropzoneFileInput
                removeFile={() => form.setValue('picture', null)}
                labelHtmlFor="edit_profile_picture"
                placeholder={t(
                  'content:account.edit_profile.form_fields.picture.placeholder',
                )}
                placeholderDragging={t(
                  'content:account.edit_profile.form_fields.picture.dragging',
                )}
                isLoading={isLoading}
                maxSize={1 * 1024 * 1024}
                contentType="image"
                callback={async (files) => {
                  if (authCtx.accessToken && authCtx.session && files[0]) {
                    const key = await uploadOne({
                      file: files[0],
                      directory: 'profile',
                      accessToken: authCtx.accessToken,
                      path: 'employees',
                      session: authCtx.session,
                    });

                    if (key) {
                      form.setValue('picture', {
                        key,
                        name: files[0].name,
                        size: files[0].size,
                        type: files[0].type,
                      });
                    }
                  }
                }}
                uploadedFiles={[form.watch('picture')]}
                baseImgUrl={`${import.meta.env.VITE_WORKER_URL}/r2`}
              />
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <SubmitButton
          onClick={form.handleSubmit(onSubmit)}
          icon={PiCheck}
          text={t('common:actions.save')}
          pending={isPending}
          className="ml-auto"
        />
      </CardFooter>
    </Card>
  );
}

function Appearance() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('content:settings.general.appearance.title')}</CardTitle>
        <CardDescription>
          {t('content:settings.general.appearance.subtitle')}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <LanguageField />
        <ThemeField />
      </CardContent>
    </Card>
  );
}

const languages = ['en', 'uk-UA', 'ru'];
function LanguageField() {
  const { t, i18n } = useTranslation();

  return (
    <div className="space-y-2">
      <Label htmlFor="language">
        {t('content:settings.general.appearance.language.label')}
      </Label>
      <Select
        defaultValue={i18n.language}
        onValueChange={(value) => i18n.changeLanguage(value)}
      >
        <SelectTrigger className="flex" id="language">
          <SelectValue
            placeholder={t(
              'content:settings.general.appearance.language.placeholder',
            )}
          />
        </SelectTrigger>
        <SelectContent>
          {languages.map((language) => (
            <SelectItem key={language} value={language}>
              {t(
                `content:settings.general.appearance.language.options.${language}`,
              )}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

const themes = [
  {
    text: 'content:settings.general.appearance.theme.options.light',
    value: 'light',
    icon: PiSun,
  },
  {
    text: 'content:settings.general.appearance.theme.options.dark',
    value: 'dark',
    icon: PiMoon,
  },
  {
    text: 'content:settings.general.appearance.theme.options.system',
    value: 'system',
    icon: PiLaptop,
  },
];
function ThemeField() {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-2">
      <Label htmlFor="theme">
        {t('content:settings.general.appearance.theme.label')}
      </Label>
      <RadioGroup
        defaultValue={theme}
        onValueChange={(value) => setTheme(value as typeof theme)}
        id="theme"
        className="flex flex-col lg:flex-row items-center gap-2"
      >
        {themes.map(({ icon, text, value }) => (
          <ThemeItem
            key={value}
            theme={theme}
            text={t(text)}
            value={value}
            icon={icon}
          />
        ))}
      </RadioGroup>
    </div>
  );
}

function ThemeItem(props: {
  theme: string;
  text: string;
  value: string;
  icon: IconType;
}) {
  return (
    <div className="flex items-center w-full">
      <RadioGroupItem
        value={props.value}
        id={props.value}
        className="peer sr-only"
      />
      <Label
        htmlFor={props.value}
        className={cn(
          'flex w-full p-4 items-center gap-2 rounded-md shadow-sm border cursor-pointer',
          props.theme === props.value ? 'border-primary' : 'border-input',
        )}
      >
        <props.icon className="h-4 w-4" />
        {props.text}
      </Label>
    </div>
  );
}

function SignOut() {
  const [isOpened, setIsOpened] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { mutate, isPending } = trpc.auth.signOut.useMutation({
    onSuccess: ({ message }) => {
      setIsOpened(false);
      toast.info(message);
      navigate({
        to: '/sign-in',
      });
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('content:settings.general.sign_out.title')}</CardTitle>
        <CardDescription>
          {t('content:settings.general.sign_out.subtitle')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Dialog open={isOpened} onOpenChange={setIsOpened}>
          <DialogTrigger asChild>
            <Button variant="destructive" onClick={() => setIsOpened(true)}>
              <PiSignOut className="h-4 w-4 mr-2" />
              {t('content:auth.sign_out.title')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('content:auth.sign_out.title')}</DialogTitle>
              <DialogDescription>
                {t('content:auth.sign_out.subtitle')}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setIsOpened(false)}>
                {t('common:actions.cancel')}
              </Button>
              <Button
                variant="destructive"
                className="flex items-center gap-2"
                onClick={() => mutate()}
                disabled={isPending}
              >
                {isPending ? (
                  <SpinnerIcon />
                ) : (
                  <PiSignOut className="h-4 w-4" />
                )}
                {t('common:actions.sign_out')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
