import { Db } from '@retailify/db';
import { Redis } from '@retailify/redis';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import {
  clearSessionCookie,
  getSession,
  getSessionCookie,
  setSessionCookie,
} from './utils/cookie.js';
import { TRPCError } from '@trpc/server';
import { type TFunction } from 'i18next';
import { S3 } from '@retailify/s3';

export interface Session {
  id: number;
}

interface CreateContextInnerOpts {
  session: Session | null;
  db: Db;
  redis: Redis;
  s3: S3;
  t: TFunction;
  // eslint-disable-next-line no-unused-vars
  setSessionCookie: (token: string) => void;
  getSessionCookie: () => string | null;
  clearSessionCookie: () => void;
}

export const createContextInner = (opts?: CreateContextInnerOpts) => ({
  session: opts?.session,
  setSessionCookie: opts?.setSessionCookie,
  getSessionCookie: opts?.getSessionCookie,
  clearSessionCookie: opts?.clearSessionCookie,
  db: opts?.db,
  redis: opts?.redis,
  t: opts?.t,
  s3: opts?.s3,
});

interface CreateContextOpts {
  expressContextOpts: {
    req: CreateExpressContextOptions['req'] & {
      t: TFunction;
    };
    res: CreateExpressContextOptions['res'];
  };
  db: Db;
  redis: Redis;
  s3: S3;
}

export const createContext = (opts?: CreateContextOpts) => {
  if (!opts?.expressContextOpts) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Missing express context',
    });
  }

  const { req, res } = opts.expressContextOpts;

  const session = getSession(req);

  return createContextInner({
    session,
    db: opts?.db,
    redis: opts?.redis,
    s3: opts?.s3,
    setSessionCookie: (token: string) => setSessionCookie(res, token),
    getSessionCookie: () => getSessionCookie(req),
    clearSessionCookie: () => clearSessionCookie(res),
    t: req.t,
  });
};

export type Context = Awaited<ReturnType<typeof createContext>>;
