#!/usr/bin/env node

import { existsSync } from 'fs';
import { colors, log, runCommand, getProjectPaths, handleHelp } from './utils.js';
import { getPackageManagerConfig } from './config.js';

/**
 * Cross-platform install script
 * Installs dependencies for all packages in the monorepo
 */

async function installDependencies() {
  try {
    log(`${colors.bright}🚀 Starting installation process...${colors.reset}`, colors.green);

    const paths = getProjectPaths();
    const pmConfig = getPackageManagerConfig();

    log(`📦 Using package manager: ${pmConfig.command}`, colors.cyan);

    // Install client dependencies
    if (existsSync(paths.client)) {
      log(`${colors.bright}🎨 Installing client dependencies...${colors.reset}`, colors.blue);
      await runCommand(pmConfig.command, pmConfig.installArgs, paths.client);
    } else {
      log(`${colors.yellow}⚠️  Client directory not found, skipping...${colors.reset}`, colors.yellow);
    }

    // Install server dependencies
    if (existsSync(paths.server)) {
      log(`${colors.bright}⚙️  Installing server dependencies...${colors.reset}`, colors.blue);
      await runCommand(pmConfig.command, pmConfig.installArgs, paths.server);
    } else {
      log(`${colors.yellow}⚠️  Server directory not found, skipping...${colors.reset}`, colors.yellow);
    }

    log(`${colors.bright}✅ All dependencies installed successfully!${colors.reset}`, colors.green);

  } catch (error) {
    log(`${colors.bright}❌ Installation failed: ${error.message}${colors.reset}`, colors.red);
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
handleHelp(args, 'Install Script', 'This script installs dependencies for all packages in the monorepo.');

// Run the installation
installDependencies();
