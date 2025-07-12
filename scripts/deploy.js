#!/usr/bin/env node

import { colors, log, runScript, checkDeploymentArtifacts, handleHelp } from './utils.js';
import { getDeploymentSteps, getScriptHelp } from './config.js';

/**
 * Cross-platform deployment script
 * Builds, tests, and prepares the application for deployment
 */

async function deployApplication() {
  try {
    log(`${colors.bright}🚀 Starting deployment process...${colors.reset}`, colors.green);

    // Get deployment steps from configuration
    const steps = getDeploymentSteps();

    // Execute deployment steps
    for (const step of steps) {
      try {
        log(`${colors.bright}\n📋 Step: ${step.description}...${colors.reset}`, colors.blue);
        await runScript(step.script);
        log(`${colors.green}✅ ${step.name} completed successfully${colors.reset}`, colors.green);
      } catch (error) {
        log(`${colors.red}❌ ${step.name} failed: ${error.message}${colors.reset}`, colors.red);
        log(`${colors.bright}🛑 Deployment process stopped due to failure${colors.reset}`, colors.red);
        process.exit(1);
      }
    }

    // Check deployment artifacts
    log(`${colors.bright}\n🔍 Checking deployment artifacts...${colors.reset}`, colors.blue);
    const artifacts = checkDeploymentArtifacts();

    log(`${colors.bright}📦 Deployment Artifacts:${colors.reset}`, colors.magenta);
    artifacts.forEach(artifact => {
      const color = artifact.status === 'found' ? colors.green :
                   artifact.status === 'missing' && artifact.icon === '⚠️' ? colors.yellow : colors.red;
      log(`  ${artifact.icon} ${artifact.name}`, color);
    });

    // Deployment instructions
    log(`${colors.bright}\n🎯 Deployment Ready!${colors.reset}`, colors.green);
    log(`${colors.bright}📋 Next Steps:${colors.reset}`, colors.cyan);
    log(`  1. Upload the entire project to your server`, colors.cyan);
    log(`  2. Run: node scripts/install.js (on the server)`, colors.cyan);
    log(`  3. Set up environment variables (.env files)`, colors.cyan);
    log(`  4. Run: node scripts/start.js (to start production server)`, colors.cyan);

    log(`${colors.bright}\n🐳 Docker Deployment:${colors.reset}`, colors.cyan);
    log(`  - Use the provided Dockerfile and docker-compose files`, colors.cyan);
    log(`  - Run: docker-compose -f docker-compose.prod.yml up -d`, colors.cyan);

    log(`${colors.bright}\n✅ Deployment process completed successfully!${colors.reset}`, colors.green);

  } catch (error) {
    log(`${colors.bright}❌ Deployment process failed: ${error.message}${colors.reset}`, colors.red);
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const helpInfo = getScriptHelp().deploy;

// Handle help flag
handleHelp(args, helpInfo.name, helpInfo.description);

// Run the deployment process
deployApplication();
