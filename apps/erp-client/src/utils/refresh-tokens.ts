export async function refreshTokens(apiBaseUrl: string) {
  try {
    const response = await fetch(`${apiBaseUrl}/auth.refreshTokens`, {
      credentials: 'include',
    });

    if (response.status === 401) return null;

    const data = await response.json();

    return data?.result?.data?.json?.accessToken as unknown as string;
  } catch (error) {
    console.error('An error occurred while refreshing tokens:', error);
    return null;
  }
}
