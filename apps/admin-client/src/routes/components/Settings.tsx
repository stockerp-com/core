import { useTranslation } from 'react-i18next';
import { trpc } from '../../utils/trpc';
import { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@retailify/ui/components/ui/dropdown-menu';
import { Button } from '@retailify/ui/components/ui/button';
import { HiOutlineCog6Tooth } from 'react-icons/hi2';
import {
  PiCheck,
  PiGlobeSimple,
  PiKey,
  PiLaptop,
  PiMoon,
  PiPalette,
  PiSignOut,
  PiSun,
  PiUser,
} from 'react-icons/pi';
import { cn } from '@retailify/ui/lib/utils';
import { useNavigate } from '@tanstack/react-router';
import { toast } from '@retailify/ui/lib/toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@retailify/ui/components/ui/dialog';
import SpinnerIcon from '@retailify/ui/components/ui/spinner-icon';
import { useTheme } from '@retailify/ui/components/providers/vite-theme-provider';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  ChangePasswordInput,
  changePasswordSchema,
} from '@retailify/validation/admin/auth/change-password.schema';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@retailify/ui/components/ui/form';
import { PasswordInput } from '@retailify/ui/components/form/PasswordInput';
import {
  EditProfileInput,
  editProfileSchema,
} from '@retailify/validation/admin/account/edit-profile.schema';
import { Input } from '@retailify/ui/components/ui/input';
import useS3 from '../../hooks/use-s3';
import { Label } from '@retailify/ui/components/ui/label';
import { DropzoneFileInput } from '@retailify/ui/components/ui/file-select';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@retailify/ui/components/ui/command';

export default function SettingsMenu(props: { isCollapsed: boolean }) {
  const { t } = useTranslation();
  const { data } = trpc.employee.findMe.useQuery();
  const [isOpened, setIsOpened] = useState(false);
  const [isSignOutDialogOpened, setIsSignOutDialogOpened] = useState(false);
  const [isChangePasswordDialogOpened, setIsChangePasswordDialogOpened] =
    useState(false);
  const [isEditProfileDialogOpened, setIsEditProfileDialogOpened] =
    useState(false);

  return (
    <>
      <SignOutDialog
        isOpened={isSignOutDialogOpened}
        setIsOpened={setIsSignOutDialogOpened}
      />
      <ChangePasswordDialog
        isOpened={isChangePasswordDialogOpened}
        setIsOpened={setIsChangePasswordDialogOpened}
      />
      <EditProfileDialog
        isOpened={isEditProfileDialogOpened}
        setIsOpened={setIsEditProfileDialogOpened}
      />
      <DropdownMenu open={isOpened} onOpenChange={setIsOpened}>
        <DropdownMenuTrigger asChild>
          <Button
            size={props.isCollapsed ? 'icon' : 'default'}
            variant="outline"
            className={cn(
              !props.isCollapsed &&
                'w-full flex items-center gap-2 justify-start',
            )}
          >
            <HiOutlineCog6Tooth className="h-4 w-4" />
            {!props.isCollapsed && t('common:settings.settings')}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuLabel>
            <div className="flex flex-col gap-1 text-xs">
              <span className="line-clamp-1">{data?.employee?.fullName}</span>
              <span className="font-normal text-muted-foreground line-clamp-1">
                {data?.employee?.email}
              </span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="flex items-center gap-2"
              onClick={() => setIsEditProfileDialogOpened(true)}
            >
              <PiUser className="h-4 w-4" />
              {t('common:settings.my_account')}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center gap-2"
              onClick={() => setIsChangePasswordDialogOpened(true)}
            >
              <PiKey className="h-4 w-4" />
              {t('common:actions.change_password')}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center gap-2"
              onClick={() => setIsSignOutDialogOpened(true)}
            >
              <PiSignOut className="h-4 w-4" />
              {t('common:actions.sign_out')}
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <LanguageSubMenu isOpened={isOpened} setIsOpened={setIsOpened} />
            <ColorModeSubMenu />
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

function EditProfileDialog(props: {
  isOpened: boolean;
  setIsOpened: (isOpened: boolean) => void;
}) {
  const { t } = useTranslation();

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
      props.setIsOpened(false);
      toast.success(message);
      utils.employee.findMe.invalidate();
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });
  const { data } = trpc.employee.findMe.useQuery();
  const { upload } = useS3();

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

  async function onSubmit(values: EditProfileInput) {
    mutate(values);
  }

  return (
    <Dialog open={props.isOpened} onOpenChange={props.setIsOpened}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('content:account.edit_profile.title')}</DialogTitle>
          <DialogDescription>
            {t('content:account.edit_profile.subtitle')}
          </DialogDescription>
        </DialogHeader>
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
                    <Input
                      placeholder={t(
                        'content:account.edit_profile.form_fields.full_name.placeholder',
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
                    {t('content:account.edit_profile.form_fields.email.label')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={t(
                        'content:account.edit_profile.form_fields.email.placeholder',
                      )}
                      {...field}
                    />
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
                maxSize={1 * 1024 * 1024}
                contentType="image"
                callback={async (files) => {
                  const { data } = await upload(files[0], 'Profile_Pictures');
                  form.setValue('picture', data);
                }}
                uploadedFiles={[form.watch('picture')]}
                cdnUrl={import.meta.env.VITE_CDN_URL}
              />
            </div>
          </form>
        </Form>
        <DialogFooter className="mt-4">
          <Button variant="secondary" onClick={() => props.setIsOpened(false)}>
            {t('common:actions.cancel')}
          </Button>
          <Button
            className="flex items-center gap-2"
            onClick={form.handleSubmit(onSubmit)}
            disabled={isPending}
          >
            {isPending ? <SpinnerIcon /> : <PiCheck className="h-4 w-4" />}
            {t('common:actions.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SignOutDialog(props: {
  isOpened: boolean;
  setIsOpened: (isOpened: boolean) => void;
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { mutate, isPending } = trpc.auth.signOut.useMutation({
    onSuccess: ({ message }) => {
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
    <Dialog open={props.isOpened} onOpenChange={props.setIsOpened}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('content:auth.sign_out.title')}</DialogTitle>
          <DialogDescription>
            {t('content:auth.sign_out.subtitle')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="secondary" onClick={() => props.setIsOpened(false)}>
            {t('common:actions.cancel')}
          </Button>
          <Button
            variant="destructive"
            className="flex items-center gap-2"
            onClick={() => mutate()}
            disabled={isPending}
          >
            {isPending ? <SpinnerIcon /> : <PiSignOut className="h-4 w-4" />}
            {t('common:actions.sign_out')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ChangePasswordDialog(props: {
  isOpened: boolean;
  setIsOpened: (isOpened: boolean) => void;
}) {
  const { t } = useTranslation();

  const form = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      newPassword: '',
    },
  });

  const { mutate, isPending } = trpc.auth.changePassword.useMutation({
    onSuccess: ({ message }) => {
      props.setIsOpened(false);
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
    <Dialog open={props.isOpened} onOpenChange={props.setIsOpened}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('content:auth.change_password.title')}</DialogTitle>
          <DialogDescription>
            {t('content:auth.change_password.subtitle')}
          </DialogDescription>
        </DialogHeader>
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
                      'content:auth.change_password.form_fields.new_password.label',
                    )}
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder={t(
                        'content:auth.change_password.form_fields.new_password.placeholder',
                      )}
                      t={t}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {t(
                      'content:auth.change_password.form_fields.new_password.description',
                    )}
                  </FormDescription>
                  <FormMessage t={t} />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button variant="secondary" onClick={() => props.setIsOpened(false)}>
            {t('common:actions.cancel')}
          </Button>
          <Button
            className="flex items-center gap-2"
            onClick={form.handleSubmit(onSubmit)}
            disabled={isPending}
          >
            {isPending ? <SpinnerIcon /> : <PiKey className="h-4 w-4" />}
            {t('common:actions.change_password')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ColorModeSubMenu() {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className="flex items-center gap-2">
        <PiPalette className="h-4 w-4" />
        {t('common:settings.theme')}
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent className="w-40">
          <DropdownMenuItem
            className="flex items-center justify-between"
            onClick={() => setTheme('light')}
          >
            <div className="flex items-center gap-2">
              <PiSun className="h-4 w-4" />
              {t('common:settings.theme_options.light')}
            </div>
            <PiCheck
              className={cn(
                'h-4 w-4',
                theme === 'light' ? 'opacity-100' : 'opacity-0',
              )}
            />
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center justify-between"
            onClick={() => setTheme('dark')}
          >
            <div className="flex items-center gap-2">
              <PiMoon className="h-4 w-4" />
              {t('common:settings.theme_options.dark')}
            </div>
            <PiCheck
              className={cn(
                'h-4 w-4',
                theme === 'dark' ? 'opacity-100' : 'opacity-0',
              )}
            />
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center justify-between"
            onClick={() => setTheme('system')}
          >
            <div className="flex items-center gap-2">
              <PiLaptop className="h-4 w-4" />
              {t('common:settings.theme_options.system')}
            </div>
            <PiCheck
              className={cn(
                'h-4 w-4',
                theme === 'system' ? 'opacity-100' : 'opacity-0',
              )}
            />
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
}

const languages = ['en', 'ru', 'uk-UA'];

function LanguageSubMenu(props: {
  isOpened: boolean;
  setIsOpened: (isOpened: boolean) => void;
}) {
  const { t, i18n } = useTranslation();

  function onSelect(key: string) {
    i18n.changeLanguage(key);
  }

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className="flex items-center gap-2">
        <PiGlobeSimple className="h-4 w-4" />
        {t('common:settings.language.label')}
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent className="p-0">
        <Command>
          <CommandInput
            placeholder={t('common:settings.language.placeholder')}
            autoFocus
          />
          <CommandList>
            <CommandEmpty>{t('common:settings.language.empty')}</CommandEmpty>
            <CommandGroup>
              {languages.map((key) => (
                <CommandItem
                  key={key}
                  value={t(`common:settings.language.options.${key}`)}
                  onSelect={() => {
                    onSelect(key);
                    props.setIsOpened(false);
                  }}
                >
                  {t(`common:settings.language.options.${key}`)}
                  <PiCheck
                    className={cn(
                      'ml-auto h-4 w-4',
                      i18n.language === key ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
}
