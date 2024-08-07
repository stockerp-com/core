import { decode, JsonWebTokenError, sign, verify } from 'jsonwebtoken';
import { Session } from '../context.js';
import { env } from '../env.js';
import { TRPCError } from '@trpc/server';
import logger from '@retailify/logger';

// Interface for the JWT payload
interface JwtPayload {
  sub: string; // Admin ID
}

// Converts the JWT payload to a session object
const payloadToSession = (payload: JwtPayload): Session => {
  return {
    id: parseInt(payload.sub),
  };
};

// Signs a JWT token using the provided session
export const signJwt = (session: Session) => {
  const payload: JwtPayload = {
    sub: session.id.toString(),
  };

  return sign(payload, env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

// Decodes a JWT token and returns the corresponding session
export const decodeJwt = (token: string): Session => {
  try {
    const payload = decode(token) as JwtPayload | null;
    if (!payload) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid token',
      });
    }

    return payloadToSession(payload);
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid token',
      });
    } else {
      logger.error('An error occurred while decoding the token', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An error occurred while decoding the token',
      });
    }
  }
};

// Verifies a JWT token and returns the corresponding session
export const verifyJwt = (token: string): Session => {
  try {
    const payload = verify(token, env.JWT_SECRET) as JwtPayload;

    return payloadToSession(payload);
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid token',
      });
    } else {
      logger.error('An error occurred while verifying the token', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An error occurred while verifying the token',
      });
    }
  }
};
