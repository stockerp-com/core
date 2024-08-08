import React from 'react';
import ReactDOM from 'react-dom/client';
import '@retailify/ui/globals.css';
import { AppProvider } from './AppProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider />
  </React.StrictMode>,
);
