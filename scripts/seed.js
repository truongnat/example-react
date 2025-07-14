#!/usr/bin/env node

import { existsSync } from 'fs';
import { colors, log, runCommand, getProjectPaths, handleHelp } from './utils.js';
import { getPackageManagerConfig } from './config.js';

/**
 * Cross-platform seed script
 * Seeds demo data for the application
 */

async function seedDemoData() {
  try {
    log(`${colors.bright}🌱 Starting demo data seeding...${colors.reset}`, colors.green);

    const paths = getProjectPaths();
    const pmConfig = getPackageManagerConfig();

    log(`📦 Using package manager: ${pmConfig.command}`, colors.cyan);

    // Check if server directory exists
    if (!existsSync(paths.server)) {
      log(`${colors.red}❌ Server directory not found: ${paths.server}${colors.reset}`, colors.red);
      process.exit(1);
    }

    // Parse command line arguments
    const args = process.argv.slice(2);
    const force = args.includes('--force') || args.includes('-f');
    const help = args.includes('--help') || args.includes('-h');

    if (help) {
      log(`${colors.bright}Demo Data Seeder${colors.reset}`, colors.blue);
      log('', colors.reset);
      log('Seeds the database with demo user and sample todos for testing and demonstration.', colors.cyan);
      log('', colors.reset);
      log(`${colors.yellow}Usage:${colors.reset}`, colors.yellow);
      log('  pnpm run seed:demo              Seed demo data (skip if exists)', colors.cyan);
      log('  pnpm run seed:demo:force        Force seed (recreate if exists)', colors.cyan);
      log('', colors.reset);
      log(`${colors.yellow}Options:${colors.reset}`, colors.yellow);
      log('  --force, -f                     Force recreate demo data', colors.cyan);
      log('  --help, -h                      Show this help message', colors.cyan);
      log('', colors.reset);
      log(`${colors.yellow}Demo User Credentials:${colors.reset}`, colors.yellow);
      log('  Email: john@example.com', colors.cyan);
      log('  Password: Password123', colors.cyan);
      log('', colors.reset);
      log(`${colors.yellow}What gets created:${colors.reset}`, colors.yellow);
      log('  • 1 demo user account', colors.cyan);
      log('  • 10 sample todos with different statuses', colors.cyan);
      log('  • Ready-to-use data for testing the app', colors.cyan);
      return;
    }

    // Prepare command arguments
    const seedArgs = ['run', 'seed:demo'];
    if (force) {
      seedArgs.push('--', '--force');
    }

    log(`${colors.bright}🚀 Running seed command in server directory...${colors.reset}`, colors.blue);
    log(`Command: ${pmConfig.command} ${seedArgs.join(' ')}`, colors.cyan);

    // Run the seed command
    await runCommand(pmConfig.command, seedArgs, paths.server);

    log(`${colors.bright}✅ Demo data seeding completed successfully!${colors.reset}`, colors.green);
    log('', colors.reset);
    log(`${colors.yellow}🎉 You can now login with:${colors.reset}`, colors.yellow);
    log('  Email: john@example.com', colors.cyan);
    log('  Password: Password123', colors.cyan);
    log('', colors.reset);
    log(`${colors.yellow}🌐 Access the application:${colors.reset}`, colors.yellow);
    log('  Frontend: http://localhost:5173', colors.cyan);
    log('  Backend: http://localhost:8080', colors.cyan);
    log('  API Docs: http://localhost:8080/api-docs', colors.cyan);

  } catch (error) {
    log(`${colors.bright}❌ Demo data seeding failed: ${error.message}${colors.reset}`, colors.red);
    process.exit(1);
  }
}

// Parse command line arguments for help first
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log('Demo Data Seeder');
  console.log('');
  console.log('Seeds the database with demo user and sample todos for testing and demonstration.');
  console.log('');
  console.log('Usage:');
  console.log('  pnpm run seed:demo              Seed demo data (skip if exists)');
  console.log('  pnpm run seed:demo:force        Force seed (recreate if exists)');
  console.log('');
  console.log('Options:');
  console.log('  --force, -f                     Force recreate demo data');
  console.log('  --help, -h                      Show this help message');
  console.log('');
  console.log('Demo User Credentials:');
  console.log('  Email: john@example.com');
  console.log('  Password: Password123');
  console.log('');
  console.log('What gets created:');
  console.log('  • 1 demo user account');
  console.log('  • 10 sample todos with different statuses');
  console.log('  • Ready-to-use data for testing the app');
  process.exit(0);
}

// Run the seeding
seedDemoData();
