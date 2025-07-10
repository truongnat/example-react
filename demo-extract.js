#!/usr/bin/env bun

/**
 * Demo script to show package extraction (names only, no versions)
 */

import { readFileSync, existsSync } from 'fs';

function demoExtraction(packageJsonPath, projectName) {
  console.log(`\n📦 ${projectName}`);
  console.log('='.repeat(40));
  
  if (!existsSync(packageJsonPath)) {
    console.log('❌ package.json not found');
    return;
  }
  
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
  
  console.log('\n🔍 BEFORE (with versions):');
  if (packageJson.dependencies) {
    console.log('Dependencies:');
    Object.entries(packageJson.dependencies).forEach(([name, version]) => {
      console.log(`  ${name}: ${version}`);
    });
  }
  
  if (packageJson.devDependencies) {
    console.log('DevDependencies:');
    Object.entries(packageJson.devDependencies).forEach(([name, version]) => {
      console.log(`  ${name}: ${version}`);
    });
  }
  
  console.log('\n✅ AFTER (names only):');
  const depNames = Object.keys(packageJson.dependencies || {});
  const devDepNames = Object.keys(packageJson.devDependencies || {});
  
  if (depNames.length > 0) {
    console.log(`Dependencies (${depNames.length}): ${depNames.join(', ')}`);
  }
  
  if (devDepNames.length > 0) {
    console.log(`DevDependencies (${devDepNames.length}): ${devDepNames.join(', ')}`);
  }
  
  console.log('\n🚀 Install commands that will be executed:');
  if (depNames.length > 0) {
    console.log(`bun add ${depNames.join(' ')}`);
  }
  if (devDepNames.length > 0) {
    console.log(`bun add -d ${devDepNames.join(' ')}`);
  }
}

// Demo both projects
demoExtraction('client/package.json', 'CLIENT');
demoExtraction('server/package.json', 'SERVER');

console.log('\n🎯 KEY POINTS:');
console.log('- Only package NAMES are extracted (no versions)');
console.log('- When reinstalled, Bun will use LATEST versions');
console.log('- No more version locks like ^17.0.2 or ~4.1.0');
console.log('- All packages get updated to newest available versions');
