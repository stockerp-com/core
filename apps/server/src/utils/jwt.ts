import env from './env.js';
import jwt from 'jsonwebtoken';

export const verifyToken = (token: string) => {
  const jwtSecret = env?.JWT_AT_SECRET as string;

  return jwt.verify(token, jwtSecret) as unknown;
};
