import { createContext, ReactNode, useState } from 'react';

export interface AuthContext {
  accessToken: string | null;
  setAccessToken: (accessToken: string | null) => void;
}

export const AuthContext = createContext<AuthContext | null>(null);

export function AuthProvider(props: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken }}>
      {props.children}
    </AuthContext.Provider>
  );
}
