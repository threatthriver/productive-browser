import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { register } from './utils/registerServiceWorker';

// Create root element
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(rootElement);

// Render the app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register service worker for offline support in production
if (import.meta.env.PROD) {
  register();
}
