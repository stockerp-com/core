import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/_settings/settings/organizations')({
  component: () => <div>Hello /_app/_settings/settings/organizations!</div>,
});
