import { CreateExpressContextOptions } from '@trpc/server/adapters/express';

const RT_COOKIE_NAME = 'erp:rt';

export function setRTCookie(
  res: CreateExpressContextOptions['res'],
  token: string,
) {
  res.cookie(RT_COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  });
}

export function getRTCookie(req: CreateExpressContextOptions['req']) {
  const cookie = req.cookies[RT_COOKIE_NAME];

  return cookie ? String(cookie).replace(/^Bearer /, '') : null;
}

export function rmRTCookie(res: CreateExpressContextOptions['res']) {
  res.clearCookie(RT_COOKIE_NAME);
}
