import { Context, Session } from '../context.js';
import { signTokens, verifyRT } from './jwt.js';

async function getValidRefreshTokens(redis: Context['redis'], id?: number) {
  if (!id) return null;

  const res = await redis?.get(`admin:${id}`);
  if (!res) return null;

  return JSON.parse(res) as unknown as string[];
}

async function setValidRefreshTokens(
  redis: Context['redis'],
  id: number,
  tokens: string[],
) {
  await redis?.set(`admin:${id}`, JSON.stringify(tokens));
}

export async function generateSession(
  ctx: Context,
  sessionData: Session,
  prevRt?: string,
) {
  const { accessToken, refreshToken } = signTokens(sessionData);

  await setValidRefreshTokens(
    ctx.redis,
    sessionData.id,
    [
      ...((await getValidRefreshTokens(ctx.redis, sessionData.id)) ?? []),
      refreshToken,
    ].filter((rt) => rt !== prevRt),
  );

  ctx.setRTCookie?.(refreshToken);

  return { accessToken };
}

export async function removeCurrentSession(ctx: Context) {
  const rt = ctx.getRTCookie?.();
  if (!rt) return;

  const refreshTokens =
    (await getValidRefreshTokens(ctx.redis, ctx.session?.id)) ?? [];

  refreshTokens.splice(refreshTokens.indexOf(rt), 1);

  await setValidRefreshTokens(ctx.redis, ctx.session!.id, refreshTokens);
}

export async function removeSessionsForUser(ctx: Context, id: number) {
  await setValidRefreshTokens(ctx.redis, id, []);
}

export async function refreshSession(ctx: Context) {
  const rt = ctx.getRTCookie?.();
  if (!rt) return null;

  try {
    const session = verifyRT(rt);

    const refreshTokens =
      (await getValidRefreshTokens(ctx.redis, session.id)) ?? [];
    if (!refreshTokens.includes(rt)) return null;

    return generateSession(ctx, session, rt);
  } catch {
    return null;
  }
}
