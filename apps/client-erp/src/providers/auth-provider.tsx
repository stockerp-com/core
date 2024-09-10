import { createContext, ReactNode, useEffect, useState } from 'react';
import { authStore } from '../utils/auth-store';
import { EmployeeSession } from '@core/utils/employee';

/**
 * Interface defining the shape of the authentication context
 */
export interface AuthContext {
  accessToken: string | null;
  session: EmployeeSession | null;
  setAuth: (accessToken: string | null) => void;
}

// Create the AuthContext with a default value of null
export const AuthContext = createContext<AuthContext | null>(null);

/**
 * Props for the AuthProvider component
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider component
 *
 * This component manages the authentication state and provides it to its children
 * through the AuthContext.
 *
 * @param {AuthProviderProps} props - The component props
 * @returns {JSX.Element} The provider component wrapping its children
 */
export function AuthProvider({ children }: AuthProviderProps) {
  // Initialize state with the current auth store state
  const [authState, setAuthState] = useState(authStore.getState());

  useEffect(() => {
    // Subscribe to auth store changes
    const unsubscribe = authStore.subscribe(() => {
      setAuthState(authStore.getState());
    });

    // Cleanup subscription on component unmount
    return unsubscribe;
  }, []);

  // Prepare the context value
  const contextValue: AuthContext = {
    ...authState,
    setAuth: authStore.setState,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
