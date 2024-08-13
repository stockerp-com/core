import logger from '@retailify/logger';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { verifyJwt } from './jwt.js';

const COOKIE_NAME = 'admin:token';

export const setSessionCookie = (
  res: CreateExpressContextOptions['res'],
  token: string,
) => {
  res.cookie(COOKIE_NAME, `Bearer ${token}`, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60, // 1 hour
  });
};

export const getSessionCookie = (req: CreateExpressContextOptions['req']) => {
  const cookie = req.cookies[COOKIE_NAME];

  return cookie ? String(cookie).replace(/^Bearer /, '') : null;
};

export const getSession = (req: CreateExpressContextOptions['req']) => {
  const token = getSessionCookie(req);
  if (!token) {
    return null;
  }

  try {
    return verifyJwt(token);
  } catch (error) {
    logger.error('Failed to verify session', error);
    return null;
  }
};

export const clearSessionCookie = (res: CreateExpressContextOptions['res']) => {
  res.clearCookie(COOKIE_NAME);
};
