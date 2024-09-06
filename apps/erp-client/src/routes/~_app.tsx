import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@core/ui/components/ui/resizable';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import { authStore } from '../utils/auth-store';
import { ScrollArea } from '@core/ui/components/ui/scroll-area';

export const Route = createFileRoute('/_app')({
  component: AppComponent,
  beforeLoad: async () => {
    const { session } = authStore.getState();
    if (!session?.id) {
      const newAccessToken = await authStore.refreshTokens();
      if (!newAccessToken) {
        throw redirect({
          to: '/sign-in',
          search: {
            redirect: location.href,
          },
        });
      }
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
    <ResizablePanelGroup direction="horizontal">
      <Sidebar />
      <ResizableHandle withHandle className="hidden lg:flex bg-transparent" />
      <ResizablePanel minSize={50} className="flex h-full w-full">
        <div className="flex flex-1 flex-col h-full w-full">
          <Topbar />
          <ScrollArea className="flex h-full max-h-full">
            <div className="p-4 flex w-full h-full">{props.children}</div>
          </ScrollArea>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
