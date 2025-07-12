#!/usr/bin/env node

import { colors, logger, createOrchestrator, createTimer, createResourceMonitor } from './utils.js';
import { getEnvironmentConfig, getScriptHelp } from './config.js';
import { globalCache } from './cache.js';

/**
 * Unified CLI interface for all project scripts
 * Usage: node scripts/cli.js <command> [options]
 */

/**
 * Available commands and their configurations
 */
const COMMANDS = {
  install: {
    description: 'Install dependencies for all packages',
    script: () => import('./install.js'),
    aliases: ['i', 'deps']
  },
  dev: {
    description: 'Start development servers',
    script: () => import('./dev.js'),
    aliases: ['d', 'develop', 'serve']
  },
  build: {
    description: 'Build all packages for production',
    script: () => import('./build.js'),
    aliases: ['b', 'compile']
  },
  test: {
    description: 'Run test suites',
    script: () => import('./test.js'),
    aliases: ['t', 'spec']
  },
  clean: {
    description: 'Clean build artifacts and dependencies',
    script: () => import('./clean.js'),
    aliases: ['c', 'clear', 'reset']
  },
  deploy: {
    description: 'Deploy application',
    script: () => import('./deploy.js'),
    aliases: ['release']
  },
  start: {
    description: 'Start production server',
    script: () => import('./start.js'),
    aliases: ['s', 'prod']
  }
};

/**
 * Global CLI options
 */
const GLOBAL_OPTIONS = {
  '--help': 'Show help information',
  '-h': 'Show help information',
  '--version': 'Show version information',
  '-v': 'Show version information',
  '--verbose': 'Enable verbose logging',
  '--quiet': 'Suppress non-error output',
  '--no-cache': 'Disable caching',
  '--clear-cache': 'Clear cache before running',
  '--env': 'Set environment (dev, staging, prod)',
  '--parallel': 'Enable parallel execution where possible',
  '--profile': 'Enable performance profiling'
};

/**
 * Parse command line arguments
 * @param {Array} args - Command line arguments
 * @returns {Object} Parsed arguments
 */
function parseArgs(args) {
  const parsed = {
    command: null,
    options: {},
    flags: new Set(),
    remaining: []
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg.startsWith('--')) {
      const [key, value] = arg.split('=');
      if (value !== undefined) {
        parsed.options[key] = value;
      } else if (args[i + 1] && !args[i + 1].startsWith('-')) {
        parsed.options[key] = args[++i];
      } else {
        parsed.flags.add(key);
      }
    } else if (arg.startsWith('-') && arg.length > 1) {
      if (args[i + 1] && !args[i + 1].startsWith('-')) {
        parsed.options[arg] = args[++i];
      } else {
        parsed.flags.add(arg);
      }
    } else if (!parsed.command) {
      parsed.command = arg;
    } else {
      parsed.remaining.push(arg);
    }
  }

  return parsed;
}

/**
 * Resolve command from name or alias
 * @param {string} commandName - Command name or alias
 * @returns {string|null} Resolved command name
 */
function resolveCommand(commandName) {
  if (!commandName) return null;
  
  // Direct match
  if (COMMANDS[commandName]) {
    return commandName;
  }

  // Alias match
  for (const [cmd, config] of Object.entries(COMMANDS)) {
    if (config.aliases && config.aliases.includes(commandName)) {
      return cmd;
    }
  }

  return null;
}

/**
 * Show help information
 * @param {string} command - Specific command to show help for
 */
function showHelp(command = null) {
  if (command && COMMANDS[command]) {
    const config = COMMANDS[command];
    logger.section(`Help: ${command}`);
    console.log(`${colors.cyan}Description:${colors.reset} ${config.description}`);
    console.log(`${colors.cyan}Usage:${colors.reset} node scripts/cli.js ${command} [options]`);
    
    if (config.aliases && config.aliases.length > 0) {
      console.log(`${colors.cyan}Aliases:${colors.reset} ${config.aliases.join(', ')}`);
    }
    
    return;
  }

  logger.section('Project Scripts CLI');
  console.log(`${colors.cyan}Usage:${colors.reset} node scripts/cli.js <command> [options]\n`);
  
  console.log(`${colors.bright}Available Commands:${colors.reset}`);
  for (const [cmd, config] of Object.entries(COMMANDS)) {
    const aliases = config.aliases ? ` (${config.aliases.join(', ')})` : '';
    console.log(`  ${colors.green}${cmd}${aliases}${colors.reset} - ${config.description}`);
  }
  
  console.log(`\n${colors.bright}Global Options:${colors.reset}`);
  for (const [option, description] of Object.entries(GLOBAL_OPTIONS)) {
    console.log(`  ${colors.yellow}${option}${colors.reset} - ${description}`);
  }
  
  console.log(`\n${colors.bright}Examples:${colors.reset}`);
  console.log(`  ${colors.cyan}node scripts/cli.js install${colors.reset}     # Install dependencies`);
  console.log(`  ${colors.cyan}node scripts/cli.js dev --verbose${colors.reset} # Start dev with verbose logging`);
  console.log(`  ${colors.cyan}node scripts/cli.js build --env=prod${colors.reset} # Build for production`);
  console.log(`  ${colors.cyan}node scripts/cli.js test --parallel${colors.reset} # Run tests in parallel`);
}

/**
 * Show version information
 */
function showVersion() {
  try {
    const packageJson = JSON.parse(require('fs').readFileSync('package.json', 'utf8'));
    console.log(`${colors.bright}${packageJson.name || 'Project Scripts'}${colors.reset} v${packageJson.version || '1.0.0'}`);
    console.log(`Node.js ${process.version}`);
    console.log(`Platform: ${process.platform} ${process.arch}`);
  } catch (error) {
    console.log(`${colors.bright}Project Scripts${colors.reset} v1.0.0`);
    console.log(`Node.js ${process.version}`);
  }
}

/**
 * Apply global options
 * @param {Object} parsed - Parsed arguments
 */
function applyGlobalOptions(parsed) {
  const env = getEnvironmentConfig();

  // Set environment
  if (parsed.options['--env']) {
    process.env.NODE_ENV = parsed.options['--env'];
    process.env.ENVIRONMENT = parsed.options['--env'];
  }

  // Configure logging
  if (parsed.flags.has('--verbose')) {
    process.env.DEBUG = '1';
    logger.info('Verbose logging enabled');
  }

  if (parsed.flags.has('--quiet')) {
    process.env.QUIET = '1';
  }

  // Cache options
  if (parsed.flags.has('--no-cache')) {
    process.env.DISABLE_CACHE = '1';
    logger.info('Caching disabled');
  }

  if (parsed.flags.has('--clear-cache')) {
    logger.info('Clearing cache...');
    globalCache.clearAll();
  }

  // Performance options
  if (parsed.flags.has('--profile')) {
    process.env.ENABLE_PROFILING = '1';
    logger.info('Performance profiling enabled');
  }

  if (parsed.flags.has('--parallel')) {
    process.env.ENABLE_PARALLEL = '1';
    logger.info('Parallel execution enabled');
  }
}

/**
 * Execute a command
 * @param {string} command - Command to execute
 * @param {Object} parsed - Parsed arguments
 */
async function executeCommand(command, parsed) {
  const timer = createTimer(`Command: ${command}`).start();
  const monitor = createResourceMonitor().start();

  try {
    logger.section(`Executing: ${command}`);
    
    // Import and execute the command script
    const commandConfig = COMMANDS[command];
    const scriptModule = await commandConfig.script();
    
    // If the script exports a main function, call it with arguments
    if (typeof scriptModule.default === 'function') {
      await scriptModule.default(parsed.remaining, parsed.options, parsed.flags);
    } else if (typeof scriptModule.main === 'function') {
      await scriptModule.main(parsed.remaining, parsed.options, parsed.flags);
    }
    
    timer.stop();
    monitor.logStats(`Command: ${command}`);
    logger.success(`Command completed: ${command}`);
    
  } catch (error) {
    timer.stop();
    logger.error(`Command failed: ${command} - ${error.message}`);
    process.exit(1);
  }
}

/**
 * Main CLI function
 */
async function main() {
  const args = process.argv.slice(2);
  const parsed = parseArgs(args);

  // Handle help and version flags
  if (parsed.flags.has('--help') || parsed.flags.has('-h')) {
    showHelp(parsed.command);
    return;
  }

  if (parsed.flags.has('--version') || parsed.flags.has('-v')) {
    showVersion();
    return;
  }

  // Apply global options
  applyGlobalOptions(parsed);

  // Resolve and execute command
  const command = resolveCommand(parsed.command);
  
  if (!command) {
    if (parsed.command) {
      logger.error(`Unknown command: ${parsed.command}`);
      console.log(`Run ${colors.cyan}node scripts/cli.js --help${colors.reset} for available commands.`);
    } else {
      showHelp();
    }
    process.exit(1);
  }

  await executeCommand(command, parsed);
}

// Run CLI if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    logger.error(`CLI error: ${error.message}`);
    process.exit(1);
  });
}

export { main, parseArgs, resolveCommand, COMMANDS };
