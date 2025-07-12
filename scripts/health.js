#!/usr/bin/env node

import { existsSync, readFileSync } from 'fs';
import { spawn } from 'child_process';
import { join } from 'path';
import { logger, colors } from './utils.js';
import { getProjectConfig, getEnvironmentConfig } from './config.js';

/**
 * Comprehensive health check and validation utilities
 */

/**
 * Health check result structure
 */
class HealthCheckResult {
  constructor(name, status = 'unknown', message = '', details = {}) {
    this.name = name;
    this.status = status; // 'pass', 'fail', 'warn', 'skip'
    this.message = message;
    this.details = details;
    this.timestamp = Date.now();
  }

  isPass() { return this.status === 'pass'; }
  isFail() { return this.status === 'fail'; }
  isWarn() { return this.status === 'warn'; }
  isSkip() { return this.status === 'skip'; }
}

/**
 * Health check runner
 */
export class HealthChecker {
  constructor() {
    this.checks = new Map();
    this.results = [];
  }

  /**
   * Add a health check
   * @param {string} name - Check name
   * @param {Function} checkFunction - Function that returns HealthCheckResult
   * @param {Object} options - Check options
   */
  addCheck(name, checkFunction, options = {}) {
    this.checks.set(name, { fn: checkFunction, options });
    return this;
  }

  /**
   * Run all health checks
   * @param {Array} checkNames - Specific checks to run (if empty, runs all)
   * @returns {Promise<Array>} Array of HealthCheckResult
   */
  async runChecks(checkNames = []) {
    const toRun = checkNames.length > 0 ? checkNames : Array.from(this.checks.keys());
    this.results = [];

    logger.section('Health Checks');
    logger.info(`Running ${toRun.length} health check(s)`);

    for (const checkName of toRun) {
      if (!this.checks.has(checkName)) {
        this.results.push(new HealthCheckResult(checkName, 'fail', 'Check not found'));
        continue;
      }

      try {
        logger.step(`Checking: ${checkName}`);
        const { fn, options } = this.checks.get(checkName);
        const result = await fn(options);
        this.results.push(result);
        
        const icon = this._getStatusIcon(result.status);
        const color = this._getStatusColor(result.status);
        logger.info(`${icon} ${checkName}: ${result.message}`, color);
        
      } catch (error) {
        const result = new HealthCheckResult(checkName, 'fail', error.message);
        this.results.push(result);
        logger.error(`❌ ${checkName}: ${error.message}`);
      }
    }

    this._printSummary();
    return this.results;
  }

  /**
   * Get status icon for result
   * @private
   */
  _getStatusIcon(status) {
    const icons = {
      pass: '✅',
      fail: '❌',
      warn: '⚠️',
      skip: '⏭️'
    };
    return icons[status] || '❓';
  }

  /**
   * Get status color for result
   * @private
   */
  _getStatusColor(status) {
    const colorMap = {
      pass: colors.green,
      fail: colors.red,
      warn: colors.yellow,
      skip: colors.cyan
    };
    return colorMap[status] || colors.reset;
  }

  /**
   * Print health check summary
   * @private
   */
  _printSummary() {
    const summary = this.results.reduce((acc, result) => {
      acc[result.status] = (acc[result.status] || 0) + 1;
      return acc;
    }, {});

    logger.section('Health Check Summary');
    console.log(`Total checks: ${this.results.length}`);
    
    if (summary.pass) console.log(`${colors.green}✅ Passed: ${summary.pass}${colors.reset}`);
    if (summary.fail) console.log(`${colors.red}❌ Failed: ${summary.fail}${colors.reset}`);
    if (summary.warn) console.log(`${colors.yellow}⚠️  Warnings: ${summary.warn}${colors.reset}`);
    if (summary.skip) console.log(`${colors.cyan}⏭️  Skipped: ${summary.skip}${colors.reset}`);

    const hasFailures = summary.fail > 0;
    const hasWarnings = summary.warn > 0;

    if (hasFailures) {
      logger.error('Some health checks failed. Please address the issues before proceeding.');
    } else if (hasWarnings) {
      logger.warn('Some health checks have warnings. Review them before proceeding.');
    } else {
      logger.success('All health checks passed!');
    }
  }

  /**
   * Check if all critical checks passed
   * @returns {boolean} True if no failures
   */
  isHealthy() {
    return !this.results.some(result => result.isFail());
  }
}

/**
 * Common health check functions
 */

/**
 * Check if Node.js version meets requirements
 */
export async function checkNodeVersion(options = {}) {
  const minVersion = options.minVersion || '16.0.0';
  const currentVersion = process.version.slice(1); // Remove 'v' prefix
  
  const isValid = compareVersions(currentVersion, minVersion) >= 0;
  
  return new HealthCheckResult(
    'Node.js Version',
    isValid ? 'pass' : 'fail',
    isValid 
      ? `Node.js ${currentVersion} (>= ${minVersion})`
      : `Node.js ${currentVersion} is below minimum required version ${minVersion}`,
    { current: currentVersion, required: minVersion }
  );
}

/**
 * Check if package manager is available
 */
export async function checkPackageManager(options = {}) {
  const packageManager = options.packageManager || 'bun';
  
  try {
    const version = await getCommandVersion(packageManager, ['--version']);
    return new HealthCheckResult(
      'Package Manager',
      'pass',
      `${packageManager} ${version} is available`,
      { packageManager, version }
    );
  } catch (error) {
    return new HealthCheckResult(
      'Package Manager',
      'fail',
      `${packageManager} is not available: ${error.message}`,
      { packageManager, error: error.message }
    );
  }
}

/**
 * Check project structure
 */
export async function checkProjectStructure(options = {}) {
  const paths = getProjectConfig();
  const requiredPaths = options.requiredPaths || [
    paths.client,
    paths.server,
    join(paths.client, 'package.json'),
    join(paths.server, 'package.json')
  ];

  const missing = requiredPaths.filter(path => !existsSync(path));
  
  if (missing.length === 0) {
    return new HealthCheckResult(
      'Project Structure',
      'pass',
      'All required project files and directories exist',
      { checked: requiredPaths.length }
    );
  } else {
    return new HealthCheckResult(
      'Project Structure',
      'fail',
      `Missing required paths: ${missing.join(', ')}`,
      { missing, checked: requiredPaths.length }
    );
  }
}

/**
 * Check dependencies installation
 */
export async function checkDependencies(options = {}) {
  const paths = getProjectConfig();
  const checkPaths = [
    { name: 'Client', path: paths.client },
    { name: 'Server', path: paths.server }
  ];

  const results = [];
  
  for (const { name, path } of checkPaths) {
    const nodeModulesPath = join(path, 'node_modules');
    const packageJsonPath = join(path, 'package.json');
    
    if (!existsSync(packageJsonPath)) {
      results.push(`${name}: package.json not found`);
      continue;
    }
    
    if (!existsSync(nodeModulesPath)) {
      results.push(`${name}: dependencies not installed`);
      continue;
    }
    
    // Check if dependencies are up to date
    try {
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      if (Object.keys(deps).length === 0) {
        results.push(`${name}: no dependencies defined`);
      }
    } catch (error) {
      results.push(`${name}: error reading package.json`);
    }
  }

  if (results.length === 0) {
    return new HealthCheckResult(
      'Dependencies',
      'pass',
      'All dependencies are installed',
      { checked: checkPaths.length }
    );
  } else {
    return new HealthCheckResult(
      'Dependencies',
      'warn',
      `Dependency issues: ${results.join(', ')}`,
      { issues: results }
    );
  }
}

/**
 * Check environment variables
 */
export async function checkEnvironment(options = {}) {
  const requiredVars = options.requiredVars || [];
  const optionalVars = options.optionalVars || [];
  
  const missing = requiredVars.filter(varName => !process.env[varName]);
  const present = [...requiredVars, ...optionalVars].filter(varName => process.env[varName]);
  
  if (missing.length === 0) {
    return new HealthCheckResult(
      'Environment Variables',
      'pass',
      `All required environment variables are set (${present.length} total)`,
      { present, missing }
    );
  } else {
    return new HealthCheckResult(
      'Environment Variables',
      'warn',
      `Missing environment variables: ${missing.join(', ')}`,
      { present, missing }
    );
  }
}

/**
 * Utility functions
 */

/**
 * Compare version strings
 * @param {string} version1 - First version
 * @param {string} version2 - Second version
 * @returns {number} -1, 0, or 1
 */
function compareVersions(version1, version2) {
  const v1Parts = version1.split('.').map(Number);
  const v2Parts = version2.split('.').map(Number);
  
  for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
    const v1Part = v1Parts[i] || 0;
    const v2Part = v2Parts[i] || 0;
    
    if (v1Part < v2Part) return -1;
    if (v1Part > v2Part) return 1;
  }
  
  return 0;
}

/**
 * Get command version
 * @param {string} command - Command to check
 * @param {Array} args - Arguments for version check
 * @returns {Promise<string>} Version string
 */
function getCommandVersion(command, args = ['--version']) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'pipe' });
    let output = '';
    
    child.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        resolve(output.trim());
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });
    
    child.on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * Create default health checker with common checks
 * @returns {HealthChecker} Configured health checker
 */
export function createDefaultHealthChecker() {
  const checker = new HealthChecker();
  
  checker
    .addCheck('node-version', checkNodeVersion, { minVersion: '16.0.0' })
    .addCheck('package-manager', checkPackageManager, { packageManager: 'bun' })
    .addCheck('project-structure', checkProjectStructure)
    .addCheck('dependencies', checkDependencies)
    .addCheck('environment', checkEnvironment);
  
  return checker;
}

export { HealthCheckResult };
