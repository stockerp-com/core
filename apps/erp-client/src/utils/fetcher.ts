import { EmployeeSession } from '@retailify/trpc/types/erp/auth/session.d';
import { refreshTokens } from './refresh-tokens';
import { jwtDecode } from 'jwt-decode';

export async function fetcher(
  url: RequestInfo | URL,
  options: RequestInit | undefined,
  accessToken: string | null,
  setAccessToken: (accessToken: string) => void,
  setSession: (session: EmployeeSession | null) => void,
  apiBaseUrl: string,
) {
  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      ...options?.headers,
      authorization: accessToken ? `Bearer ${accessToken}` : '',
    },
  });

  try {
    if (response.status === 401) {
      const newAccessToken = await refreshTokens(apiBaseUrl);
      if (!newAccessToken) {
        window.location.href = '/sign-in';
        return response;
      }

      setAccessToken(newAccessToken);
      setSession(jwtDecode(newAccessToken) as unknown as EmployeeSession);

      return await fetch(url, {
        ...options,
        credentials: 'include',
        headers: {
          ...options?.headers,
          authorization: `Bearer ${newAccessToken}`,
        },
      });
    }

    return response;
  } catch (error) {
    console.error('An error occurred:', error);
    return response;
  }
}
