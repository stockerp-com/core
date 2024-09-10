import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './utils/i18n';
import { createRouter } from './router';
import { RouterProvider } from '@tanstack/react-router';

/**
 * Creates and renders the main application.
 *
 * This function initializes the router, creates the root element,
 * and renders the application wrapped in StrictMode and RouterProvider.
 *
 * @throws {Error} If the root element is not found in the DOM.
 */
function initializeApp() {
  // Create the router instance
  const router = createRouter();

  // Get the root element
  const rootElement = document.getElementById('root');

  // Ensure the root element exists
  if (!rootElement) {
    throw new Error('Root element not found');
  }

  // Create the root and render the app
  createRoot(rootElement).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  );
}

// Initialize the application
initializeApp();
