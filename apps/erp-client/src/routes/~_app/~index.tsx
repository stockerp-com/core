import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/')({
  component: Component,
});

function Component() {
  return <></>;
}
