import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@retailify/ui/components/ui/resizable';
import { ScrollArea } from '@retailify/ui/components/ui/scroll-area';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';

export const Route = createFileRoute('/_app')({
  component: AppComponent,
  beforeLoad: async ({ location }) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth.verify`, {
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
