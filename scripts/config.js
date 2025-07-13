#!/usr/bin/env node

/**
 * Shared configuration for all scripts
 * Centralizes common settings, paths, and configurations
 */

import { join } from 'path';
import { existsSync } from 'fs';
import { execSync } from 'child_process';

/**
 * Get project paths configuration
 * @returns {object} Object with all project paths
 */
export function getProjectConfig() {
  const root = process.cwd();
  return {
    root,
    client: join(root, 'client'),
    server: join(root, 'server-ts'),
    scripts: join(root, 'scripts')
  };
}

/**
 * Cleanup targets configuration
 * @returns {Array} Array of cleanup target objects
 */
export function getCleanupTargets() {
  const paths = getProjectConfig();
  
  return [
    // Node modules
    { path: join(paths.root, 'node_modules'), description: 'Root node_modules', type: 'directory' },
    { path: join(paths.client, 'node_modules'), description: 'Client node_modules', type: 'directory' },
    { path: join(paths.server, 'node_modules'), description: 'Server node_modules', type: 'directory' },
    
    // Lock files
    { path: join(paths.root, 'bun.lockb'), description: 'Root bun.lockb', type: 'file' },
    { path: join(paths.root, 'package-lock.json'), description: 'Root package-lock.json', type: 'file' },
    { path: join(paths.root, 'yarn.lock'), description: 'Root yarn.lock', type: 'file' },
    { path: join(paths.client, 'bun.lockb'), description: 'Client bun.lockb', type: 'file' },
    { path: join(paths.client, 'package-lock.json'), description: 'Client package-lock.json', type: 'file' },
    { path: join(paths.client, 'yarn.lock'), description: 'Client yarn.lock', type: 'file' },
    { path: join(paths.server, 'bun.lockb'), description: 'Server bun.lockb', type: 'file' },
    { path: join(paths.server, 'package-lock.json'), description: 'Server package-lock.json', type: 'file' },
    { path: join(paths.server, 'yarn.lock'), description: 'Server yarn.lock', type: 'file' },
    
    // Build directories
    { path: join(paths.client, 'dist'), description: 'Client dist', type: 'directory' },
    { path: join(paths.client, 'build'), description: 'Client build', type: 'directory' },
    { path: join(paths.server, 'dist'), description: 'Server dist', type: 'directory' },
    { path: join(paths.server, 'build'), description: 'Server build', type: 'directory' },
    
    // Cache directories
    { path: join(paths.root, '.cache'), description: 'Root cache', type: 'directory' },
    { path: join(paths.client, '.cache'), description: 'Client cache', type: 'directory' },
    { path: join(paths.server, '.cache'), description: 'Server cache', type: 'directory' },
    { path: join(paths.root, '.turbo'), description: 'Turbo cache', type: 'directory' },
    
    // Temporary files
    { path: join(paths.server, 'data'), description: 'Server data', type: 'directory' },
    { path: join(paths.root, 'logs'), description: 'Logs directory', type: 'directory' },
    
    // Coverage reports
    { path: join(paths.root, 'coverage'), description: 'Root coverage', type: 'directory' },
    { path: join(paths.client, 'coverage'), description: 'Client coverage', type: 'directory' },
    { path: join(paths.server, 'coverage'), description: 'Server coverage', type: 'directory' },
    
    // Test artifacts
    { path: join(paths.root, '.nyc_output'), description: 'NYC output', type: 'directory' },
    { path: join(paths.client, '.nyc_output'), description: 'Client NYC output', type: 'directory' },
    { path: join(paths.server, '.nyc_output'), description: 'Server NYC output', type: 'directory' }
  ];
}

/**
 * Deployment steps configuration
 * @returns {Array} Array of deployment step objects
 */
export function getDeploymentSteps() {
  return [
    { name: 'Build', script: 'build', description: 'Building application for production' },
    { name: 'Test', script: 'test', description: 'Running test suite' }
  ];
}

/**
 * Script help information
 * @returns {Object} Object with help information for each script
 */
export function getScriptHelp() {
  return {
    install: {
      name: 'Install Script',
      usage: 'node scripts/install.js',
      description: 'This script installs dependencies for all packages in the monorepo.'
    },
    dev: {
      name: 'Development Script',
      usage: 'node scripts/dev.js',
      description: 'This script starts both client and server in development mode concurrently.'
    },
    test: {
      name: 'Test Script',
      usage: 'node scripts/test.js [--watch] [--coverage]',
      description: 'This script runs tests for all packages in the monorepo.'
    },
    build: {
      name: 'Build Script',
      usage: 'node scripts/build.js',
      description: 'This script builds all packages in the monorepo for production.'
    },
    clean: {
      name: 'Clean Script',
      usage: 'node scripts/clean.js [--force]',
      description: 'This script removes build artifacts, dependencies, and temporary files.'
    },
    deploy: {
      name: 'Deployment Script',
      usage: 'node scripts/deploy.js',
      description: 'This script builds, tests, and prepares the application for deployment.'
    },
    start: {
      name: 'Production Start Script',
      usage: 'node scripts/start.js',
      description: 'This script starts the production server.'
    }
  };
}

/**
 * Package manager configuration
 * @returns {Object} Package manager settings
 */
export function getPackageManagerConfig() {
  // Check for package manager preference from environment or detect automatically
  const preferredPM = process.env.PACKAGE_MANAGER || detectPackageManagerSync();

  const configs = {
    bun: {
      command: 'bun',
      installArgs: ['install'],
      devArgs: ['run', 'dev'],
      buildArgs: ['run', 'build'],
      testArgs: ['run', 'test'],
      startArgs: ['run', 'start'],
      cleanArgs: ['pm', 'cache', 'rm']
    },
    pnpm: {
      command: 'pnpm',
      installArgs: ['install'],
      devArgs: ['run', 'dev'],
      buildArgs: ['run', 'build'],
      testArgs: ['run', 'test'],
      startArgs: ['run', 'start'],
      cleanArgs: ['store', 'prune']
    },
    npm: {
      command: 'npm',
      installArgs: ['install'],
      devArgs: ['run', 'dev'],
      buildArgs: ['run', 'build'],
      testArgs: ['run', 'test'],
      startArgs: ['run', 'start'],
      cleanArgs: ['cache', 'clean', '--force']
    },
    yarn: {
      command: 'yarn',
      installArgs: ['install'],
      devArgs: ['run', 'dev'],
      buildArgs: ['run', 'build'],
      testArgs: ['run', 'test'],
      startArgs: ['run', 'start'],
      cleanArgs: ['cache', 'clean']
    }
  };

  return configs[preferredPM] || configs.bun;
}

/**
 * Detect package manager based on lock files and availability (sync version)
 * @returns {string} Package manager name
 */
export function detectPackageManagerSync() {
  // Check for available package managers first (for Docker environments)
  const managers = ['bun', 'pnpm', 'yarn', 'npm'];
  for (const manager of managers) {
    try {
      execSync(`${manager} --version`, { stdio: 'ignore' });
      // If we found a working package manager, check if it matches lock files
      if (manager === 'pnpm' && (existsSync('pnpm-lock.yaml') || existsSync('client/pnpm-lock.yaml'))) {
        return 'pnpm';
      }
      if (manager === 'bun' && (existsSync('bun.lockb') || existsSync('client/bun.lockb'))) {
        return 'bun';
      }
      if (manager === 'yarn' && (existsSync('yarn.lock') || existsSync('client/yarn.lock'))) {
        return 'yarn';
      }
      if (manager === 'npm' && (existsSync('package-lock.json') || existsSync('client/package-lock.json'))) {
        return 'npm';
      }
      // If no lock file matches but manager is available, use it
      return manager;
    } catch {
      continue;
    }
  }

  return 'npm'; // fallback
}

/**
 * Detect package manager based on lock files and availability (async version)
 * @returns {Promise<string>} Package manager name
 */
export async function detectPackageManager() {
  const { existsSync } = await import('fs');
  const { execSync } = await import('child_process');

  // Check for lock files in order of preference
  if (existsSync('pnpm-lock.yaml') || existsSync('client/pnpm-lock.yaml')) {
    return 'pnpm';
  }
  if (existsSync('bun.lockb') || existsSync('client/bun.lockb')) {
    return 'bun';
  }
  if (existsSync('yarn.lock') || existsSync('client/yarn.lock')) {
    return 'yarn';
  }
  if (existsSync('package-lock.json') || existsSync('client/package-lock.json')) {
    return 'npm';
  }

  // Check for available package managers
  const managers = ['pnpm', 'bun', 'yarn', 'npm'];
  for (const manager of managers) {
    try {
      execSync(`${manager} --version`, { stdio: 'ignore' });
      return manager;
    } catch {
      continue;
    }
  }

  return 'npm'; // fallback
}

/**
 * Environment configuration with automatic detection
 * @returns {Object} Environment settings
 */
export function getEnvironmentConfig() {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const environment = detectEnvironment();

  return {
    // Basic environment info
    nodeEnv,
    environment,
    isCI: !!process.env.CI,
    isDevelopment: nodeEnv === 'development',
    isProduction: nodeEnv === 'production',
    isStaging: nodeEnv === 'staging',
    isTest: nodeEnv === 'test',

    // Platform info
    platform: process.platform,
    isWindows: process.platform === 'win32',
    isMac: process.platform === 'darwin',
    isLinux: process.platform === 'linux',

    // Runtime info
    nodeVersion: process.version,
    architecture: process.arch,

    // Environment-specific settings
    ...getEnvironmentSpecificConfig(environment)
  };
}

/**
 * Detect current environment based on various indicators
 * @returns {string} Environment name
 */
function detectEnvironment() {
  // Check explicit environment variable
  if (process.env.ENVIRONMENT) {
    return process.env.ENVIRONMENT.toLowerCase();
  }

  // Check NODE_ENV
  if (process.env.NODE_ENV) {
    return process.env.NODE_ENV.toLowerCase();
  }

  // Check CI indicators
  if (process.env.CI) {
    return 'ci';
  }

  // Check for common hosting platforms
  if (process.env.VERCEL) return 'vercel';
  if (process.env.NETLIFY) return 'netlify';
  if (process.env.HEROKU) return 'heroku';
  if (process.env.AWS_LAMBDA_FUNCTION_NAME) return 'aws-lambda';
  if (process.env.GOOGLE_CLOUD_PROJECT) return 'gcp';

  // Default to development
  return 'development';
}

/**
 * Get environment-specific configuration
 * @param {string} environment - Environment name
 * @returns {Object} Environment-specific settings
 */
function getEnvironmentSpecificConfig(environment) {
  const configs = {
    development: {
      logLevel: 'debug',
      enableCache: false,
      enableOptimizations: false,
      enableSourceMaps: true,
      enableHotReload: true,
      buildMode: 'development',
      compressionLevel: 0,
      enableProfiling: true,
      parallelBuilds: false,
      watchMode: true
    },

    staging: {
      logLevel: 'info',
      enableCache: true,
      enableOptimizations: true,
      enableSourceMaps: true,
      enableHotReload: false,
      buildMode: 'production',
      compressionLevel: 6,
      enableProfiling: false,
      parallelBuilds: true,
      watchMode: false
    },

    production: {
      logLevel: 'warn',
      enableCache: true,
      enableOptimizations: true,
      enableSourceMaps: false,
      enableHotReload: false,
      buildMode: 'production',
      compressionLevel: 9,
      enableProfiling: false,
      parallelBuilds: true,
      watchMode: false
    },

    test: {
      logLevel: 'error',
      enableCache: false,
      enableOptimizations: false,
      enableSourceMaps: true,
      enableHotReload: false,
      buildMode: 'test',
      compressionLevel: 0,
      enableProfiling: false,
      parallelBuilds: false,
      watchMode: false
    },

    ci: {
      logLevel: 'info',
      enableCache: true,
      enableOptimizations: true,
      enableSourceMaps: false,
      enableHotReload: false,
      buildMode: 'production',
      compressionLevel: 9,
      enableProfiling: false,
      parallelBuilds: true,
      watchMode: false
    }
  };

  return configs[environment] || configs.development;
}

/**
 * Get build configuration based on environment
 * @returns {Object} Build configuration
 */
export function getBuildConfig() {
  const env = getEnvironmentConfig();

  return {
    mode: env.buildMode,
    optimization: {
      minimize: env.enableOptimizations,
      splitChunks: env.enableOptimizations,
      treeShaking: env.enableOptimizations
    },
    devtool: env.enableSourceMaps ? 'source-map' : false,
    cache: env.enableCache,
    parallel: env.parallelBuilds,
    watch: env.watchMode,
    compression: {
      enabled: env.compressionLevel > 0,
      level: env.compressionLevel
    },
    profiling: env.enableProfiling
  };
}

/**
 * Get logging configuration based on environment
 * @returns {Object} Logging configuration
 */
export function getLoggingConfig() {
  const env = getEnvironmentConfig();

  return {
    level: env.logLevel,
    enableColors: !env.isCI,
    enableTimestamps: env.isProduction || env.isCI,
    enableStackTraces: env.isDevelopment || env.isTest,
    enablePerformanceMetrics: env.enableProfiling,
    outputFile: env.isProduction ? 'logs/scripts.log' : null
  };
}
