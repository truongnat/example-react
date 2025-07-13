#!/usr/bin/env node

import { spawn } from 'child_process';
import { existsSync, rmSync } from 'fs';

/**
 * Common utilities for cross-platform JavaScript scripts
 */

export const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

/**
 * Log a message with optional color
 * @param {string} message - The message to log
 * @param {string} color - The color code to use
 */
export function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

/**
 * Run a command in a specific directory
 * @param {string} command - The command to run
 * @param {string[]} args - Command arguments
 * @param {string} cwd - Working directory
 * @param {Object} options - Additional options
 * @param {boolean} options.nonInteractive - Whether to run in non-interactive mode
 * @returns {Promise<void>}
 */
export function runCommand(command, args, cwd = process.cwd(), options = {}) {
  return new Promise((resolve, reject) => {
    log(`${colors.cyan}Running: ${command} ${args.join(' ')}${colors.reset}`, colors.cyan);
    log(`${colors.yellow}Working directory: ${cwd}${colors.reset}`, colors.yellow);

    // Configure stdio based on interactive mode
    const stdio = options.nonInteractive ? ['ignore', 'inherit', 'inherit'] : 'inherit';

    const child = spawn(command, args, {
      cwd,
      stdio,
      shell: process.platform === 'win32'
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
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
 * Run multiple commands concurrently
 * @param {Array} commands - Array of command objects with {command, args, cwd, name}
 * @returns {Promise<void>}
 */
export function runConcurrent(commands) {
  return new Promise((resolve, reject) => {
    const processes = [];
    let completedProcesses = 0;
    let hasError = false;

    commands.forEach((cmd) => {
      const { command, args, cwd, name } = cmd;
      
      log(`${colors.cyan}Starting ${name}: ${command} ${args.join(' ')}${colors.reset}`, colors.cyan);
      log(`${colors.yellow}Working directory: ${cwd}${colors.reset}`, colors.yellow);
      
      const child = spawn(command, args, {
        cwd,
        stdio: 'inherit',
        shell: process.platform === 'win32'
      });

      child.on('close', (code) => {
        completedProcesses++;
        if (code !== 0 && !hasError) {
          hasError = true;
          log(`${colors.red}❌ ${name} failed with exit code ${code}${colors.reset}`, colors.red);
          // Kill all other processes
          processes.forEach(p => {
            if (p && !p.killed) {
              p.kill();
            }
          });
          reject(new Error(`${name} failed with exit code ${code}`));
        } else if (completedProcesses === commands.length && !hasError) {
          resolve();
        }
      });

      child.on('error', (error) => {
        if (!hasError) {
          hasError = true;
          log(`${colors.red}❌ ${name} error: ${error.message}${colors.reset}`, colors.red);
          // Kill all other processes
          processes.forEach(p => {
            if (p && !p.killed) {
              p.kill();
            }
          });
          reject(error);
        }
      });

      processes.push(child);
    });

    // Handle Ctrl+C gracefully
    process.on('SIGINT', () => {
      log(`${colors.yellow}🛑 Shutting down processes...${colors.reset}`, colors.yellow);
      processes.forEach(p => {
        if (p && !p.killed) {
          p.kill('SIGINT');
        }
      });
      process.exit(0);
    });
  });
}

/**
 * Check if a directory exists
 * @param {string} path - Path to check
 * @returns {boolean}
 */
export function directoryExists(path) {
  return existsSync(path);
}

/**
 * Get project paths
 * @returns {object} Object with root, client, and server paths
 */
export function getProjectPaths() {
  const root = process.cwd();
  return {
    root,
    client: `${root}/client`,
    server: `${root}/server-ts`
  };
}

/**
 * Print a summary of results
 * @param {Array} results - Array of result objects with {name, status, error?}
 * @param {string} operation - Name of the operation (e.g., "Build", "Test")
 */
export function printSummary(results, operation) {
  log(`${colors.bright}\n📊 ${operation} Summary:${colors.reset}`, colors.magenta);
  results.forEach(result => {
    const statusColor = result.status === 'success' || result.status === 'passed' ? colors.green : 
                       result.status === 'failed' ? colors.red : colors.yellow;
    const statusIcon = result.status === 'success' || result.status === 'passed' ? '✅' : 
                      result.status === 'failed' ? '❌' : '⚠️';
    log(`  ${statusIcon} ${result.name}: ${result.status}`, statusColor);
    if (result.error) {
      log(`    Error: ${result.error}`, colors.red);
    }
  });
}

/**
 * Handle help flag
 * @param {string[]} args - Command line arguments
 * @param {string} scriptName - Name of the script
 * @param {string} description - Description of what the script does
 */
export function handleHelp(args, scriptName, description) {
  if (args.includes('--help') || args.includes('-h')) {
    log(`${colors.bright}${scriptName}${colors.reset}`, colors.green);
    log(`${colors.cyan}Usage: node scripts/${scriptName.toLowerCase().replace(' ', '-')}.js${colors.reset}`, colors.cyan);
    log(`${colors.yellow}${description}${colors.reset}`, colors.yellow);
    process.exit(0);
  }
}

/**
 * Setup graceful shutdown for a single process
 * @param {ChildProcess} child - The child process to manage
 * @param {string} processName - Name of the process for logging
 */
export function setupGracefulShutdown(child, processName) {
  const shutdown = (signal) => {
    log(`${colors.yellow}🛑 Shutting down ${processName}...${colors.reset}`, colors.yellow);
    if (child && !child.killed) {
      child.kill(signal);
    }
    process.exit(0);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

/**
 * Run a sequence of operations for multiple projects
 * @param {Array} projects - Array of project objects with {name, path, command, args}
 * @param {string} operation - Name of the operation (e.g., "Build", "Test")
 * @param {boolean} stopOnFailure - Whether to stop on first failure
 * @returns {Promise<Array>} Array of results
 */
export async function runProjectOperations(projects, operation, stopOnFailure = true) {
  const results = [];
  let hasFailures = false;

  for (const project of projects) {
    try {
      log(`${colors.bright}${project.icon || '⚙️'} ${operation} ${project.name}...${colors.reset}`, colors.blue);

      // Use non-interactive mode for test operations
      const options = operation.toLowerCase() === 'test' ? { nonInteractive: true } : {};

      await runCommand(project.command, project.args, project.path, options);
      results.push({ name: project.name, status: 'success' });
      log(`${colors.green}✅ ${project.name} ${operation.toLowerCase()} completed${colors.reset}`, colors.green);
    } catch (error) {
      hasFailures = true;
      results.push({ name: project.name, status: 'failed', error: error.message });
      log(`${colors.red}❌ ${project.name} ${operation.toLowerCase()} failed: ${error.message}${colors.reset}`, colors.red);

      if (stopOnFailure) {
        break;
      }
    }
  }

  return { results, hasFailures };
}

/**
 * Get available projects for operations
 * @param {string} operation - The operation type (e.g., 'build', 'test', 'dev')
 * @returns {Promise<Array>} Array of project configurations
 */
export async function getAvailableProjects(operation = 'build') {
  const paths = getProjectPaths();
  const projects = [];

  // Import package manager config dynamically
  const { getPackageManagerConfig } = await import('./config.js');
  const pmConfig = getPackageManagerConfig();

  // Client project
  if (directoryExists(paths.client)) {
    // Use non-interactive test script for client (vitest run instead of vitest)
    const clientOperation = operation === 'test' ? 'test:ci' : operation;
    projects.push({
      name: 'Client',
      path: paths.client,
      command: pmConfig.command,
      args: ['run', clientOperation],
      icon: '🎨'
    });
  }

  // Server project
  if (directoryExists(paths.server)) {
    // Use non-interactive test script for server (jest --passWithNoTests --ci)
    const serverOperation = operation === 'test' ? 'test:ci' : operation;
    projects.push({
      name: 'Server',
      path: paths.server,
      command: pmConfig.command,
      args: ['run', serverOperation],
      icon: '⚙️'
    });
  }

  return projects;
}

/**
 * Check deployment artifacts
 * @returns {Array} Array of artifact status objects
 */
export function checkDeploymentArtifacts() {
  const paths = getProjectPaths();
  const artifacts = [];

  // Check client build
  const clientDistPath = `${paths.client}/dist`;
  if (directoryExists(clientDistPath)) {
    artifacts.push({ name: 'Client build (dist)', status: 'found', icon: '✅' });
  } else {
    artifacts.push({ name: 'Client build (dist)', status: 'missing', icon: '⚠️' });
  }

  // Check server build
  const serverDistPath = `${paths.server}/dist`;
  if (directoryExists(serverDistPath)) {
    artifacts.push({ name: 'Server build (dist)', status: 'found', icon: '✅' });
  } else {
    artifacts.push({ name: 'Server build (dist)', status: 'missing', icon: '❌' });
  }

  // Check package files
  if (directoryExists(`${paths.root}/package.json`)) {
    artifacts.push({ name: 'Root package.json', status: 'found', icon: '✅' });
  }

  if (directoryExists(`${paths.server}/package.json`)) {
    artifacts.push({ name: 'Server package.json', status: 'found', icon: '✅' });
  }

  return artifacts;
}

/**
 * Run a script from the scripts directory
 * @param {string} scriptName - Name of the script (without .js extension)
 * @returns {Promise<void>}
 */
export function runScript(scriptName) {
  return new Promise((resolve, reject) => {
    const scriptPath = `${process.cwd()}/scripts/${scriptName}.js`;

    if (!directoryExists(scriptPath)) {
      reject(new Error(`Script not found: ${scriptPath}`));
      return;
    }

    log(`${colors.cyan}Running script: ${scriptName}${colors.reset}`, colors.cyan);

    const child = spawn('node', [scriptPath], {
      cwd: process.cwd(),
      stdio: 'inherit',
      shell: process.platform === 'win32'
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Script ${scriptName} failed with exit code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * Validate project structure and requirements
 * @param {Array} requiredPaths - Array of required paths to check
 * @returns {Object} Validation result with status and missing paths
 */
export function validateProjectStructure(requiredPaths = []) {
  const missing = [];
  const found = [];

  requiredPaths.forEach(path => {
    if (directoryExists(path)) {
      found.push(path);
    } else {
      missing.push(path);
    }
  });

  return {
    isValid: missing.length === 0,
    found,
    missing
  };
}

/**
 * Remove a directory safely
 * @param {string} path - Path to remove
 * @param {string} description - Description for logging
 * @returns {boolean} True if removed successfully
 */
export function removeDirectory(path, description) {
  try {
    if (directoryExists(path)) {
      rmSync(path, { recursive: true, force: true });
      log(`✅ Removed ${description}: ${path}`, colors.green);
      return true;
    } else {
      log(`⚠️  ${description} not found: ${path}`, colors.yellow);
      return false;
    }
  } catch (error) {
    log(`❌ Failed to remove ${description}: ${error.message}`, colors.red);
    return false;
  }
}

/**
 * Remove a file safely
 * @param {string} path - Path to remove
 * @param {string} description - Description for logging
 * @returns {boolean} True if removed successfully
 */
export function removeFile(path, description) {
  try {
    if (directoryExists(path)) {
      rmSync(path, { force: true });
      log(`✅ Removed ${description}: ${path}`, colors.green);
      return true;
    } else {
      log(`⚠️  ${description} not found: ${path}`, colors.yellow);
      return false;
    }
  } catch (error) {
    log(`❌ Failed to remove ${description}: ${error.message}`, colors.red);
    return false;
  }
}

/**
 * Process cleanup targets
 * @param {Array} targets - Array of cleanup target objects
 * @returns {Object} Cleanup results with counts
 */
export function processCleanupTargets(targets) {
  let removedCount = 0;
  let totalCount = targets.length;

  log(`${colors.bright}🎯 Cleaning up ${totalCount} potential targets...${colors.reset}`, colors.blue);

  for (const target of targets) {
    let success = false;

    if (target.type === 'directory') {
      success = removeDirectory(target.path, target.description);
    } else {
      success = removeFile(target.path, target.description);
    }

    if (success) {
      removedCount++;
    }
  }

  return { removedCount, totalCount };
}

/**
 * Advanced logging utilities with structured logging and performance monitoring
 */

/**
 * Performance timer for measuring execution time
 */
class PerformanceTimer {
  constructor(name) {
    this.name = name;
    this.startTime = null;
    this.endTime = null;
    this.duration = null;
  }

  start() {
    this.startTime = performance.now();
    log(`⏱️  Started: ${this.name}`, colors.cyan);
    return this;
  }

  stop() {
    this.endTime = performance.now();
    this.duration = this.endTime - this.startTime;
    const formattedDuration = this.duration < 1000
      ? `${Math.round(this.duration)}ms`
      : `${(this.duration / 1000).toFixed(2)}s`;
    log(`⏱️  Completed: ${this.name} (${formattedDuration})`, colors.green);
    return this;
  }

  getDuration() {
    return this.duration;
  }
}

/**
 * Create a performance timer
 * @param {string} name - Name of the operation being timed
 * @returns {PerformanceTimer} Timer instance
 */
export function createTimer(name) {
  return new PerformanceTimer(name);
}

/**
 * Structured logger with different log levels
 */
export const logger = {
  /**
   * Log debug information (only in development)
   * @param {string} message - Debug message
   * @param {Object} data - Additional data to log
   */
  debug(message, data = null) {
    if (process.env.NODE_ENV === 'development' || process.env.DEBUG) {
      log(`🐛 DEBUG: ${message}`, colors.magenta);
      if (data) {
        console.log(data);
      }
    }
  },

  /**
   * Log informational messages
   * @param {string} message - Info message
   * @param {string} icon - Optional icon
   */
  info(message, icon = 'ℹ️') {
    log(`${icon} ${message}`, colors.blue);
  },

  /**
   * Log success messages
   * @param {string} message - Success message
   * @param {string} icon - Optional icon
   */
  success(message, icon = '✅') {
    log(`${icon} ${message}`, colors.green);
  },

  /**
   * Log warning messages
   * @param {string} message - Warning message
   * @param {string} icon - Optional icon
   */
  warn(message, icon = '⚠️') {
    log(`${icon} ${message}`, colors.yellow);
  },

  /**
   * Log error messages
   * @param {string} message - Error message
   * @param {string} icon - Optional icon
   */
  error(message, icon = '❌') {
    log(`${icon} ${message}`, colors.red);
  },

  /**
   * Log step information with progress
   * @param {string} message - Step message
   * @param {number} current - Current step number
   * @param {number} total - Total steps
   */
  step(message, current = null, total = null) {
    const progress = current && total ? `[${current}/${total}] ` : '';
    log(`📋 ${progress}${message}`, colors.cyan);
  },

  /**
   * Log section headers
   * @param {string} message - Section title
   */
  section(message) {
    log(`\n${colors.bright}═══ ${message} ═══${colors.reset}`, colors.magenta);
  }
};

/**
 * Monitor system resources during script execution
 */
export class ResourceMonitor {
  constructor() {
    this.startMemory = null;
    this.startTime = null;
  }

  start() {
    this.startMemory = process.memoryUsage();
    this.startTime = performance.now();
    logger.debug('Resource monitoring started', this.startMemory);
    return this;
  }

  getStats() {
    const currentMemory = process.memoryUsage();
    const currentTime = performance.now();

    return {
      duration: currentTime - this.startTime,
      memory: {
        heapUsed: currentMemory.heapUsed - this.startMemory.heapUsed,
        heapTotal: currentMemory.heapTotal - this.startMemory.heapTotal,
        external: currentMemory.external - this.startMemory.external,
        rss: currentMemory.rss - this.startMemory.rss
      }
    };
  }

  logStats(operationName) {
    const stats = this.getStats();
    const duration = stats.duration < 1000
      ? `${Math.round(stats.duration)}ms`
      : `${(stats.duration / 1000).toFixed(2)}s`;

    logger.info(`${operationName} completed in ${duration}`);

    if (stats.memory.heapUsed > 1024 * 1024) { // > 1MB
      const heapMB = (stats.memory.heapUsed / 1024 / 1024).toFixed(2);
      logger.debug(`Memory usage: ${heapMB}MB heap`);
    }
  }
}

/**
 * Create a resource monitor
 * @returns {ResourceMonitor} Monitor instance
 */
export function createResourceMonitor() {
  return new ResourceMonitor();
}

/**
 * Script orchestration utilities for managing complex workflows
 */

/**
 * Script dependency graph and execution orchestrator
 */
export class ScriptOrchestrator {
  constructor() {
    this.scripts = new Map();
    this.dependencies = new Map();
    this.executed = new Set();
    this.executing = new Set();
  }

  /**
   * Add a script to the orchestrator
   * @param {string} name - Script name
   * @param {Function} scriptFunction - Function to execute
   * @param {Array} dependencies - Array of dependency script names
   */
  addScript(name, scriptFunction, dependencies = []) {
    this.scripts.set(name, scriptFunction);
    this.dependencies.set(name, dependencies);
    return this;
  }

  /**
   * Execute scripts in dependency order
   * @param {Array} scriptNames - Scripts to execute (if empty, executes all)
   * @returns {Promise<Object>} Execution results
   */
  async execute(scriptNames = []) {
    const toExecute = scriptNames.length > 0 ? scriptNames : Array.from(this.scripts.keys());
    const results = {};
    const monitor = createResourceMonitor().start();

    logger.section('Script Orchestration');
    logger.info(`Executing ${toExecute.length} script(s) with dependency resolution`);

    try {
      for (const scriptName of toExecute) {
        await this._executeWithDependencies(scriptName, results);
      }

      monitor.logStats('Script orchestration');
      logger.success('All scripts executed successfully');
      return { success: true, results };

    } catch (error) {
      logger.error(`Script orchestration failed: ${error.message}`);
      return { success: false, error: error.message, results };
    }
  }

  /**
   * Execute scripts in parallel where possible
   * @param {Array} scriptNames - Scripts to execute
   * @returns {Promise<Object>} Execution results
   */
  async executeParallel(scriptNames = []) {
    const toExecute = scriptNames.length > 0 ? scriptNames : Array.from(this.scripts.keys());
    const results = {};
    const monitor = createResourceMonitor().start();

    logger.section('Parallel Script Execution');
    logger.info(`Executing ${toExecute.length} script(s) in parallel where possible`);

    try {
      // Group scripts by dependency level
      const levels = this._getDependencyLevels(toExecute);

      for (let level = 0; level < levels.length; level++) {
        const scriptsAtLevel = levels[level];
        if (scriptsAtLevel.length === 0) continue;

        logger.step(`Executing level ${level + 1} scripts`, level + 1, levels.length);

        // Execute all scripts at this level in parallel
        const promises = scriptsAtLevel.map(async (scriptName) => {
          const timer = createTimer(scriptName).start();
          try {
            const result = await this.scripts.get(scriptName)();
            timer.stop();
            results[scriptName] = { success: true, result, duration: timer.getDuration() };
            this.executed.add(scriptName);
          } catch (error) {
            timer.stop();
            results[scriptName] = { success: false, error: error.message, duration: timer.getDuration() };
            throw error;
          }
        });

        await Promise.all(promises);
      }

      monitor.logStats('Parallel script execution');
      logger.success('All scripts executed successfully');
      return { success: true, results };

    } catch (error) {
      logger.error(`Parallel script execution failed: ${error.message}`);
      return { success: false, error: error.message, results };
    }
  }

  /**
   * Execute a script with its dependencies
   * @private
   */
  async _executeWithDependencies(scriptName, results) {
    if (this.executed.has(scriptName)) {
      return results[scriptName];
    }

    if (this.executing.has(scriptName)) {
      throw new Error(`Circular dependency detected involving script: ${scriptName}`);
    }

    if (!this.scripts.has(scriptName)) {
      throw new Error(`Script not found: ${scriptName}`);
    }

    this.executing.add(scriptName);

    // Execute dependencies first
    const dependencies = this.dependencies.get(scriptName) || [];
    for (const dep of dependencies) {
      await this._executeWithDependencies(dep, results);
    }

    // Execute the script
    const timer = createTimer(scriptName).start();
    try {
      const result = await this.scripts.get(scriptName)();
      timer.stop();
      results[scriptName] = { success: true, result, duration: timer.getDuration() };
      this.executed.add(scriptName);
      this.executing.delete(scriptName);
      return results[scriptName];
    } catch (error) {
      timer.stop();
      results[scriptName] = { success: false, error: error.message, duration: timer.getDuration() };
      this.executing.delete(scriptName);
      throw error;
    }
  }

  /**
   * Get dependency levels for parallel execution
   * @private
   */
  _getDependencyLevels(scriptNames) {
    const levels = [];
    const remaining = new Set(scriptNames);
    const processed = new Set();

    while (remaining.size > 0) {
      const currentLevel = [];

      for (const scriptName of remaining) {
        const dependencies = this.dependencies.get(scriptName) || [];
        const unmetDeps = dependencies.filter(dep => !processed.has(dep));

        if (unmetDeps.length === 0) {
          currentLevel.push(scriptName);
        }
      }

      if (currentLevel.length === 0) {
        throw new Error('Circular dependency detected in script dependencies');
      }

      levels.push(currentLevel);
      currentLevel.forEach(script => {
        remaining.delete(script);
        processed.add(script);
      });
    }

    return levels;
  }
}

/**
 * Create a script orchestrator
 * @returns {ScriptOrchestrator} Orchestrator instance
 */
export function createOrchestrator() {
  return new ScriptOrchestrator();
}

/**
 * Performance optimization utilities
 */

/**
 * Worker pool for parallel task execution
 */
export class WorkerPool {
  constructor(maxWorkers = 4) {
    this.maxWorkers = maxWorkers;
    this.activeWorkers = 0;
    this.queue = [];
    this.results = new Map();
  }

  /**
   * Execute tasks in parallel with worker pool
   * @param {Array} tasks - Array of task functions
   * @param {Object} options - Execution options
   * @returns {Promise<Array>} Results array
   */
  async execute(tasks, options = {}) {
    const { batchSize = this.maxWorkers, timeout = 30000 } = options;

    logger.info(`Executing ${tasks.length} tasks with ${Math.min(batchSize, this.maxWorkers)} workers`);

    const batches = this._createBatches(tasks, batchSize);
    const allResults = [];

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      logger.step(`Processing batch ${i + 1}`, i + 1, batches.length);

      const batchPromises = batch.map((task, index) =>
        this._executeTask(task, `batch-${i}-task-${index}`, timeout)
      );

      const batchResults = await Promise.allSettled(batchPromises);
      allResults.push(...batchResults);
    }

    return allResults;
  }

  /**
   * Create batches from tasks
   * @private
   */
  _createBatches(tasks, batchSize) {
    const batches = [];
    for (let i = 0; i < tasks.length; i += batchSize) {
      batches.push(tasks.slice(i, i + batchSize));
    }
    return batches;
  }

  /**
   * Execute a single task with timeout
   * @private
   */
  async _executeTask(task, taskId, timeout) {
    const timer = createTimer(taskId).start();

    try {
      const result = await Promise.race([
        task(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Task timeout')), timeout)
        )
      ]);

      timer.stop();
      return { status: 'fulfilled', value: result, duration: timer.getDuration() };
    } catch (error) {
      timer.stop();
      return { status: 'rejected', reason: error, duration: timer.getDuration() };
    }
  }
}

/**
 * Performance profiler for detailed analysis
 */
export class PerformanceProfiler {
  constructor() {
    this.profiles = new Map();
    this.currentProfile = null;
  }

  /**
   * Start profiling a section
   * @param {string} name - Profile section name
   * @returns {PerformanceProfiler} This instance for chaining
   */
  start(name) {
    const profile = {
      name,
      startTime: performance.now(),
      startMemory: process.memoryUsage(),
      children: [],
      parent: this.currentProfile
    };

    if (this.currentProfile) {
      this.currentProfile.children.push(profile);
    }

    this.currentProfile = profile;
    this.profiles.set(name, profile);

    logger.debug(`Profiling started: ${name}`);
    return this;
  }

  /**
   * End profiling a section
   * @param {string} name - Profile section name
   * @returns {Object} Profile results
   */
  end(name) {
    const profile = this.profiles.get(name);
    if (!profile) {
      logger.warn(`Profile not found: ${name}`);
      return null;
    }

    profile.endTime = performance.now();
    profile.endMemory = process.memoryUsage();
    profile.duration = profile.endTime - profile.startTime;
    profile.memoryDelta = {
      heapUsed: profile.endMemory.heapUsed - profile.startMemory.heapUsed,
      heapTotal: profile.endMemory.heapTotal - profile.startMemory.heapTotal,
      external: profile.endMemory.external - profile.startMemory.external,
      rss: profile.endMemory.rss - profile.startMemory.rss
    };

    this.currentProfile = profile.parent;

    logger.debug(`Profiling ended: ${name} (${Math.round(profile.duration)}ms)`);
    return profile;
  }

  /**
   * Get profiling results
   * @param {string} name - Profile name (optional)
   * @returns {Object} Profile data
   */
  getResults(name = null) {
    if (name) {
      return this.profiles.get(name);
    }
    return Object.fromEntries(this.profiles);
  }

  /**
   * Generate performance report
   * @returns {string} Formatted report
   */
  generateReport() {
    const report = [];
    report.push('Performance Profile Report');
    report.push('='.repeat(50));

    for (const [name, profile] of this.profiles) {
      if (profile.parent) continue; // Skip child profiles, they'll be included in parent

      report.push(`\n${name}:`);
      report.push(`  Duration: ${Math.round(profile.duration)}ms`);
      report.push(`  Memory: ${this._formatMemory(profile.memoryDelta.heapUsed)}`);

      if (profile.children.length > 0) {
        this._addChildrenToReport(report, profile.children, 2);
      }
    }

    return report.join('\n');
  }

  /**
   * Add children profiles to report
   * @private
   */
  _addChildrenToReport(report, children, indent) {
    for (const child of children) {
      const spaces = ' '.repeat(indent);
      report.push(`${spaces}${child.name}: ${Math.round(child.duration)}ms`);

      if (child.children.length > 0) {
        this._addChildrenToReport(report, child.children, indent + 2);
      }
    }
  }

  /**
   * Format memory usage
   * @private
   */
  _formatMemory(bytes) {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}KB`;
    return `${Math.round(bytes / 1024 / 1024)}MB`;
  }
}

/**
 * Optimization utilities
 */

/**
 * Debounce function execution
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function execution
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Create a worker pool
 * @param {number} maxWorkers - Maximum number of workers
 * @returns {WorkerPool} Worker pool instance
 */
export function createWorkerPool(maxWorkers) {
  return new WorkerPool(maxWorkers);
}

/**
 * Create a performance profiler
 * @returns {PerformanceProfiler} Profiler instance
 */
export function createProfiler() {
  return new PerformanceProfiler();
}
