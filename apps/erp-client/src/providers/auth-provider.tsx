import { EmployeeSession } from '@retailify/trpc/types/erp/auth/session.d';
import { createContext, ReactNode, useEffect, useState } from 'react';
import { authStore } from '../utils/auth-store';

export interface AuthContext {
  accessToken: string | null;
  setAccessToken: (accessToken: string | null) => void;
  session: EmployeeSession | null;
  setSession: (session: EmployeeSession | null) => void;
}

export const AuthContext = createContext<AuthContext | null>(null);

export function AuthProvider(props: { children: ReactNode }) {
  const [state, setState] = useState(authStore.getState());

  useEffect(() => {
    return authStore.subscribe(() => {
      setState(authStore.getState());
    });
  }, []);

  const setAccessToken = (accessToken: string | null) => {
    authStore.setState({ accessToken });
  };

  const setSession = (session: EmployeeSession | null) => {
    authStore.setState({ session });
  };

  return (
    <AuthContext.Provider value={{ ...state, setAccessToken, setSession }}>
      {props.children}
    </AuthContext.Provider>
  );
}
