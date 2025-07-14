/**
 * Unified Environment Variable Loader
 * 
 * This utility loads environment variables from the unified root .env file
 * and provides validation and debugging capabilities.
 */

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

/**
 * Load environment variables from unified root .env file
 * @param {Object} options - Configuration options
 * @param {boolean} options.verbose - Enable verbose logging
 * @param {boolean} options.validate - Validate required variables
 * @param {string[]} options.required - Required environment variables
 * @returns {Object} Loaded environment variables and metadata
 */
export function loadUnifiedEnv(options = {}) {
  const {
    verbose = false,
    validate = false,
    required = [],
  } = options;

  const rootEnvPath = '.env';
  const result = {
    loaded: false,
    variables: {},
    missing: [],
    errors: [],
  };

  if (verbose) {
    console.log('🔧 Loading unified environment configuration...');
  }

  if (!existsSync(rootEnvPath)) {
    const error = 'Root .env file not found. Please copy .env.example to .env';
    result.errors.push(error);
    
    if (verbose) {
      console.warn(`⚠️ ${error}`);
    }
    
    return result;
  }

  try {
    const envContent = readFileSync(rootEnvPath, 'utf8');
    const lines = envContent.split('\n');
    let loadedCount = 0;

    for (const line of lines) {
      const trimmed = line.trim();
      
      // Skip comments and empty lines
      if (!trimmed || trimmed.startsWith('#')) {
        continue;
      }

      // Parse key=value pairs
      const equalIndex = trimmed.indexOf('=');
      if (equalIndex === -1) {
        continue;
      }

      const key = trimmed.substring(0, equalIndex).trim();
      const value = trimmed.substring(equalIndex + 1).trim();

      if (key) {
        // Store in result
        result.variables[key] = value;
        
        // Set in process.env if not already defined (allows override)
        if (!process.env[key]) {
          process.env[key] = value;
          loadedCount++;
        }
      }
    }

    result.loaded = true;

    if (verbose) {
      console.log(`✅ Loaded ${loadedCount} environment variables`);
      
      // Show client vs server variables
      const clientVars = Object.keys(result.variables).filter(key => key.startsWith('VITE_'));
      const serverVars = Object.keys(result.variables).filter(key => !key.startsWith('VITE_'));
      
      console.log(`   📱 Client variables (VITE_*): ${clientVars.length}`);
      console.log(`   🔧 Server variables: ${serverVars.length}`);
    }

    // Validate required variables
    if (validate && required.length > 0) {
      result.missing = required.filter(varName => !process.env[varName]);
      
      if (result.missing.length > 0) {
        const error = `Missing required environment variables: ${result.missing.join(', ')}`;
        result.errors.push(error);
        
        if (verbose) {
          console.error(`❌ ${error}`);
        }
      } else if (verbose) {
        console.log(`✅ All ${required.length} required variables are set`);
      }
    }

  } catch (error) {
    const errorMsg = `Failed to load .env file: ${error.message}`;
    result.errors.push(errorMsg);
    
    if (verbose) {
      console.error(`❌ ${errorMsg}`);
    }
  }

  return result;
}

/**
 * Get environment-specific configuration
 * @returns {Object} Environment configuration
 */
export function getEnvironmentInfo() {
  const nodeEnv = process.env.NODE_ENV || 'development';
  
  return {
    nodeEnv,
    isDevelopment: nodeEnv === 'development',
    isProduction: nodeEnv === 'production',
    isTest: nodeEnv === 'test',
    isCI: !!process.env.CI,
    
    // Deployment platforms
    isVercel: !!process.env.VERCEL,
    isNetlify: !!process.env.NETLIFY,
    isHeroku: !!process.env.HEROKU,
    isRailway: !!process.env.RAILWAY,
    isDocker: !!process.env.DOCKER,
    
    // Application configuration
    port: parseInt(process.env.PORT || '3000'),
    enableSSR: process.env.IS_SSR === 'true',
    databaseType: process.env.DATABASE_TYPE || 'sqlite',
  };
}

/**
 * Validate environment configuration for specific contexts
 * @param {string} context - Context to validate ('client', 'server', 'build')
 * @returns {Object} Validation result
 */
export function validateEnvironment(context = 'server') {
  const required = {
    client: [
      'VITE_SERVER_PORT',
      'VITE_CLIENT_PORT',
    ],
    server: [
      'NODE_ENV',
      'PORT',
      'JWT_SECRET',
      'JWT_REFRESH_SECRET',
      'DATABASE_TYPE',
    ],
    build: [
      'NODE_ENV',
      'VITE_SERVER_PORT',
      'VITE_CLIENT_PORT',
    ],
  };

  const contextRequired = required[context] || [];
  const missing = contextRequired.filter(varName => !process.env[varName]);
  const warnings = [];

  // Check for common issues
  if (context === 'server') {
    if (process.env.JWT_SECRET === 'your-super-secret-jwt-key-change-this-in-production-2025') {
      warnings.push('JWT_SECRET is using default value - change this in production!');
    }
    
    if (process.env.JWT_REFRESH_SECRET === 'your-super-secret-refresh-key-change-this-in-production-2025') {
      warnings.push('JWT_REFRESH_SECRET is using default value - change this in production!');
    }
  }

  return {
    isValid: missing.length === 0,
    missing,
    warnings,
    context,
  };
}

/**
 * Display environment configuration summary
 * @param {boolean} showValues - Whether to show actual values (security risk)
 */
export function displayEnvironmentSummary(showValues = false) {
  const env = getEnvironmentInfo();
  
  console.log('\n📊 Environment Configuration Summary');
  console.log('=====================================');
  console.log(`Environment: ${env.nodeEnv}`);
  console.log(`Port: ${env.port}`);
  console.log(`SSR Enabled: ${env.enableSSR}`);
  console.log(`Database: ${env.databaseType}`);
  console.log(`CI Mode: ${env.isCI}`);
  
  if (env.isVercel) console.log('Platform: Vercel');
  if (env.isNetlify) console.log('Platform: Netlify');
  if (env.isHeroku) console.log('Platform: Heroku');
  if (env.isRailway) console.log('Platform: Railway');
  if (env.isDocker) console.log('Platform: Docker');
  
  // Show client variables
  const clientVars = Object.keys(process.env)
    .filter(key => key.startsWith('VITE_'))
    .sort();
    
  if (clientVars.length > 0) {
    console.log(`\n📱 Client Variables (${clientVars.length}):`);
    clientVars.forEach(key => {
      const value = showValues ? process.env[key] : '***';
      console.log(`   ${key}=${value}`);
    });
  }
  
  // Show important server variables
  const importantServerVars = [
    'NODE_ENV',
    'PORT',
    'DATABASE_TYPE',
    'IS_SSR',
    'CORS_ALLOW_ORIGINS',
  ];
  
  console.log(`\n🔧 Server Variables:`);
  importantServerVars.forEach(key => {
    if (process.env[key]) {
      const value = showValues ? process.env[key] : '***';
      console.log(`   ${key}=${value}`);
    }
  });
  
  console.log('=====================================\n');
}

/**
 * Auto-load environment variables when this module is imported
 */
loadUnifiedEnv({ verbose: false });

export default {
  loadUnifiedEnv,
  getEnvironmentInfo,
  validateEnvironment,
  displayEnvironmentSummary,
};
