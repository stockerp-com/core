import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/log-in')({
  component: () => <div>Hello /_auth/log-in!</div>,
});
