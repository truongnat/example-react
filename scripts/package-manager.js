#!/usr/bin/env node

import { existsSync, writeFileSync, readFileSync } from 'fs';
import { execSync } from 'child_process';
import { colors, log, runCommand, getProjectPaths } from './utils.js';
import { getPackageManagerConfig, detectPackageManager } from './config.js';

/**
 * Package Manager Switcher
 * Allows switching between different package managers (bun, pnpm, npm, yarn)
 */

const SUPPORTED_MANAGERS = ['bun', 'pnpm', 'npm', 'yarn'];

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
        // Install bun using the official installer
        log('Installing bun using official installer...', colors.cyan);
        await runCommand('bash', ['-c', 'curl -fsSL https://bun.sh/install | bash'], process.cwd());
        // Add bun to PATH for current session
        process.env.PATH = `${process.env.HOME}/.bun/bin:${process.env.PATH}`;
        break;

      case 'pnpm':
        // Install pnpm using npm
        log('Installing pnpm using npm...', colors.cyan);
        await runCommand('npm', ['install', '-g', 'pnpm'], process.cwd());
        break;

      case 'yarn':
        // Install yarn using npm
        log('Installing yarn using npm...', colors.cyan);
        await runCommand('npm', ['install', '-g', 'yarn'], process.cwd());
        break;

      case 'npm':
        // npm should already be available with Node.js
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

/**
 * Get current package manager
 * @returns {string} Current package manager
 */
async function getCurrentPackageManager() {
  return process.env.PACKAGE_MANAGER || await detectPackageManager();
}

/**
 * Set package manager preference
 * @param {string} manager - Package manager to set
 * @param {boolean} autoInstall - Whether to auto-install if not available
 */
async function setPackageManager(manager, autoInstall = false) {
  if (!SUPPORTED_MANAGERS.includes(manager)) {
    throw new Error(`Unsupported package manager: ${manager}. Supported: ${SUPPORTED_MANAGERS.join(', ')}`);
  }

  if (!isPackageManagerAvailable(manager)) {
    if (autoInstall) {
      await installPackageManager(manager);
    } else {
      throw new Error(`Package manager '${manager}' is not installed or not available`);
    }
  }

  // Create or update .env file
  const envPath = '.env';
  let envContent = '';

  if (existsSync(envPath)) {
    envContent = readFileSync(envPath, 'utf8');
  }

  // Remove existing PACKAGE_MANAGER line
  envContent = envContent.replace(/^PACKAGE_MANAGER=.*$/m, '');

  // Add new PACKAGE_MANAGER line
  envContent = envContent.trim();
  if (envContent) {
    envContent += '\n';
  }
  envContent += `PACKAGE_MANAGER=${manager}\n`;

  writeFileSync(envPath, envContent);
  log(`✅ Package manager set to: ${manager}`, colors.green);
}

/**
 * Clean package manager artifacts
 * @param {string} manager - Package manager to clean
 */
async function cleanPackageManager(manager) {
  const paths = getProjectPaths();
  const lockFiles = {
    bun: ['bun.lockb'],
    pnpm: ['pnpm-lock.yaml'],
    npm: ['package-lock.json'],
    yarn: ['yarn.lock']
  };

  const packageManagerDirs = {
    bun: [],
    pnpm: ['.pnpm-store'],
    npm: [],
    yarn: ['.yarn', '.yarnrc.yml', '.pnp.cjs', '.pnp.loader.mjs']
  };

  const nodeModules = ['node_modules'];

  // Clean root directory
  log(`🧹 Cleaning ${manager} artifacts...`, colors.yellow);

  for (const file of [...lockFiles[manager], ...packageManagerDirs[manager], ...nodeModules]) {
    if (existsSync(file)) {
      await runCommand('rm', ['-rf', file], process.cwd());
      log(`  Removed: ${file}`, colors.cyan);
    }
  }

  // Clean client directory
  if (existsSync(paths.client)) {
    for (const file of [...lockFiles[manager], ...packageManagerDirs[manager], ...nodeModules]) {
      const filePath = `${paths.client}/${file}`;
      if (existsSync(filePath)) {
        await runCommand('rm', ['-rf', filePath], process.cwd());
        log(`  Removed: client/${file}`, colors.cyan);
      }
    }
  }

  // Clean server directory
  if (existsSync(paths.server)) {
    for (const file of [...lockFiles[manager], ...packageManagerDirs[manager], ...nodeModules]) {
      const filePath = `${paths.server}/${file}`;
      if (existsSync(filePath)) {
        await runCommand('rm', ['-rf', filePath], process.cwd());
        log(`  Removed: server-ts/${file}`, colors.cyan);
      }
    }
  }
}

/**
 * Switch package manager
 * @param {string} newManager - New package manager to switch to
 * @param {boolean} clean - Whether to clean old artifacts
 */
async function switchPackageManager(newManager, clean = true) {
  const currentManager = await getCurrentPackageManager();

  if (currentManager === newManager) {
    log(`Already using ${newManager}`, colors.yellow);
    return;
  }

  log(`🔄 Switching from ${currentManager} to ${newManager}...`, colors.blue);

  if (clean) {
    // Clean old package manager artifacts
    await cleanPackageManager(currentManager);

    // Clean other package managers' artifacts too
    for (const manager of SUPPORTED_MANAGERS) {
      if (manager !== newManager) {
        await cleanPackageManager(manager);
      }
    }
  }

  // Set new package manager (with auto-install)
  await setPackageManager(newManager, true);

  // Force reload environment variables
  process.env.PACKAGE_MANAGER = newManager;

  // Install dependencies with new package manager
  log(`📦 Installing dependencies with ${newManager}...`, colors.blue);
  const config = getPackageManagerConfig();

  const paths = getProjectPaths();

  // Install root dependencies
  await runCommand(config.command, config.installArgs, process.cwd());

  // Install client dependencies
  if (existsSync(paths.client)) {
    await runCommand(config.command, config.installArgs, paths.client);
  }

  // Install server dependencies
  if (existsSync(paths.server)) {
    await runCommand(config.command, config.installArgs, paths.server);
  }

  log(`✅ Successfully switched to ${newManager}!`, colors.green);
}

/**
 * List available package managers
 */
async function listPackageManagers() {
  const current = await getCurrentPackageManager();

  log('📦 Available Package Managers:', colors.blue);
  log('', colors.reset);

  for (const manager of SUPPORTED_MANAGERS) {
    const available = isPackageManagerAvailable(manager);
    const isCurrent = manager === current;
    const status = available ? '✅' : '❌';
    const marker = isCurrent ? '👉' : '  ';

    log(`${marker} ${status} ${manager}${isCurrent ? ' (current)' : ''}`,
      isCurrent ? colors.green : available ? colors.cyan : colors.red);
  }
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);

  // Handle help
  if (args.includes('--help') || args.includes('-h')) {
    log('Package Manager Switcher', colors.bright);
    log('', colors.reset);
    log('Usage:', colors.yellow);
    log('  node scripts/package-manager.js [command] [options]', colors.cyan);
    log('', colors.reset);
    log('Commands:', colors.yellow);
    log('  list                    List available package managers', colors.cyan);
    log('  current                 Show current package manager', colors.cyan);
    log('  switch <manager>        Switch to specified package manager (auto-installs if needed)', colors.cyan);
    log('  clean [manager]         Clean artifacts for specified manager', colors.cyan);
    log('', colors.reset);
    log('Options:', colors.yellow);
    log('  --no-clean             Skip cleaning when switching', colors.cyan);
    log('', colors.reset);
    log('Examples:', colors.yellow);
    log('  node scripts/package-manager.js list', colors.cyan);
    log('  node scripts/package-manager.js switch pnpm', colors.cyan);
    log('  node scripts/package-manager.js switch bun --no-clean', colors.cyan);
    return;
  }

  const command = args[0];
  const target = args[1];
  const noClean = args.includes('--no-clean');

  try {
    switch (command) {
      case 'list':
        await listPackageManagers();
        break;

      case 'current':
        log(`Current package manager: ${await getCurrentPackageManager()}`, colors.green);
        break;

      case 'switch':
        if (!target) {
          log('❌ Please specify a package manager to switch to', colors.red);
          process.exit(1);
        }
        await switchPackageManager(target, !noClean);
        break;

      case 'clean':
        const managerToClean = target || await getCurrentPackageManager();
        await cleanPackageManager(managerToClean);
        log(`✅ Cleaned ${managerToClean} artifacts`, colors.green);
        break;

      default:
        if (!command) {
          await listPackageManagers();
        } else {
          log(`❌ Unknown command: ${command}`, colors.red);
          log('Use --help for usage information', colors.yellow);
          process.exit(1);
        }
    }
  } catch (error) {
    log(`❌ Error: ${error.message}`, colors.red);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
