#!/usr/bin/env node

/**
 * Database setup script for different environments
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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
  const envPath = path.join(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = {};
    
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const [key, ...valueParts] = trimmed.split('=');
        const value = valueParts.join('=');
        envVars[key] = value;
        process.env[key] = value;
      }
    });
    
    return envVars;
  }
  return {};
}

function checkCommand(command) {
  try {
    execSync(`${command} --version`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function setupSQLite() {
  log('Setting up SQLite database...', colors.cyan);
  
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    log('Created data directory', colors.green);
  }
  
  log('✅ SQLite setup complete', colors.green);
  log(`Database will be created at: ${path.join(dataDir, 'database.sqlite')}`, colors.blue);
}

function setupPostgreSQL() {
  log('Setting up PostgreSQL database...', colors.cyan);
  
  // Check if Docker is available
  if (!checkCommand('docker')) {
    log('❌ Docker is required for PostgreSQL setup', colors.red);
    process.exit(1);
  }
  
  // Check if Docker Compose is available
  if (!checkCommand('docker-compose') && !checkCommand('docker compose')) {
    log('❌ Docker Compose is required for PostgreSQL setup', colors.red);
    process.exit(1);
  }
  
  try {
    log('Starting PostgreSQL container...', colors.yellow);
    
    const dockerDir = path.join(process.cwd(), 'docker');
    process.chdir(dockerDir);
    
    // Try docker-compose first, then docker compose
    let composeCommand = 'docker-compose';
    if (!checkCommand('docker-compose')) {
      composeCommand = 'docker compose';
    }
    
    execSync(`${composeCommand} up -d postgres`, { stdio: 'inherit' });
    
    log('Waiting for PostgreSQL to be ready...', colors.yellow);
    
    // Wait a bit for PostgreSQL to start
    setTimeout(() => {
      try {
        const username = process.env.POSTGRES_USERNAME || 'postgres';
        const database = process.env.POSTGRES_DATABASE || 'example_db';
        
        execSync(`${composeCommand} exec postgres pg_isready -U ${username} -d ${database}`, { stdio: 'ignore' });
        
        log('✅ PostgreSQL setup complete', colors.green);
        
        const host = process.env.POSTGRES_HOST || 'localhost';
        const port = process.env.POSTGRES_PORT || '5432';
        const password = process.env.POSTGRES_PASSWORD || 'password';
        
        log(`Connection: postgresql://${username}:${password}@${host}:${port}/${database}`, colors.blue);
        
        process.chdir('..');
      } catch (error) {
        log('❌ PostgreSQL setup failed', colors.red);
        log('Please check Docker logs: docker-compose logs postgres', colors.yellow);
        process.chdir('..');
        process.exit(1);
      }
    }, 5000);
    
  } catch (error) {
    log('❌ Failed to start PostgreSQL container', colors.red);
    log(error.message, colors.red);
    process.chdir('..');
    process.exit(1);
  }
}

function setupSupabase() {
  log('Setting up Supabase connection...', colors.cyan);
  
  const requiredVars = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    log('❌ Supabase configuration missing', colors.red);
    log(`Please set the following variables in your .env file:`, colors.yellow);
    missingVars.forEach(varName => {
      log(`  - ${varName}`, colors.yellow);
    });
    process.exit(1);
  }
  
  log('✅ Supabase configuration found', colors.green);
  log(`URL: ${process.env.SUPABASE_URL}`, colors.blue);
}

function setupMongoDB() {
  log('Setting up MongoDB (legacy support)...', colors.cyan);
  
  if (!process.env.MONGO_URL) {
    log('❌ MongoDB URL missing', colors.red);
    log('Please set MONGO_URL in your .env file', colors.yellow);
    process.exit(1);
  }
  
  log('✅ MongoDB configuration found', colors.green);
  log(`URL: ${process.env.MONGO_URL}`, colors.blue);
}

function main() {
  log('🗄️  Database Setup Script', colors.bright);
  log('========================', colors.bright);
  
  // Load environment variables
  loadEnvFile();
  
  const databaseType = process.env.DATABASE_TYPE || 'sqlite';
  log(`Database type: ${databaseType}`, colors.cyan);
  log('');
  
  switch (databaseType) {
    case 'sqlite':
      setupSQLite();
      break;
      
    case 'postgres':
      setupPostgreSQL();
      return; // Return early because of async setTimeout
      
    case 'supabase':
      setupSupabase();
      break;
      
    case 'mongodb':
      setupMongoDB();
      break;
      
    default:
      log(`❌ Unsupported database type: ${databaseType}`, colors.red);
      log('Supported types: sqlite, postgres, supabase, mongodb', colors.yellow);
      process.exit(1);
  }
  
  log('');
  log('🎉 Database setup completed successfully!', colors.green);
  log('You can now start the application with: npm run dev', colors.blue);
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main };
