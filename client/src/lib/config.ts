// Get dynamic server port from environment
const getServerPort = () => import.meta.env.VITE_SERVER_PORT || '8080';
const getClientPort = () => import.meta.env.VITE_CLIENT_PORT || '5173';

// Build dynamic URLs
const buildApiUrl = () => {
  if (import.meta.env.PROD) {
    return '/api'; // Relative URL for production SSR
  }
  return `http://localhost:${getServerPort()}/api`;
};

const buildSocketUrl = () => {
  if (import.meta.env.PROD) {
    return typeof window !== 'undefined' ? window.location.origin : '';
  }
  return `http://localhost:${getServerPort()}`;
};

export const config = {
  // Port Configuration
  serverPort: getServerPort(),
  clientPort: getClientPort(),

  // API Configuration - Dynamic based on environment
  apiBaseUrl: buildApiUrl(),

  // Socket.IO URL - Dynamic based on environment
  socketUrl: buildSocketUrl(),

  // App Configuration
  appName: import.meta.env.VITE_APP_NAME || 'Todo App',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',

  // Environment flags
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
} as const

export type Config = typeof config
