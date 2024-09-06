import { Button } from '@core/ui/components/ui/button';
import {
  createFileRoute,
  Link,
  Outlet,
  useLocation,
} from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { IconType } from 'react-icons';
import {
  PiBuildingOffice,
  PiFingerprintSimple,
  PiWrench,
} from 'react-icons/pi';
import { ValidRoutes } from '../../router';

export const Route = createFileRoute('/_app/_settings')({
  component: Component,
});

function Component() {
  return (
    <div className="flex h-full w-full justify-center">
      <div className="flex w-full h-full flex-col gap-8 max-w-screen-lg">
        <SettingsNavbar />
        <Outlet />
      </div>
    </div>
  );
}

type SettingsRoute = {
  text: string;
  icon: IconType;
  route: ValidRoutes;
};

const settingsRoutes: SettingsRoute[] = [
  {
    text: 'content:erp.settings.general.title',
    icon: PiWrench,
    route: '/settings/general',
  },
  {
    text: 'content:erp.settings.security.title',
    icon: PiFingerprintSimple,
    route: '/settings/security',
  },
  {
    text: 'content:erp.settings.organizations.title',
    icon: PiBuildingOffice,
    route: '/settings/organizations',
  },
];

function SettingsNavbar() {
  const { pathname } = useLocation();

  return (
    <div className="flex items-center gap-2">
      {settingsRoutes.map((route) => (
        <SettingsNavbarButton
          key={route.route}
          currentRoute={pathname as ValidRoutes}
          icon={route.icon}
          route={route.route}
          text={route.text}
        />
      ))}
    </div>
  );
}

function SettingsNavbarButton(
  props: SettingsRoute & { currentRoute: ValidRoutes },
) {
  const { t } = useTranslation();

  return (
    <Button
      variant={props.currentRoute === props.route ? 'default' : 'outline'}
      className="rounded-full flex items-center gap-2"
      size="sm"
      asChild
    >
      <Link to={props.route}>
        <props.icon className="h-4 w-4" />
        {t(props.text)}
      </Link>
    </Button>
  );
}
