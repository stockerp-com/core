import { CreateExpressContextOptions } from '@trpc/server/adapters/express';

export interface Session {
  sub: string;
}

export const createContextInner = (opts?: {
  session: Session | null;
  setSessionCookie?: (jwt: string) => void;
}) => ({
  session: opts?.session,
  setSessionCookie: opts?.setSessionCookie,
});

export const createContext = (opts?: CreateExpressContextOptions) => {
  const session = null;

  return createContextInner({
    session,
    setSessionCookie: (jwt) => {},
  });
};

export type Context = Awaited<ReturnType<typeof createContext>>;
