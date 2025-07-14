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
