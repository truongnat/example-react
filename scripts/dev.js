#!/usr/bin/env node

import { existsSync } from 'fs';
import { colors, log, runConcurrent, getProjectPaths, handleHelp } from './utils.js';
import { getPackageManagerConfig } from './config.js';
import { loadUnifiedEnv, validateEnvironment, displayEnvironmentSummary } from './env-loader.js';

/**
 * Cross-platform development script
 * Starts both client and server in development mode concurrently
 */



async function startDevelopment() {
  try {
    log(`${colors.bright}🚀 Starting development environment...${colors.reset}`, colors.green);

    // Load and validate unified environment configuration
    const envResult = loadUnifiedEnv({ verbose: true, validate: true, required: ['NODE_ENV', 'PORT'] });

    if (envResult.errors.length > 0) {
      log('❌ Environment configuration errors:', colors.red);
      envResult.errors.forEach(error => log(`   ${error}`, colors.red));
      process.exit(1);
    }

    // Validate environment for development
    const clientValidation = validateEnvironment('client');
    const serverValidation = validateEnvironment('server');

    if (!clientValidation.isValid || !serverValidation.isValid) {
      log('❌ Environment validation failed:', colors.red);
      if (!clientValidation.isValid) {
        log(`   Client missing: ${clientValidation.missing.join(', ')}`, colors.red);
      }
      if (!serverValidation.isValid) {
        log(`   Server missing: ${serverValidation.missing.join(', ')}`, colors.red);
      }
      process.exit(1);
    }

    // Show warnings
    const allWarnings = [...clientValidation.warnings, ...serverValidation.warnings];
    if (allWarnings.length > 0) {
      log('⚠️ Environment warnings:', colors.yellow);
      allWarnings.forEach(warning => log(`   ${warning}`, colors.yellow));
      log('');
    }

    // Display environment summary
    displayEnvironmentSummary(false);

    const paths = getProjectPaths();
    const pmConfig = getPackageManagerConfig();
    const commands = [];

    log(`📦 Using package manager: ${pmConfig.command}`, colors.cyan);

    // Check and add client dev command
    if (existsSync(paths.client)) {
      commands.push({
        command: pmConfig.command,
        args: pmConfig.devArgs,
        cwd: paths.client,
        name: 'Client'
      });
    } else {
      log(`${colors.yellow}⚠️  Client directory not found, skipping client dev server...${colors.reset}`, colors.yellow);
    }

    // Check and add server dev command
    if (existsSync(paths.server)) {
      commands.push({
        command: pmConfig.command,
        args: pmConfig.devArgs,
        cwd: paths.server,
        name: 'Server'
      });
    } else {
      log(`${colors.yellow}⚠️  Server directory not found, skipping server dev...${colors.reset}`, colors.yellow);
    }

    if (commands.length === 0) {
      log(`${colors.red}❌ No development servers to start${colors.reset}`, colors.red);
      process.exit(1);
    }

    log(`${colors.bright}🔄 Running ${commands.length} development server(s) concurrently...${colors.reset}`, colors.blue);
    
    // building both client and server for ssr if enabled
    if (envResult.variables.IS_SSR === 'true') {
      log(`${colors.bright}🔄 Building client and server for SSR...${colors.reset}`, colors.blue);
      // change run concurent
        commands.unshift({
          command: 'node',
          args: ['scripts/build.js'],
          cwd: paths.root,
          name: 'Build'
        });
    }

    await runConcurrent(commands);

  } catch (error) {
    log(`${colors.bright}❌ Development startup failed: ${error.message}${colors.reset}`, colors.red);
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
handleHelp(args, 'Development Script', 'This script starts both client and server in development mode concurrently.');

// Run the development environment
startDevelopment();
