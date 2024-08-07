import superjson from 'superjson';
import { initTRPC } from '@trpc/server';
import { Context } from './context.js';

export const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const procedure = t.procedure;
