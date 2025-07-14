/**
 * Client Configuration
 *
 * This configuration uses environment variables from the unified root .env file.
 * All client-side variables must be prefixed with VITE_ to be available in the browser.
 */

// Get environment variables with fallbacks
const getServerPort = () => import.meta.env.VITE_SERVER_PORT || '3000';
const getClientPort = () => import.meta.env.VITE_CLIENT_PORT || '5173';

// Build dynamic URLs based on environment
const buildApiUrl = () => {
  // In production with SSR, use relative URLs
  if (import.meta.env.PROD) {
    return '/api';
  }

  // In development, use the configured API base URL or construct from server port
  return import.meta.env.VITE_API_BASE_URL || `http://localhost:${getServerPort()}/api`;
};

const buildSocketUrl = () => {
  // In production with SSR, use current origin
  if (import.meta.env.PROD) {
    return typeof window !== 'undefined' ? window.location.origin : '';
  }

  // In development, use the configured WebSocket URL or construct from server port
  return import.meta.env.VITE_WS_URL || `http://localhost:${getServerPort()}`;
};

// Feature flags from environment
const getFeatureFlags = () => ({
  enableChat: import.meta.env.VITE_ENABLE_CHAT === 'true',
  enableNotifications: import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true',
  enableDarkMode: import.meta.env.VITE_ENABLE_DARK_MODE === 'true',
});

export const config = {
  // Port Configuration
  serverPort: getServerPort(),
  clientPort: getClientPort(),

  // API Configuration - Dynamic based on environment
  apiBaseUrl: buildApiUrl(),

  // Socket.IO URL - Dynamic based on environment
  socketUrl: buildSocketUrl(),

  // App Configuration
  appName: import.meta.env.VITE_APP_NAME || 'React Todo & Chat App 2025',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
  appDescription: import.meta.env.VITE_APP_DESCRIPTION || 'Modern MERN stack application with real-time features',

  // Feature Flags
  features: getFeatureFlags(),

  // Environment flags
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  mode: import.meta.env.MODE,

  // Debug information (only available in development)
  debug: {
    showTokenStatus: import.meta.env.DEV,
    enableVerboseLogging: import.meta.env.DEV,
    showPerformanceMetrics: import.meta.env.DEV,
  },
} as const;

export type Config = typeof config;

// Export individual feature flags for convenience
export const {
  enableChat,
  enableNotifications,
  enableDarkMode,
} = config.features;

// Validation function to check if all required environment variables are set
export const validateConfig = (): { isValid: boolean; missingVars: string[] } => {
  const requiredVars = [
    'VITE_SERVER_PORT',
    'VITE_CLIENT_PORT',
  ];

  const missingVars = requiredVars.filter(varName => {
    const value = import.meta.env[varName];
    return !value || value === '';
  });

  return {
    isValid: missingVars.length === 0,
    missingVars,
  };
};

// Log configuration in development
if (import.meta.env.DEV) {
  console.log('🔧 Client Configuration:', {
    apiBaseUrl: config.apiBaseUrl,
    socketUrl: config.socketUrl,
    appName: config.appName,
    features: config.features,
    environment: config.mode,
  });

  const validation = validateConfig();
  if (!validation.isValid) {
    console.warn('⚠️ Missing environment variables:', validation.missingVars);
  }
}
