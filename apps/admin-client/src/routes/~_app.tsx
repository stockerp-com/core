import {
  createFileRoute,
  Outlet,
  redirect,
  useNavigate,
} from '@tanstack/react-router';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@retailify/ui/components/ui/resizable';
import { cn } from '@retailify/ui/lib/utils';
import { ScrollArea } from '@retailify/ui/components/ui/scroll-area';
import { useState } from 'react';
import { trpc } from '../utils/trpc';
import { API_URL } from '../utils/constants';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@retailify/ui/components/ui/avatar';
import { getNameShorthand } from '../utils/ui';
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
import { Skeleton } from '@retailify/ui/components/ui/skeleton';
import { useTranslation } from 'react-i18next';
import {
  PiSignOut,
  PiUser,
  PiPalette,
  PiSun,
  PiMoon,
  PiLaptop,
  PiCheck,
} from 'react-icons/pi';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@retailify/ui/components/ui/dialog';
import { Button } from '@retailify/ui/components/ui/button';
import SpinnerIcon from '@retailify/ui/components/ui/spinner-icon';
import { toast } from '@retailify/ui/lib/toast';
import { useTheme } from '@retailify/ui/components/providers/vite-theme-provider';
import { HiOutlineCog6Tooth } from 'react-icons/hi2';

export const Route = createFileRoute('/_app')({
  component: AppComponent,
  beforeLoad: async ({ location }) => {
    try {
      const res = await fetch(`${API_URL}/auth.verify`, {
        credentials: 'include',
      }).then((res) => res.json());

      if (res.result.data.json.ok !== true) {
        throw redirect({
          to: '/sign-in',
          search: {
            location: location.href,
          },
        });
      }
    } catch (e) {
      throw redirect({
        to: '/sign-in',
        search: {
          location: location.href,
        },
      });
    }
  },
});

function AppComponent() {
  return (
    <Wrapper>
      <Outlet />
    </Wrapper>
  );
}

function Wrapper(props: { children: React.ReactNode }) {
  return (
    <div className="h-[100dvh] w-[100dvw]">
      <Layout>{props.children}</Layout>
    </div>
  );
}

function Layout(props: { children: React.ReactNode }) {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-full items-stretch"
    >
      <Sidebar />
      <ResizableHandle
        withHandle
        className="bg-zinc-50 dark:bg-zinc-900 hidden lg:flex"
      />
      <ResizablePanel minSize={50} className="bg-zinc-50 dark:bg-zinc-900">
        <Topbar />
        <ScrollArea className="h-full w-full p-6">{props.children}</ScrollArea>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(
    JSON.parse(String(localStorage.getItem('sidebar:size') === '0') || 'false'),
  );

  function setLocalStorageSize(size: number) {
    localStorage.setItem('sidebar:size', JSON.stringify(size));
  }

  function handleCollapse() {
    setIsCollapsed(true);
    setLocalStorageSize(0);
  }

  function handleResize(size: number) {
    setIsCollapsed(false);
    setLocalStorageSize(size);
  }

  return (
    <ResizablePanel
      collapsible={true}
      minSize={15}
      maxSize={20}
      defaultSize={parseFloat(localStorage.getItem('sidebar:size') || '20')}
      onCollapse={() => handleCollapse()}
      onResize={(size) => handleResize(size)}
      className={cn(
        'bg-background border-r border-r-input lg:flex flex-col items-center hidden',
        isCollapsed && 'min-w-14 transition-all duration-300 ease-in-out',
      )}
    >
      <div className="w-full h-14 shrink-0 border-b border-b-input">
        <SidebarOrganization />
      </div>
      <SidebarNavigation isCollapsed={isCollapsed} />
    </ResizablePanel>
  );
}

function SidebarOrganization() {
  return <></>;
}

function SidebarNavigation(props: { isCollapsed: boolean }) {
  return (
    <div className="flex flex-col justify-between h-full w-full">
      <div className="flex h-full p-2.5"></div>
      <div className="flex flex-col gap-2 p-2.5 border-t border-t-input">
        <DisplayUser isCollapsed={props.isCollapsed} />
        <SettingsMenu isCollapsed={props.isCollapsed} />
      </div>
    </div>
  );
}

function Topbar() {
  return (
    <nav className="flex justify-between px-2.5 items-center w-full bg-background border-b border-b-input h-14 sticky top-0"></nav>
  );
}

function DisplayUser(props: { isCollapsed: boolean }) {
  const { data, isLoading, isError } = trpc.employee.findMe.useQuery();

  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-9 w-9 flex rounded-md">
        <AvatarImage className="rounded-md" />
        <AvatarFallback className="text-muted-foreground rounded-md">
          {data?.employee?.fullName &&
            getNameShorthand(data?.employee?.fullName)}
        </AvatarFallback>
      </Avatar>
      {isLoading && !props.isCollapsed ? (
        <Skeleton className="h-4 w-36" />
      ) : isError && !props.isCollapsed ? (
        <span className="text-destructive">Error :(</span>
      ) : (
        !props.isCollapsed && (
          <span className="text-sm line-clamp-1">
            {data?.employee?.fullName}
          </span>
        )
      )}
    </div>
  );
}

function SettingsMenu(props: { isCollapsed: boolean }) {
  const { t } = useTranslation();
  const { data } = trpc.employee.findMe.useQuery();
  const [isSignOutDialogOpened, setIsSignOutDialogOpened] = useState(false);

  return (
    <>
      <SignOutDialog
        isOpened={isSignOutDialogOpened}
        setIsOpened={setIsSignOutDialogOpened}
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
