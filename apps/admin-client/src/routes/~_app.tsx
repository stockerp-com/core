import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
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
import { Skeleton } from '@retailify/ui/components/ui/skeleton';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@retailify/ui/components/ui/avatar';
import { getNameShorthand } from '../utils/ui';

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
        isCollapsed && 'min-w-12 transition-all duration-300 ease-in-out',
      )}
    >
      <div className="w-full h-12 shrink-0 border-b border-b-input">
        <SidebarOrganization />
      </div>
      <ScrollArea className="h-full">
        <SidebarNavigation />
      </ScrollArea>
    </ResizablePanel>
  );
}

function SidebarOrganization() {
  return <></>;
}

function SidebarNavigation() {
  return <></>;
}

function Topbar() {
  return (
    <nav className="flex justify-between px-2.5 items-center w-full bg-background border-b border-b-input h-12 sticky top-0">
      <div></div>
      <DisplayUser />
    </nav>
  );
}

function DisplayUser() {
  const { isLoading, isError, data } = trpc.employee.findMe.useQuery();

  return (
    <div className="flex items-center gap-2">
      {isLoading ? (
        <Skeleton className="h-3 w-20" />
      ) : isError ? (
        <span className="text-xs text-destructive">{data?.error?.message}</span>
      ) : (
        <span className="text-xs">{data?.employee?.fullName}</span>
      )}
      <Avatar className="h-8 w-8 text-xs border border-input">
        <AvatarImage />
        <AvatarFallback className="text-muted-foreground">
          {data?.employee?.fullName &&
            getNameShorthand(data?.employee?.fullName)}
        </AvatarFallback>
      </Avatar>
    </div>
  );
}
