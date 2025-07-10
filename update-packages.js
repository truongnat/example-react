#!/usr/bin/env bun

/**
 * Script to update all packages to latest versions using Bun
 * Usage: bun update-packages.js
 */

import { execSync } from 'child_process';
import { existsSync, rmSync } from 'fs';
import { join } from 'path';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function execCommand(command, cwd = process.cwd()) {
  try {
    execSync(command, { 
      cwd, 
      stdio: 'inherit',
      encoding: 'utf8'
    });
    return true;
  } catch (error) {
    log(`❌ Error executing: ${command}`, colors.red);
    log(`Error: ${error.message}`, colors.red);
    return false;
  }
}

function updatePackages(directory, name) {
  log(`\n📦 Updating packages in ${name} (${directory})...`, colors.cyan);
  log('----------------------------------------');
  
  if (!existsSync(directory)) {
    log(`❌ Directory ${directory} not found`, colors.red);
    return false;
  }
  
  const packageJsonPath = join(directory, 'package.json');
  if (!existsSync(packageJsonPath)) {
    log(`❌ No package.json found in ${directory}`, colors.red);
    return false;
  }
  
  log(`✅ Found package.json in ${directory}`, colors.green);
  
  // Remove existing lock file and node_modules
  const bunLockPath = join(directory, 'bun.lock');
  const nodeModulesPath = join(directory, 'node_modules');
  
  if (existsSync(bunLockPath)) {
    log('🗑️  Removing old bun.lock...', colors.yellow);
    rmSync(bunLockPath, { force: true });
  }
  
  if (existsSync(nodeModulesPath)) {
    log('🗑️  Removing old node_modules...', colors.yellow);
    rmSync(nodeModulesPath, { recursive: true, force: true });
  }
  
  // Update packages
  log('⬆️  Updating all packages to latest versions...', colors.blue);
  if (!execCommand('bun update', directory)) {
    return false;
  }
  
  // Install dependencies
  log('📥 Installing dependencies...', colors.blue);
  if (!execCommand('bun install', directory)) {
    return false;
  }
  
  log(`✅ ${name} packages updated successfully!`, colors.green);
  return true;
}

async function main() {
  log('🚀 Starting package updates with Bun...', colors.green);
  log('========================================');
  
  const projects = [
    { dir: 'client', name: 'Client (Frontend)' },
    { dir: 'server', name: 'Server (Backend)' }
  ];
  
  let allSuccess = true;
  
  for (const project of projects) {
    const success = updatePackages(project.dir, project.name);
    if (!success) {
      allSuccess = false;
    }
  }
  
  log('\n========================================');
  
  if (allSuccess) {
    log('🎉 All packages updated successfully!', colors.green);
    log('\n📋 Next steps:', colors.cyan);
    log('1. Test the client: cd client && bun run dev');
    log('2. Test the server: cd server && bun run dev');
    log('3. Check for any breaking changes in updated packages');
    log('\n⚠️  Note: Some packages might have breaking changes.', colors.yellow);
    log('   Please review the changelog of major version updates.');
  } else {
    log('❌ Some packages failed to update. Please check the errors above.', colors.red);
    process.exit(1);
  }
}

// Run the script
main().catch(error => {
  log(`❌ Unexpected error: ${error.message}`, colors.red);
  process.exit(1);
});
