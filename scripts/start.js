#!/usr/bin/env node

import { colors, log, runCommand, getProjectPaths, directoryExists, handleHelp } from './utils.js';
import { getScriptHelp, getPackageManagerConfig } from './config.js';

/**
 * Cross-platform production start script
 * Starts the production server
 */

async function startProduction() {
  try {
    log(`${colors.bright}🚀 Starting production server...${colors.reset}`, colors.green);

    // Get project paths and package manager config
    const paths = getProjectPaths();
    const pkgManager = getPackageManagerConfig();

    // Check if server build exists
    const serverDistPath = `${paths.server}/dist`;

    if (!directoryExists(paths.server)) {
      log(`${colors.red}❌ Server directory not found: ${paths.server}${colors.reset}`, colors.red);
      process.exit(1);
    }

    if (!directoryExists(serverDistPath)) {
      log(`${colors.red}❌ Server build not found. Please run build first.${colors.reset}`, colors.red);
      log(`${colors.yellow}💡 Run: node scripts/build.js${colors.reset}`, colors.yellow);
      process.exit(1);
    }

    // Check if client build exists (optional warning)
    const clientDistPath = `${paths.client}/dist`;

    if (directoryExists(paths.client) && !directoryExists(clientDistPath)) {
      log(`${colors.yellow}⚠️  Client build not found. The server will run but client assets may not be available.${colors.reset}`, colors.yellow);
      log(`${colors.yellow}💡 Run: node scripts/build.js${colors.reset}`, colors.yellow);
    }

    log(`${colors.bright}🌟 Starting production server...${colors.reset}`, colors.blue);

    // Start the production server
    await runCommand(pkgManager.command, pkgManager.startArgs, paths.server);

  } catch (error) {
    log(`${colors.bright}❌ Production server failed to start: ${error.message}${colors.reset}`, colors.red);
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const helpInfo = getScriptHelp().start;

// Handle help flag
handleHelp(args, helpInfo.name, helpInfo.description);

// Run the production server
startProduction();
