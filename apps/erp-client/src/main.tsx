import React from 'react';
import ReactDOM from 'react-dom/client';
import { createRouter } from './router';
import '@retailify/ui/globals.css';
import './utils/i18n';
import { RouterProvider } from '@tanstack/react-router';

const router = createRouter();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
