import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AppProviders } from './app/providers';
import { applyAppearance, readStoredAppearance } from './lib/appearance';

// Before the first paint, so the accent and font size don't flash their
// defaults while the session is being restored.
applyAppearance(readStoredAppearance());

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProviders>
        <App />
    </AppProviders>
  </React.StrictMode>
);
