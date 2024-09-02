import { createContext, ReactNode, useEffect, useState } from 'react';
import { authStore } from '../utils/auth-store';
import { EmployeeSession } from '@core/constants/employee';

export interface AuthContext {
  accessToken: string | null;
  session: EmployeeSession | null;
  setAuth: (accessToken: string | null) => void;
}

export const AuthContext = createContext<AuthContext | null>(null);

export function AuthProvider(props: { children: ReactNode }) {
  const [state, setState] = useState(authStore.getState());

  useEffect(() => {
    return authStore.subscribe(() => {
      setState(authStore.getState());
    });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, setAuth: authStore.setState }}>
      {props.children}
    </AuthContext.Provider>
  );
}
