import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth')({
  component: AuthComponent,
});

function AuthComponent() {
  return (
    <div className="h-[100dvh] w-[100dvw] grid grid-cols-1 lg:grid-cols-2">
      <div className="flex items-center justify-center w-full container lg:border-r lg:border-input">
        <main className="max-w-md w-full flex flex-col">
          <Outlet />
        </main>
      </div>
      <div className="w-full h-full hidden bg-muted lg:flex flex-col gap-2 items-center justify-center"></div>
    </div>
  );
}
