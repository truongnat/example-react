#!/usr/bin/env node

import { colors, log, runProjectOperations, getAvailableProjects, printSummary, handleHelp } from './utils.js';
import { getScriptHelp } from './config.js';

/**
 * Cross-platform test script
 * Runs tests for all packages in the monorepo
 */

async function runTests() {
  try {
    log(`${colors.bright}🧪 Starting test suite...${colors.reset}`, colors.green);

    // Get available projects for testing
    const projects = await getAvailableProjects('test');

    if (projects.length === 0) {
      log(`${colors.yellow}⚠️  No projects found for testing${colors.reset}`, colors.yellow);
      process.exit(0);
    }

    // Run tests for all projects
    const { results, hasFailures } = await runProjectOperations(projects, 'Test', false);

    // Convert status to test-specific format
    const testResults = results.map(result => ({
      ...result,
      status: result.status === 'success' ? 'passed' : result.status
    }));

    // Print summary
    printSummary(testResults, 'Test');

    if (hasFailures) {
      log(`${colors.bright}\n❌ Some tests failed!${colors.reset}`, colors.red);
      process.exit(1);
    } else {
      log(`${colors.bright}\n✅ All tests passed successfully!${colors.reset}`, colors.green);
    }

  } catch (error) {
    log(`${colors.bright}❌ Test execution failed: ${error.message}${colors.reset}`, colors.red);
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const helpInfo = getScriptHelp().test;
handleHelp(args, helpInfo.name, helpInfo.description);

const isWatch = args.includes('--watch') || args.includes('-w');
const isCoverage = args.includes('--coverage') || args.includes('-c');

if (isWatch) {
  log(`${colors.yellow}👀 Watch mode not supported in this script. Use individual package scripts for watch mode.${colors.reset}`, colors.yellow);
  process.exit(1);
}

if (isCoverage) {
  log(`${colors.yellow}📊 Coverage mode not implemented in this script. Use individual package scripts for coverage.${colors.reset}`, colors.yellow);
}

// Run the tests
runTests();
