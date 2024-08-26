import { AnimatedGridPattern } from '@retailify/ui/components/backgrounds/animated-grid-pattern';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { useGetTheme } from '../hooks/use-get-theme';

export const Route = createFileRoute('/_auth')({
  component: AuthComponent,
});

function AuthComponent() {
  const { getActualTheme } = useGetTheme();

  return (
    <div className="h-[100dvh] w-[100dvw] grid grid-cols-1 lg:grid-cols-2">
      <div className="flex bg-paper items-center justify-center w-full lg:border-r lg:border-input">
        <main className="w-full flex flex-col container max-w-screen-sm">
          <Outlet />
        </main>
      </div>
      <div className="w-full h-full hidden lg:flex flex-col gap-2 items-center justify-center relative">
        <div className="flex items-center gap-4 absolute z-10">
          <img
            src={
              getActualTheme() === 'light'
                ? '/icon-white.svg'
                : '/icon-black.svg'
            }
            className="w-16 h-16 drop-shadow-sm"
          />
          <h1 className="text-6xl z-10 font-medium drop-shadow-sm">
            Retailify
          </h1>
        </div>
        <AnimatedGridPattern
          numSquares={30}
          maxOpacity={0.1}
          duration={3}
          repeatDelay={1}
          className="[mask-image:radial-gradient(15rem_circle_at_center,white,transparent)] h-[90%] w-[90%] skew-y-6"
        />
      </div>
    </div>
  );
}
