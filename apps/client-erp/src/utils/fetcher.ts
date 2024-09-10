import { authStore } from './auth-store';

/**
 * Custom fetch function with authentication and token refresh handling
 * @param {RequestInfo | URL} url - The URL to fetch
 * @param {RequestInit | undefined} options - Fetch options
 * @returns {Promise<Response | undefined>} The fetch response or undefined if an error occurs
 */
export async function fetcher(
  url: RequestInfo | URL,
  options: RequestInit | undefined,
): Promise<Response | undefined> {
  const accessToken = authStore.getState().accessToken;

  try {
    // Initial fetch attempt with current access token
    const response = await performFetch(url, options, accessToken);

    if (response.status === 500) {
      console.error(await response.json());
    }

    if (response.status === 401) {
      // Token expired, attempt to refresh
      const newAccessToken = await authStore.refreshTokens();
      if (!newAccessToken) {
        // Refresh failed, redirect to sign-in
        window.location.href = '/sign-in';
        return response;
      }

      // Retry fetch with new access token
      return await performFetch(url, options, newAccessToken);
    }

    return response;
  } catch (error) {
    console.error('An error occurred in fetcher.ts:', error);
    return undefined;
  }
}

/**
 * Helper function to perform the actual fetch operation
 * @param {RequestInfo | URL} url - The URL to fetch
 * @param {RequestInit | undefined} options - Fetch options
 * @param {string | null} accessToken - The access token to use
 * @returns {Promise<Response>} The fetch response
 */
async function performFetch(
  url: RequestInfo | URL,
  options: RequestInit | undefined,
  accessToken: string | null,
): Promise<Response> {
  return fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      ...options?.headers,
      authorization: accessToken ? `Bearer ${accessToken}` : '',
    },
  });
}
