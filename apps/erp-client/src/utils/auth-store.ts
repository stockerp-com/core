import { EmployeeSession } from '@retailify/trpc/types/erp/auth/session.d';

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

  setState(newState: Partial<AuthState>) {
    this.state = { ...this.state, ...newState };
    this.listeners.forEach((listener) => listener());
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }
}

export const authStore = new AuthStore();
