import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@retailify/ui/components/ui/resizable';
import { ScrollArea } from '@retailify/ui/components/ui/scroll-area';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import { authStore } from '../utils/auth-store';
import { refreshTokens } from '../utils/refresh-tokens';
import { jwtDecode } from 'jwt-decode';
import { EmployeeSession } from '@retailify/trpc/types/erp/auth/session.d';

export const Route = createFileRoute('/_app')({
  component: AppComponent,
  beforeLoad: async () => {
    const { session } = authStore.getState();
    if (!session?.id) {
      const newAccessToken = await refreshTokens(import.meta.env.VITE_API_URL);
      if (!newAccessToken) {
        throw redirect({
          to: '/sign-in',
          search: {
            redirect: location.href,
          },
        });
      }

      authStore.setState({
        accessToken: newAccessToken,
        session: jwtDecode(newAccessToken) as unknown as EmployeeSession,
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
