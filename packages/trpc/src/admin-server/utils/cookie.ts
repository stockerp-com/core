import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { env } from '../env.js';

const COOKIE_NAME = 'token';

export const setSessionCookie = (
  res: CreateExpressContextOptions['res'],
  token: string,
) => {
  res.cookie(COOKIE_NAME, `Bearer ${token}`, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60, // 1 hour
  });
};

export const getSessionCookie = (req: CreateExpressContextOptions['req']) => {
  const cookie = req.cookies[COOKIE_NAME];

  return cookie ? String(cookie).replace(/^Bearer /, '') : null;
};

export const clearSessionCookie = (res: CreateExpressContextOptions['res']) => {
  res.clearCookie(COOKIE_NAME);
};
