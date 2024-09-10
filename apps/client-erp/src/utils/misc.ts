/**
 * Miscellaneous utility functions for the ERP client application.
 */

/**
 * Extracts the generic locale from a specific locale string.
 * @param {string} locale - The full locale string (e.g., 'en-US', 'fr-FR')
 * @returns {string} The generic locale (e.g., 'en', 'fr')
 */
export function getGenericLocale(locale: string): string {
  // Split the locale string by '-' and return the first part
  return locale.split('-')[0];
}

/**
 * Generates a random hexadecimal ID using the Web Crypto API.
 * @returns {string} A random hexadecimal string
 */
export function generateRandomId(): string {
  // Use the Web Crypto API to generate a random 32-bit unsigned integer
  const uint32 = window.crypto.getRandomValues(new Uint32Array(1))[0];

  // Convert the integer to a hexadecimal string
  return uint32.toString(16);
}
