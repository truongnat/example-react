#!/usr/bin/env node

import { colors, log, processCleanupTargets, handleHelp } from './utils.js';
import { getCleanupTargets, getScriptHelp, getEnvironmentConfig } from './config.js';

/**
 * Cross-platform clean script
 * Removes build artifacts, dependencies, and temporary files
 */

async function cleanProject() {
  try {
    log(`${colors.bright}🧹 Starting cleanup process...${colors.reset}`, colors.green);

    // Get cleanup targets from configuration
    const cleanupTargets = getCleanupTargets();

    // Process cleanup targets
    const { removedCount, totalCount } = processCleanupTargets(cleanupTargets);

    // Print summary
    log(`${colors.bright}\n📊 Cleanup Summary:${colors.reset}`, colors.magenta);
    log(`  Total targets checked: ${totalCount}`, colors.cyan);
    log(`  Successfully removed: ${removedCount}`, colors.green);
    log(`  Not found/skipped: ${totalCount - removedCount}`, colors.yellow);

    if (removedCount > 0) {
      log(`${colors.bright}\n✅ Cleanup completed! Removed ${removedCount} items.${colors.reset}`, colors.green);
      log(`${colors.bright}💡 Run 'node scripts/install.js' to reinstall dependencies.${colors.reset}`, colors.cyan);
    } else {
      log(`${colors.bright}\n🎉 Project is already clean!${colors.reset}`, colors.green);
    }

  } catch (error) {
    log(`${colors.bright}❌ Cleanup process failed: ${error.message}${colors.reset}`, colors.red);
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const helpInfo = getScriptHelp().clean;
const env = getEnvironmentConfig();

// Handle help flag
handleHelp(args, helpInfo.name, helpInfo.description);

// Confirm before cleaning if not in CI
if (!env.isCI && !args.includes('--force') && !args.includes('-f')) {
  log(`${colors.yellow}⚠️  This will remove all build artifacts and dependencies.${colors.reset}`, colors.yellow);
  log(`${colors.yellow}💡 Add --force or -f flag to skip this confirmation.${colors.reset}`, colors.yellow);

  // Simple confirmation (in a real scenario, you might want to use a proper prompt library)
  const readline = await import('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Continue? (y/N): ', (answer) => {
    rl.close();
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      cleanProject();
    } else {
      log(`${colors.yellow}🛑 Cleanup cancelled.${colors.reset}`, colors.yellow);
      process.exit(0);
    }
  });
} else {
  // Run cleanup directly
  cleanProject();
}
