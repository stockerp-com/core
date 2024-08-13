import { createFileRoute, Outlet } from '@tanstack/react-router';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@retailify/ui/components/ui/resizable';
import { cn } from '@retailify/ui/lib/utils';
import { ScrollArea } from '@retailify/ui/components/ui/scroll-area';
import { useState } from 'react';

export const Route = createFileRoute('/_app')({
  component: AppComponent,
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
    <nav className="flex items-center w-full bg-background border-b border-b-input h-12 sticky top-0"></nav>
  );
}
