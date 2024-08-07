import { Db } from '@retailify/db';
import { Redis } from '@retailify/redis';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import {
  clearSessionCookie,
  getSessionCookie,
  setSessionCookie,
} from './utils/cookie.js';
import { TRPCError } from '@trpc/server';

export interface Session {
  id: number;
}

interface CreateContextInnerOpts {
  session: Session | null;
  db?: Db;
  redis?: Redis;
  // eslint-disable-next-line no-unused-vars
  setSessionCookie: (token: string) => void;
  getSessionCookie: () => string | null;
  clearSessionCookie: () => void;
}

export const createContextInner = (opts?: CreateContextInnerOpts) => ({
  session: opts?.session,
  setSessionCookie: opts?.setSessionCookie,
  db: opts?.db,
  redis: opts?.redis,
});

interface CreateContextOpts {
  expressContextOpts: CreateExpressContextOptions;
  db: Db;
  redis: Redis;
}

export const createContext = (opts?: CreateContextOpts) => {
  if (!opts?.expressContextOpts) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Missing express context',
    });
  }

  const { req, res } = opts.expressContextOpts;

  const session = null;

  return createContextInner({
    session,
    db: opts?.db,
    redis: opts?.redis,
    setSessionCookie: (token: string) => setSessionCookie(res, token),
    getSessionCookie: () => getSessionCookie(req),
    clearSessionCookie: () => clearSessionCookie(res),
  });
};

export type Context = Awaited<ReturnType<typeof createContext>>;
