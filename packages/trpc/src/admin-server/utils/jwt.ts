import jwt from 'jsonwebtoken';
import { Session } from '../context.js';
import { env } from '../env.js';
import { TRPCError } from '@trpc/server';

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

  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

// Decodes a JWT token and returns the corresponding session
export const decodeJwt = (token: string): Session => {
  try {
    const payload = jwt.decode(token) as JwtPayload | null;
    if (!payload) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid token',
      });
    }

    return payloadToSession(payload);
  } catch {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Invalid token',
    });
  }
};

// Verifies a JWT token and returns the corresponding session
export const verifyJwt = (token: string): Session => {
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    return payloadToSession(payload);
  } catch {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Invalid token',
    });
  }
};
