import { EmployeeSession } from '@core/utils/employee';
import { jwtDecode } from 'jwt-decode';

/** Represents the authentication state */
type AuthState = {
  accessToken: string | null;
  session: EmployeeSession | null;
};

/**
 * AuthStore class for managing authentication state
 */
class AuthStore {
  private state: AuthState = {
    accessToken: null,
    session: null,
  };

  private listeners: (() => void)[] = [];

  /**
   * Get the current authentication state
   * @returns {AuthState} The current auth state
   */
  getState(): AuthState {
    return this.state;
  }

  /**
   * Get the authentication token with 'Bearer' prefix
   * @returns {string} The auth token or an empty string if not available
   */
  getAuthToken(): string {
    return this.state.accessToken ? `Bearer ${this.state.accessToken}` : '';
  }

  /**
   * Set the authentication state
   * @param {string | null} accessToken - The new access token
   */
  setState(accessToken: string | null): void {
    const session = accessToken
      ? (jwtDecode(accessToken) as EmployeeSession)
      : null;

    this.state = { accessToken, session };
    this.notifyListeners();
  }

  /**
   * Refresh the authentication tokens
   * @returns {Promise<string | null>} The new access token or null if refresh failed
   */
  async refreshTokens(): Promise<string | null> {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/erp/trpc/auth.refreshTokens`,
        { credentials: 'include' },
      );

      if (response.status === 401) return null;

      const data = await response.json();
      const accessToken = data?.result?.data?.json?.accessToken as
        | string
        | undefined;

      if (accessToken) {
        this.setState(accessToken);
        // TODO: Uncomment the following line when wsClient is implemented
        // wsClient.reconnect();
        return accessToken;
      }

      return null;
    } catch (error) {
      console.error('An error occurred while refreshing tokens:', error);
      return null;
    }
  }

  /**
   * Subscribe to state changes
   * @param {() => void} listener - The listener function to be called on state changes
   * @returns {() => void} A function to unsubscribe the listener
   */
  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  /**
   * Notify all listeners of state changes
   */
  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener());
  }
}

// Create and export a singleton instance of AuthStore
export const authStore = new AuthStore();
