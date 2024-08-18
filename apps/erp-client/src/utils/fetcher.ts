import { refreshTokens } from './refresh-tokens';

export async function fetcher(
  url: RequestInfo | URL,
  options: RequestInit | undefined,
  accessToken: string | null,
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
