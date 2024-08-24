import { PrismaManager } from '@retailify/db';
import { Redis } from '@retailify/redis';
import { TRPCError } from '@trpc/server';
import { type TFunction } from 'i18next';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { EmployeeSession } from '../types/erp/auth/session.js';
import { getRTCookie, rmRTCookie, setRTCookie } from './utils/cookie.js';

interface CreateContextInnerOpts {
  session: EmployeeSession | null;
  prismaManager: PrismaManager;
  redis: Redis;
  t: TFunction;
  // eslint-disable-next-line no-unused-vars
  setRTCookie: (token: string) => void;
  getRTCookie: () => string | null;
  rmRTCookie: () => void;
  getAT: () => string | null;
}

export const createContextInner = (opts?: CreateContextInnerOpts) => ({
  session: opts?.session,
  setRTCookie: opts?.setRTCookie,
  getRTCookie: opts?.getRTCookie,
  rmRTCookie: opts?.rmRTCookie,
  getAT: opts?.getAT,
  redis: opts?.redis,
  prismaManager: opts?.prismaManager,
  t: opts?.t,
});

interface CreateContextOpts {
  expressContextOpts: {
    req: CreateExpressContextOptions['req'] & {
      t: TFunction;
    };
    res: CreateExpressContextOptions['res'];
  };
  prismaManager: PrismaManager;
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
    redis: opts?.redis,
    setRTCookie: (token: string) => setRTCookie(res, token),
    getRTCookie: () => getRTCookie(req),
    rmRTCookie: () => rmRTCookie(res),
    getAT: () => req.headers.authorization?.replace(/^Bearer /, '') ?? null,
    t: req.t,
    prismaManager: opts?.prismaManager,
  });
};

export type Context = Awaited<ReturnType<typeof createContext>>;
