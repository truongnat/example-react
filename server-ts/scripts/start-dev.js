#!/usr/bin/env node

/**
 * Development startup script
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function loadEnvFile() {
  // Try to load from root .env first (unified configuration)
  const rootEnvPath = path.join(process.cwd(), '../.env');
  const localEnvPath = path.join(process.cwd(), '.env');

  let loaded = false;

  // Load root .env first
  if (fs.existsSync(rootEnvPath)) {
    console.log('📄 Loading unified environment configuration from root...');
    const envContent = fs.readFileSync(rootEnvPath, 'utf8');

    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const [key, ...valueParts] = trimmed.split('=');
        const value = valueParts.join('=');
        if (!process.env[key]) { // Don't override existing values
          process.env[key] = value;
        }
      }
    });
    loaded = true;
  }

  // Load local .env as fallback/override
  if (fs.existsSync(localEnvPath)) {
    if (!loaded) {
      console.log('📄 Loading local environment configuration...');
    }
    const envContent = fs.readFileSync(localEnvPath, 'utf8');

    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const [key, ...valueParts] = trimmed.split('=');
        const value = valueParts.join('=');
        process.env[key] = value; // Local overrides root
      }
    });
    loaded = true;
  }

  if (!loaded) {
    console.warn('⚠️ No environment configuration found. Using defaults.');
  }
}

function checkCommand(command) {
  try {
    execSync(`${command} --version`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function createEnvFile() {
  const envPath = path.join(process.cwd(), '.env');
  const envExamplePath = path.join(process.cwd(), '.env.example');
  
  if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
    log('📝 Creating .env file from template...', colors.yellow);
    fs.copyFileSync(envExamplePath, envPath);
    log('⚠️  Please update .env file with your configuration', colors.yellow);
    return true;
  }
  return false;
}

function installDependencies() {
  if (!fs.existsSync(path.join(process.cwd(), 'node_modules'))) {
    log('📦 Installing dependencies...', colors.yellow);
    
    // Check if bun is available, otherwise use npm
    const packageManager = checkCommand('bun') ? 'bun' : 'npm';
    const installCommand = packageManager === 'bun' ? 'bun install' : 'npm install';
    
    try {
      execSync(installCommand, { stdio: 'inherit' });
      log('✅ Dependencies installed successfully', colors.green);
    } catch (error) {
      log('❌ Failed to install dependencies', colors.red);
      process.exit(1);
    }
  }
}

function buildApplication() {
  if (!fs.existsSync(path.join(process.cwd(), 'dist'))) {
    log('🔨 Building application...', colors.yellow);
    
    try {
      execSync('npm run build', { stdio: 'inherit' });
      log('✅ Application built successfully', colors.green);
    } catch (error) {
      log('❌ Failed to build application', colors.red);
      process.exit(1);
    }
  }
}

function setupDatabase() {
  const databaseType = process.env.DATABASE_TYPE || 'sqlite';
  
  log(`🗄️  Setting up ${databaseType} database...`, colors.cyan);
  
  switch (databaseType) {
    case 'sqlite':
      const dataDir = path.join(process.cwd(), 'data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
        log('Created data directory', colors.green);
      }
      break;
      
    case 'postgres':
      if (checkCommand('docker') && (checkCommand('docker-compose') || checkCommand('docker compose'))) {
        log('🗄️  Starting PostgreSQL with Docker...', colors.cyan);
        try {
          const dockerDir = path.join(process.cwd(), 'docker');
          const composeCommand = checkCommand('docker-compose') ? 'docker-compose' : 'docker compose';
          
          execSync(`cd ${dockerDir} && ${composeCommand} up -d postgres`, { stdio: 'inherit' });
          log('Waiting for PostgreSQL to be ready...', colors.yellow);
          
          // Wait for PostgreSQL to start
          setTimeout(() => {
            log('✅ PostgreSQL should be ready', colors.green);
          }, 3000);
        } catch (error) {
          log('⚠️  Could not start PostgreSQL with Docker', colors.yellow);
          log('Please make sure PostgreSQL is running manually', colors.yellow);
        }
      } else {
        log('⚠️  Docker not available, please ensure PostgreSQL is running', colors.yellow);
      }
      break;
      
    case 'supabase':
      log('🗄️  Using Supabase database', colors.cyan);
      break;
      
    case 'mongodb':
      log('🗄️  Using MongoDB database', colors.cyan);
      break;
  }
}

function startDevelopmentServer() {
  log('');
  log('✅ Development environment ready!', colors.green);
  log('🌐 Starting development server...', colors.cyan);
  log('');
  
  // Start the development server
  const packageManager = checkCommand('bun') ? 'bun' : 'npm';
  const devCommand = packageManager === 'bun' ? 'bun run dev' : 'npm run dev';
  
  try {
    // Use spawn to keep the process running and show output
    const [command, ...args] = devCommand.split(' ');
    const devProcess = spawn(command, args, {
      stdio: 'inherit',
      shell: true
    });
    
    devProcess.on('error', (error) => {
      log(`❌ Failed to start development server: ${error.message}`, colors.red);
      process.exit(1);
    });
    
    devProcess.on('exit', (code) => {
      if (code !== 0) {
        log(`❌ Development server exited with code ${code}`, colors.red);
        process.exit(code);
      }
    });
    
  } catch (error) {
    log(`❌ Failed to start development server: ${error.message}`, colors.red);
    process.exit(1);
  }
}

function main() {
  log('🚀 Starting Development Environment', colors.bright);
  log('==================================', colors.bright);
  log('');
  
  // Create .env file if needed
  const envCreated = createEnvFile();
  
  // Load environment variables
  loadEnvFile();
  
  const databaseType = process.env.DATABASE_TYPE || 'sqlite';
  const nodeEnv = process.env.NODE_ENV || 'development';
  const port = process.env.PORT || '5000';
  
  log(`Environment: ${nodeEnv}`, colors.blue);
  log(`Database: ${databaseType}`, colors.blue);
  log(`Port: ${port}`, colors.blue);
  log('');
  
  if (envCreated) {
    log('Please update your .env file with the correct configuration and run this script again.', colors.yellow);
    return;
  }
  
  // Install dependencies if needed
  installDependencies();
  
  // Setup database
  setupDatabase();
  
  // Build application if needed
  buildApplication();
  
  // Start development server
  startDevelopmentServer();
}

// Handle process termination
process.on('SIGINT', () => {
  log('\n👋 Shutting down development server...', colors.yellow);
  process.exit(0);
});

process.on('SIGTERM', () => {
  log('\n👋 Shutting down development server...', colors.yellow);
  process.exit(0);
});

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main };
