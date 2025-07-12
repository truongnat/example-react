#!/usr/bin/env node

import { existsSync } from 'fs';
import { colors, log, runProjectOperations, getAvailableProjects, printSummary, handleHelp, runCommand, getProjectPaths } from './utils.js';
import { getScriptHelp } from './config.js';

/**
 * Cross-platform build script
 * Builds all packages in the monorepo for production
 */

async function buildProjects() {
  try {
    log(`${colors.bright}🏗️  Starting build process...${colors.reset}`, colors.green);

    // Get available projects for building
    const projects = await getAvailableProjects('build');

    if (projects.length === 0) {
      log(`${colors.yellow}⚠️  No projects found for building${colors.reset}`, colors.yellow);
      process.exit(0);
    }

    // Run builds for all projects
    const { results, hasFailures } = await runProjectOperations(projects, 'Build', true);

    // Print summary
    printSummary(results, 'Build');

    if (hasFailures) {
      log(`${colors.bright}\n❌ Some builds failed!${colors.reset}`, colors.red);
      process.exit(1);
    } else {
      // Copy client build to server for SSR
      await copyClientBuildToServer();

      log(`${colors.bright}\n✅ All builds completed successfully!${colors.reset}`, colors.green);
      log(`${colors.bright}🚀 Ready for deployment!${colors.reset}`, colors.green);
    }

  } catch (error) {
    log(`${colors.bright}❌ Build process failed: ${error.message}${colors.reset}`, colors.red);
    process.exit(1);
  }
}

/**
 * Copy client build files to server for SSR
 */
async function copyClientBuildToServer() {
  const paths = getProjectPaths();
  const clientDistPath = `${paths.client}/dist`;
  const serverBuildPath = `${paths.server}/dist/build`;

  if (existsSync(clientDistPath) && existsSync(paths.server)) {
    log(`${colors.bright}📁 Copying client build to server for SSR...${colors.reset}`, colors.blue);

    try {
      // Remove existing build directory
      if (existsSync(serverBuildPath)) {
        await runCommand('rm', ['-rf', serverBuildPath], process.cwd());
      }

      // Copy client dist to server
      await runCommand('cp', ['-r', clientDistPath, serverBuildPath], process.cwd());

      log(`${colors.bright}✅ Client build copied to server successfully!${colors.reset}`, colors.green);
    } catch (error) {
      log(`${colors.yellow}⚠️  Failed to copy client build to server: ${error.message}${colors.reset}`, colors.yellow);
      log(`${colors.yellow}💡 You may need to copy manually: cp -r ${clientDistPath} ${serverBuildPath}${colors.reset}`, colors.yellow);
    }
  } else {
    if (!existsSync(clientDistPath)) {
      log(`${colors.yellow}⚠️  Client build not found, skipping copy to server${colors.reset}`, colors.yellow);
    }
    if (!existsSync(paths.server)) {
      log(`${colors.yellow}⚠️  Server directory not found, skipping copy${colors.reset}`, colors.yellow);
    }
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const helpInfo = getScriptHelp().build;
handleHelp(args, helpInfo.name, helpInfo.description);

// Run the build process
buildProjects();
