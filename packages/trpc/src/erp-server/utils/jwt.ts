import jwt from 'jsonwebtoken';
import { env } from '../env.js';
import { Session } from '../context.js';

export function signTokens(payload: Session) {
  return {
    accessToken: jwt.sign(payload, env.JWT_AT_SECRET, {
      expiresIn: '10m',
    }),
    refreshToken: jwt.sign(payload, env.JWT_RT_SECRET!, {
      expiresIn: '1d',
    }),
  };
}

export function verifyAT(token: string) {
  return jwt.verify(token, env.JWT_AT_SECRET!) as unknown as Session;
}

export function verifyRT(token: string) {
  return jwt.verify(token, env.JWT_RT_SECRET!) as unknown as Session;
}
