#!/usr/bin/env node

import { existsSync } from 'fs';
import { execSync } from 'child_process';
import { colors, log, runCommand, getProjectPaths, handleHelp } from './utils.js';
import { getPackageManagerConfig, detectPackageManager } from './config.js';

/**
 * Cross-platform install script
 * Installs dependencies for all packages in the monorepo
 */

/**
 * Check if a package manager is available
 * @param {string} manager - Package manager name
 * @returns {boolean} Whether the package manager is available
 */
function isPackageManagerAvailable(manager) {
  try {
    execSync(`${manager} --version`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Install a package manager if it's not available
 * @param {string} manager - Package manager name to install
 */
async function installPackageManager(manager) {
  log(`📦 Installing ${manager}...`, colors.yellow);

  try {
    switch (manager) {
      case 'bun':
        log('Installing bun using official installer...', colors.cyan);
        await runCommand('bash', ['-c', 'curl -fsSL https://bun.sh/install | bash'], process.cwd());
        process.env.PATH = `${process.env.HOME}/.bun/bin:${process.env.PATH}`;
        break;

      case 'pnpm':
        log('Installing pnpm using npm...', colors.cyan);
        await runCommand('npm', ['install', '-g', 'pnpm'], process.cwd());
        break;

      case 'yarn':
        log('Installing yarn using npm...', colors.cyan);
        await runCommand('npm', ['install', '-g', 'yarn'], process.cwd());
        break;

      case 'npm':
        throw new Error('npm should be available with Node.js installation');

      default:
        throw new Error(`Don't know how to install ${manager}`);
    }

    // Verify installation (with a small delay to allow PATH updates)
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (!isPackageManagerAvailable(manager)) {
      log(`⚠️  ${manager} may have been installed but not found in PATH. Continuing anyway...`, colors.yellow);
    }

    log(`✅ ${manager} installed successfully!`, colors.green);
  } catch (error) {
    throw new Error(`Failed to install ${manager}: ${error.message}`);
  }
}

async function installDependencies() {
  try {
    log(`${colors.bright}🚀 Starting installation process...${colors.reset}`, colors.green);

    const paths = getProjectPaths();
    let pmConfig = getPackageManagerConfig();

    // Check if the configured package manager is available
    if (!isPackageManagerAvailable(pmConfig.command)) {
      log(`⚠️  Package manager '${pmConfig.command}' not found, attempting to install...`, colors.yellow);
      await installPackageManager(pmConfig.command);
      // Reload config after installation
      pmConfig = getPackageManagerConfig();
    }

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
