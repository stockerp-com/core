import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@retailify/trpc/admin-server/routers/app.router';

export const trpc = createTRPCReact<AppRouter>();
