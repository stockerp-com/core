import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/sign-up')({
  component: SignUpComponent,
});

function SignUpComponent() {
  return <></>;
}
