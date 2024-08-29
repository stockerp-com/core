import { EmployeeSession } from '@retailify/constants';
import { jwtDecode } from 'jwt-decode';
import { wsClient } from '../router';

type AuthState = {
  accessToken: string | null;
  session: EmployeeSession | null;
};

class AuthStore {
  private state: AuthState = {
    accessToken: null,
    session: null,
  };

  private listeners: (() => void)[] = [];

  getState(): AuthState {
    return this.state;
  }

  getAuthToken() {
    return this.state.accessToken ? `Bearer ${this.state.accessToken}` : '';
  }

  setState(accessToken: string | null) {
    const session = accessToken
      ? (jwtDecode(accessToken) as EmployeeSession)
      : null;

    this.state = { accessToken, session };
    this.listeners?.forEach((listener) => listener());
  }

  async refreshTokens() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth.refreshTokens`,
        {
          credentials: 'include',
        },
      );

      if (response.status === 401) return null;

      const data = await response.json();

      const accessToken = data?.result?.data?.json
        ?.accessToken as unknown as string;

      this.setState(accessToken);
      wsClient.reconnect();

      return accessToken;
    } catch (error) {
      console.error('An error occurred while refreshing tokens:', error);
      return null;
    }
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }
}

export const authStore = new AuthStore();
