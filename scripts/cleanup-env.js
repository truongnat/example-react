#!/usr/bin/env node

/**
 * Environment Cleanup Script
 * 
 * This script helps clean up redundant environment files and migrate
 * to the unified root .env configuration.
 */

import { existsSync, unlinkSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { colors, log } from './utils.js';

/**
 * Files to clean up or migrate
 */
const ENV_FILES_TO_CLEANUP = [
  {
    path: 'client/.env',
    action: 'remove',
    reason: 'Client environment variables moved to root .env with VITE_ prefix'
  },
  {
    path: 'client/.env.local',
    action: 'remove',
    reason: 'Local overrides should be in root .env'
  },
  {
    path: 'server-ts/.env',
    action: 'remove',
    reason: 'Server environment variables moved to root .env'
  },
  {
    path: 'server-ts/.env.local',
    action: 'remove',
    reason: 'Local overrides should be in root .env'
  }
];

/**
 * Backup existing environment files before cleanup
 */
function backupEnvironmentFiles() {
  const backupDir = '.env-backup';
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  
  log('📦 Creating backup of existing environment files...', colors.cyan);
  
  let backedUpCount = 0;
  
  for (const file of ENV_FILES_TO_CLEANUP) {
    if (existsSync(file.path)) {
      try {
        const content = readFileSync(file.path, 'utf8');
        const backupPath = `${backupDir}/${file.path.replace('/', '_')}_${timestamp}`;
        
        // Create backup directory if it doesn't exist
        const backupDirPath = backupPath.substring(0, backupPath.lastIndexOf('/'));
        if (!existsSync(backupDirPath)) {
          import('fs').then(fs => fs.mkdirSync(backupDirPath, { recursive: true }));
        }
        
        writeFileSync(backupPath, content);
        log(`   ✅ Backed up ${file.path} to ${backupPath}`, colors.green);
        backedUpCount++;
      } catch (error) {
        log(`   ❌ Failed to backup ${file.path}: ${error.message}`, colors.red);
      }
    }
  }
  
  if (backedUpCount > 0) {
    log(`📦 Backed up ${backedUpCount} environment files to ${backupDir}/`, colors.green);
  } else {
    log('📦 No environment files found to backup', colors.yellow);
  }
  
  return backedUpCount;
}

/**
 * Analyze existing environment files and suggest migration
 */
function analyzeEnvironmentFiles() {
  log('🔍 Analyzing existing environment files...', colors.cyan);
  
  const analysis = {
    foundFiles: [],
    variables: new Map(),
    conflicts: [],
    suggestions: []
  };
  
  for (const file of ENV_FILES_TO_CLEANUP) {
    if (existsSync(file.path)) {
      analysis.foundFiles.push(file.path);
      
      try {
        const content = readFileSync(file.path, 'utf8');
        const lines = content.split('\n');
        
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
            const [key, ...valueParts] = trimmed.split('=');
            const value = valueParts.join('=');
            
            if (key) {
              if (analysis.variables.has(key)) {
                analysis.conflicts.push({
                  key,
                  files: [analysis.variables.get(key).file, file.path],
                  values: [analysis.variables.get(key).value, value]
                });
              } else {
                analysis.variables.set(key, { value, file: file.path });
              }
            }
          }
        }
      } catch (error) {
        log(`   ❌ Failed to analyze ${file.path}: ${error.message}`, colors.red);
      }
    }
  }
  
  // Generate suggestions
  if (analysis.foundFiles.length > 0) {
    analysis.suggestions.push('Move all environment variables to the root .env file');
    
    if (analysis.conflicts.length > 0) {
      analysis.suggestions.push('Resolve conflicts between duplicate variables');
    }
    
    // Check for client variables that need VITE_ prefix
    for (const [key, data] of analysis.variables) {
      if (data.file.startsWith('client/') && !key.startsWith('VITE_')) {
        analysis.suggestions.push(`Add VITE_ prefix to client variable: ${key} -> VITE_${key}`);
      }
    }
  }
  
  return analysis;
}

/**
 * Display analysis results
 */
function displayAnalysis(analysis) {
  if (analysis.foundFiles.length === 0) {
    log('✅ No redundant environment files found', colors.green);
    return;
  }
  
  log(`📄 Found ${analysis.foundFiles.length} environment files:`, colors.yellow);
  analysis.foundFiles.forEach(file => {
    log(`   - ${file}`, colors.yellow);
  });
  
  log(`🔧 Found ${analysis.variables.size} environment variables`, colors.cyan);
  
  if (analysis.conflicts.length > 0) {
    log(`⚠️ Found ${analysis.conflicts.length} variable conflicts:`, colors.red);
    analysis.conflicts.forEach(conflict => {
      log(`   ${conflict.key}:`, colors.red);
      conflict.files.forEach((file, index) => {
        log(`     ${file}: ${conflict.values[index]}`, colors.red);
      });
    });
  }
  
  if (analysis.suggestions.length > 0) {
    log('💡 Suggestions:', colors.cyan);
    analysis.suggestions.forEach(suggestion => {
      log(`   - ${suggestion}`, colors.cyan);
    });
  }
}

/**
 * Clean up redundant environment files
 */
function cleanupEnvironmentFiles(force = false) {
  log('🧹 Cleaning up redundant environment files...', colors.cyan);
  
  let cleanedCount = 0;
  
  for (const file of ENV_FILES_TO_CLEANUP) {
    if (existsSync(file.path)) {
      if (!force) {
        log(`⚠️ Would remove ${file.path}: ${file.reason}`, colors.yellow);
      } else {
        try {
          unlinkSync(file.path);
          log(`   ✅ Removed ${file.path}`, colors.green);
          cleanedCount++;
        } catch (error) {
          log(`   ❌ Failed to remove ${file.path}: ${error.message}`, colors.red);
        }
      }
    }
  }
  
  if (!force) {
    log('🔍 This was a dry run. Use --force to actually remove files.', colors.yellow);
  } else if (cleanedCount > 0) {
    log(`🧹 Cleaned up ${cleanedCount} redundant environment files`, colors.green);
  } else {
    log('🧹 No files were removed', colors.yellow);
  }
  
  return cleanedCount;
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  const force = args.includes('--force');
  const backup = !args.includes('--no-backup');
  
  log('🔧 Environment Cleanup Tool', colors.bright);
  log('============================', colors.bright);
  log('');
  
  // Check if root .env exists
  if (!existsSync('.env')) {
    log('⚠️ Root .env file not found!', colors.yellow);
    log('Please copy .env.example to .env first:', colors.yellow);
    log('   cp .env.example .env', colors.cyan);
    log('');
  }
  
  // Analyze existing files
  const analysis = analyzeEnvironmentFiles();
  displayAnalysis(analysis);
  log('');
  
  if (analysis.foundFiles.length === 0) {
    log('✅ No cleanup needed - environment is already unified!', colors.green);
    return;
  }
  
  // Create backup if requested
  if (backup && analysis.foundFiles.length > 0) {
    backupEnvironmentFiles();
    log('');
  }
  
  // Clean up files
  cleanupEnvironmentFiles(force);
  
  if (!force) {
    log('');
    log('To actually perform the cleanup:', colors.cyan);
    log('   node scripts/cleanup-env.js --force', colors.cyan);
    log('');
    log('To skip backup creation:', colors.cyan);
    log('   node scripts/cleanup-env.js --force --no-backup', colors.cyan);
  } else {
    log('');
    log('✅ Environment cleanup completed!', colors.green);
    log('All environment variables should now be configured in the root .env file.', colors.green);
  }
}

// Run the script
main().catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
