import { authStore } from './auth-store';

export async function fetcher(
  url: RequestInfo | URL,
  options: RequestInit | undefined,
) {
  const accessToken = authStore.getState().accessToken;

  try {
    const response = await fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        ...options?.headers,
        authorization: accessToken ? `Bearer ${accessToken}` : '',
      },
    });

    if (response.status === 500) {
      console.error(await response.json());
    }

    try {
      if (response.status === 401) {
        const newAccessToken = await authStore.refreshTokens();
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
  } catch (error) {
    console.error('An error occurred:', error);
  }
}
