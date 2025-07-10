#!/usr/bin/env bun

/**
 * Smart update strategy: Extract package names -> Remove all -> Reinstall latest
 * Usage: bun update-to-latest.js
 */

import { readFileSync, writeFileSync, existsSync, rmSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';

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

function extractPackageNames(packageJsonPath) {
  if (!existsSync(packageJsonPath)) {
    log(`❌ package.json not found: ${packageJsonPath}`, colors.red);
    return null;
  }

  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

  // ONLY extract package NAMES, ignore versions completely
  const dependencies = Object.keys(packageJson.dependencies || {});
  const devDependencies = Object.keys(packageJson.devDependencies || {});

  log(`   📋 Dependencies: ${dependencies.join(', ')}`, colors.yellow);
  log(`   📋 DevDependencies: ${devDependencies.join(', ')}`, colors.yellow);

  return {
    dependencies,
    devDependencies,
    originalPackageJson: packageJson
  };
}

function updatePackagesInDirectory(directory, name) {
  log(`\n📦 Updating ${name} (${directory})...`, colors.cyan);
  log('='.repeat(50));
  
  const packageJsonPath = join(directory, 'package.json');
  
  // Step 1: Extract package names
  log('🔍 Step 1: Extracting package names...', colors.blue);
  const packageInfo = extractPackageNames(packageJsonPath);
  if (!packageInfo) return false;
  
  const { dependencies, devDependencies, originalPackageJson } = packageInfo;
  
  log(`   📋 Found ${dependencies.length} dependencies`, colors.green);
  log(`   📋 Found ${devDependencies.length} devDependencies`, colors.green);
  
  // Step 2: Clean up
  log('🧹 Step 2: Cleaning up...', colors.blue);
  
  // Remove node_modules
  const nodeModulesPath = join(directory, 'node_modules');
  if (existsSync(nodeModulesPath)) {
    log('   🗑️  Removing node_modules...', colors.yellow);
    rmSync(nodeModulesPath, { recursive: true, force: true });
  }
  
  // Remove lock file
  const lockPath = join(directory, 'bun.lock');
  if (existsSync(lockPath)) {
    log('   🗑️  Removing bun.lock...', colors.yellow);
    rmSync(lockPath, { force: true });
  }
  
  // Step 3: Create clean package.json (keep only essential fields)
  log('📝 Step 3: Creating clean package.json...', colors.blue);
  const cleanPackageJson = {
    name: originalPackageJson.name,
    version: originalPackageJson.version,
    description: originalPackageJson.description,
    main: originalPackageJson.main,
    type: originalPackageJson.type,
    scripts: originalPackageJson.scripts,
    keywords: originalPackageJson.keywords,
    author: originalPackageJson.author,
    license: originalPackageJson.license,
    browserslist: originalPackageJson.browserslist,
    engines: originalPackageJson.engines,
    // Keep other non-dependency fields
    ...Object.fromEntries(
      Object.entries(originalPackageJson).filter(([key]) => 
        !['dependencies', 'devDependencies'].includes(key)
      )
    )
  };
  
  writeFileSync(packageJsonPath, JSON.stringify(cleanPackageJson, null, 2));
  
  // Step 4: Install latest dependencies (package names only, no versions)
  if (dependencies.length > 0) {
    log(`⬇️  Step 4a: Installing ${dependencies.length} dependencies (LATEST versions)...`, colors.blue);
    log(`   📦 Packages: ${dependencies.join(', ')}`, colors.cyan);
    const depsCommand = `bun add ${dependencies.join(' ')}`;
    log(`   🔧 Command: ${depsCommand}`, colors.yellow);
    if (!execCommand(depsCommand, directory)) return false;
  }

  if (devDependencies.length > 0) {
    log(`⬇️  Step 4b: Installing ${devDependencies.length} devDependencies (LATEST versions)...`, colors.blue);
    log(`   📦 Packages: ${devDependencies.join(', ')}`, colors.cyan);
    const devDepsCommand = `bun add -d ${devDependencies.join(' ')}`;
    log(`   🔧 Command: ${devDepsCommand}`, colors.yellow);
    if (!execCommand(devDepsCommand, directory)) return false;
  }
  
  log(`✅ ${name} updated successfully!`, colors.green);
  return true;
}

async function main() {
  log('🚀 Smart Package Update Strategy', colors.green);
  log('Extract → Clean → Reinstall Latest');
  log('='.repeat(50));
  
  const projects = [
    { dir: 'client', name: 'Client (Frontend)' },
    { dir: 'server', name: 'Server (Backend)' }
  ];
  
  let allSuccess = true;
  
  for (const project of projects) {
    if (!existsSync(project.dir)) {
      log(`❌ Directory not found: ${project.dir}`, colors.red);
      allSuccess = false;
      continue;
    }
    
    const success = updatePackagesInDirectory(project.dir, project.name);
    if (!success) {
      allSuccess = false;
    }
  }
  
  log('\n' + '='.repeat(50));
  if (allSuccess) {
    log('🎉 All packages updated to latest versions!', colors.green);
    log('\n📋 Next steps:', colors.cyan);
    log('1. Test the client: cd client && bun run dev');
    log('2. Test the server: cd server && bun run dev');
    log('3. Check for breaking changes in updated packages');
  } else {
    log('❌ Some updates failed. Check errors above.', colors.red);
    process.exit(1);
  }
}

main().catch(error => {
  log(`❌ Unexpected error: ${error.message}`, colors.red);
  process.exit(1);
});
