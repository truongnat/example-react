#!/usr/bin/env bun

/**
 * Setup project structure: Monorepo vs Separate
 * Usage: bun setup-structure.js [monorepo|separate]
 */

import { readFileSync, writeFileSync, existsSync, rmSync, mkdirSync } from 'fs';
import { execSync } from 'child_process';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function execCommand(command, cwd = process.cwd()) {
  try {
    execSync(command, { cwd, stdio: 'inherit' });
    return true;
  } catch (error) {
    log(`❌ Error: ${error.message}`, colors.red);
    return false;
  }
}

function setupMonorepo() {
  log('🏗️  Setting up TRUE MONOREPO structure...', colors.cyan);
  log('='.repeat(50));
  
  // 1. Clean existing node_modules
  log('🧹 Cleaning existing node_modules...', colors.blue);
  ['client/node_modules', 'server/node_modules', 'node_modules'].forEach(dir => {
    if (existsSync(dir)) {
      log(`   🗑️  Removing ${dir}`, colors.yellow);
      rmSync(dir, { recursive: true, force: true });
    }
  });
  
  // 2. Clean lock files
  ['client/bun.lock', 'server/bun.lock', 'bun.lock'].forEach(file => {
    if (existsSync(file)) {
      log(`   🗑️  Removing ${file}`, colors.yellow);
      rmSync(file, { force: true });
    }
  });
  
  // 3. Update root package.json for monorepo
  log('📝 Configuring root package.json for monorepo...', colors.blue);
  const rootPackageJson = {
    "name": "example-react-monorepo",
    "version": "1.0.0",
    "description": "MERN Stack monorepo with Bun",
    "private": true,
    "type": "module",
    "workspaces": [
      "client",
      "server"
    ],
    "scripts": {
      "update-to-latest": "bun update-to-latest.js",
      "setup:monorepo": "bun setup-structure.js monorepo",
      "setup:separate": "bun setup-structure.js separate",
      "install": "bun install",
      "dev": "concurrently \"bun run dev:client\" \"bun run dev:server\"",
      "dev:client": "bun --cwd client run dev",
      "dev:server": "bun --cwd server run dev",
      "build": "bun --cwd client run build",
      "start": "bun --cwd server run start",
      "test": "bun --cwd client run test",
      "clean": "rm -rf client/node_modules server/node_modules node_modules client/bun.lock server/bun.lock bun.lock"
    },
    "devDependencies": {
      "concurrently": "latest"
    },
    "engines": {
      "bun": ">=1.0.0"
    }
  };
  
  writeFileSync('package.json', JSON.stringify(rootPackageJson, null, 2));
  
  // 4. Install all dependencies at root
  log('📦 Installing all dependencies at root level...', colors.blue);
  if (!execCommand('bun install')) return false;
  
  log('✅ Monorepo setup complete!', colors.green);
  log('\n📋 Benefits:', colors.cyan);
  log('- Shared dependencies (smaller total size)');
  log('- Consistent versions across projects');
  log('- Easier dependency management');
  log('\n🚀 Usage:', colors.cyan);
  log('- bun run dev (runs both client & server)');
  log('- bun --cwd client run dev (client only)');
  log('- bun --cwd server run dev (server only)');
  
  return true;
}

function setupSeparate() {
  log('📁 Setting up SEPARATE PROJECTS structure...', colors.cyan);
  log('='.repeat(50));
  
  // 1. Remove root node_modules if exists
  if (existsSync('node_modules')) {
    log('🗑️  Removing root node_modules...', colors.yellow);
    rmSync('node_modules', { recursive: true, force: true });
  }
  
  if (existsSync('bun.lock')) {
    log('🗑️  Removing root bun.lock...', colors.yellow);
    rmSync('bun.lock', { force: true });
  }
  
  // 2. Update root package.json for separate structure
  log('📝 Configuring root package.json for separate projects...', colors.blue);
  const rootPackageJson = {
    "name": "example-react-workspace",
    "version": "1.0.0",
    "description": "MERN Stack separate projects",
    "private": true,
    "type": "module",
    "scripts": {
      "update-to-latest": "bun update-to-latest.js",
      "setup:monorepo": "bun setup-structure.js monorepo",
      "setup:separate": "bun setup-structure.js separate",
      "install:client": "cd client && bun install",
      "install:server": "cd server && bun install",
      "install:all": "bun run install:client && bun run install:server",
      "dev": "concurrently \"bun run dev:client\" \"bun run dev:server\"",
      "dev:client": "cd client && bun run dev",
      "dev:server": "cd server && bun run dev",
      "build": "cd client && bun run build",
      "start": "cd server && bun run start",
      "test": "cd client && bun run test",
      "clean": "rm -rf client/node_modules server/node_modules client/bun.lock server/bun.lock"
    },
    "devDependencies": {
      "concurrently": "latest"
    }
  };
  
  writeFileSync('package.json', JSON.stringify(rootPackageJson, null, 2));
  
  // 3. Install root dev dependencies only
  log('📦 Installing root dev dependencies...', colors.blue);
  if (!execCommand('bun install')) return false;
  
  // 4. Install client dependencies
  log('📦 Installing client dependencies...', colors.blue);
  if (!execCommand('bun install', 'client')) return false;
  
  // 5. Install server dependencies
  log('📦 Installing server dependencies...', colors.blue);
  if (!execCommand('bun install', 'server')) return false;
  
  log('✅ Separate projects setup complete!', colors.green);
  log('\n📋 Benefits:', colors.cyan);
  log('- Independent dependencies');
  log('- No version conflicts');
  log('- Simpler structure');
  log('\n🚀 Usage:', colors.cyan);
  log('- bun run dev (runs both)');
  log('- bun run dev:client (client only)');
  log('- bun run dev:server (server only)');
  
  return true;
}

async function main() {
  const args = process.argv.slice(2);
  const mode = args[0];
  
  if (!mode || !['monorepo', 'separate'].includes(mode)) {
    log('🤔 Choose project structure:', colors.cyan);
    log('');
    log('📦 MONOREPO (recommended for shared dependencies):');
    log('   bun setup-structure.js monorepo');
    log('');
    log('📁 SEPARATE (recommended for independence):');
    log('   bun setup-structure.js separate');
    log('');
    process.exit(1);
  }
  
  log(`🚀 Setting up ${mode.toUpperCase()} structure...`, colors.green);
  
  let success = false;
  if (mode === 'monorepo') {
    success = setupMonorepo();
  } else {
    success = setupSeparate();
  }
  
  if (success) {
    log('\n🎉 Setup completed successfully!', colors.green);
    log('You can now run: bun update-to-latest.js', colors.cyan);
  } else {
    log('\n❌ Setup failed!', colors.red);
    process.exit(1);
  }
}

main().catch(error => {
  log(`❌ Unexpected error: ${error.message}`, colors.red);
  process.exit(1);
});
