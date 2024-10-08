import { AWS } from '@core/aws';
import { type EmployeeSession } from '@core/utils/employee';
import { type PrismaManager } from '@core/db';
import { type Redis } from '@core/redis';
import { TRPCError } from '@trpc/server';
import { type CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { type TFunction } from 'i18next';
import { getRTCookie, rmRTCookie, setRTCookie } from './utils/cookie.js';

/**
 * Options for creating the inner context
 */
interface CreateContextInnerOpts {
  session: EmployeeSession | null;
  prismaManager: PrismaManager;
  redis: Redis;
  aws: AWS;
  t: TFunction;
  language: string;
  languages: string[];
  // eslint-disable-next-line no-unused-vars
  setRTCookie?: (token: string) => void;
  getRTCookie?: () => string | null;
  rmRTCookie?: () => void;
  getAT?: () => string | null;
}

/**
 * Creates the inner context with the provided options
 * @param opts - Options for creating the inner context
 * @returns The created inner context
 */
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
  language: opts?.language,
  languages: opts?.languages,
});

/**
 * Options for creating the context
 */
interface CreateContextOpts {
  expressContextOpts: {
    req: CreateExpressContextOptions['req'] & {
      t: TFunction;
      language: string;
      languages: string[];
    };
    res: CreateExpressContextOptions['res'];
  };
  prismaManager: PrismaManager;
  redis: Redis;
  aws: AWS;
}

/**
 * Creates the context for the tRPC server
 * @param opts - Options for creating the context
 * @returns The created context
 * @throws {TRPCError} If express context is missing
 */
export const createContext = async (opts?: CreateContextOpts) => {
  // Check if express context options are provided
  if (!opts?.expressContextOpts) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Missing express context',
    });
  }

  const { req, res } = opts.expressContextOpts;

  // Create and return the inner context with the provided options
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
    language: req.language,
    languages: req.languages,
  });
};

/**
 * Type definition for the context
 */
export type Context = Awaited<ReturnType<typeof createContext>>;
