import { useTranslation } from 'react-i18next';
import { trpc } from '../../utils/trpc';
import { useState } from 'react';
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

export default function SettingsMenu(props: { isCollapsed: boolean }) {
  const { t } = useTranslation();
  const { data } = trpc.employee.findMe.useQuery();
  const [isSignOutDialogOpened, setIsSignOutDialogOpened] = useState(false);
  const [isChangePasswordDialogOpened, setIsChangePasswordDialogOpened] =
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
      <DropdownMenu>
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
            <DropdownMenuItem className="flex items-center gap-2">
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
            <ColorModeSubMenu />
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
