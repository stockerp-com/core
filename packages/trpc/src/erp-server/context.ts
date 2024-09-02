import { AWS } from '@core/aws';
import { type EmployeeSession } from '@core/constants/employee';
import { type PrismaManager } from '@core/db';
import { type Redis } from '@core/redis';
import { TRPCError } from '@trpc/server';
import { type CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { type TFunction } from 'i18next';
import { getRTCookie, rmRTCookie, setRTCookie } from './utils/cookie.js';

interface CreateContextInnerOpts {
  session: EmployeeSession | null;
  prismaManager: PrismaManager;
  redis: Redis;
  aws: AWS;
  t: TFunction;
  // eslint-disable-next-line no-unused-vars
  setRTCookie?: (token: string) => void;
  getRTCookie?: () => string | null;
  rmRTCookie?: () => void;
  getAT?: () => string | null;
}

export const createContextInner = (opts?: CreateContextInnerOpts) => ({
  session: opts?.session,
  setRTCookie: opts?.setRTCookie,
  getRTCookie: opts?.getRTCookie,
  rmRTCookie: opts?.rmRTCookie,
  getAT: opts?.getAT,
  redis: opts?.redis,
  prismaManager: opts?.prismaManager,
  aws: opts?.aws,
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
  aws: AWS;
}

export const createContext = async (opts?: CreateContextOpts) => {
  if (!opts?.expressContextOpts) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Missing express context',
    });
  }

  const { req, res } = opts.expressContextOpts;

  return createContextInner({
    session: null,
    redis: opts?.redis,
    setRTCookie: (token: string) => setRTCookie(res, token),
    getRTCookie: () => getRTCookie(req),
    rmRTCookie: () => rmRTCookie(res),
    getAT: () => req.headers.authorization?.replace(/^Bearer /, '') ?? null,
    t: req.t,
    prismaManager: opts?.prismaManager,
    aws: opts?.aws,
  });
};

export type Context = Awaited<ReturnType<typeof createContext>>;
