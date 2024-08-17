import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppProvider } from './AppProvider';
import '@retailify/ui/globals.css';
import './utils/i18n';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider />
  </React.StrictMode>,
);
