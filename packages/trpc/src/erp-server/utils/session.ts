import { EmployeeSession } from '@retailify/constants';
import { Context } from '../context.js';
import { signTokens, verifyRT } from './jwt.js';

async function getValidRefreshTokens(redis: Context['redis'], id?: number) {
  if (!id) return null;

  const res = await redis?.get(`erp:${id}`);
  if (!res) return null;

  const tokens = JSON.parse(res) as unknown as string[];

  const validTokens = [];

  for (const token of tokens) {
    try {
      if (verifyRT(token)) {
        validTokens.push(token);
      }
    } catch {
      // invalid token
    }
  }

  return validTokens;
}

async function setValidRefreshTokens(
  redis: Context['redis'],
  id: number,
  tokens: string[],
) {
  await redis?.set(`erp:${id}`, JSON.stringify(tokens));
}

export async function generateSession(
  ctx: Context,
  sessionData: EmployeeSession,
  prevRt?: string,
) {
  const { accessToken, refreshToken } = signTokens({
    id: sessionData.id,
    currentOrganization: sessionData.currentOrganization,
  });

  const refreshTokens = [
    ...((await getValidRefreshTokens(ctx.redis, sessionData.id)) ?? []),
  ].filter((rt) => rt !== prevRt);
  refreshTokens.push(refreshToken);

  await setValidRefreshTokens(ctx.redis, sessionData.id, refreshTokens);

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
