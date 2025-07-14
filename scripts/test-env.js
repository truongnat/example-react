#!/usr/bin/env node

/**
 * Environment Configuration Test Script
 * 
 * This script tests the unified environment configuration to ensure
 * all variables are properly loaded and accessible.
 */

import { colors, log } from './utils.js';
import { loadUnifiedEnv, validateEnvironment, getEnvironmentInfo, displayEnvironmentSummary } from './env-loader.js';

/**
 * Test environment loading
 */
function testEnvironmentLoading() {
  log('🧪 Testing Environment Loading', colors.cyan);
  log('==============================', colors.cyan);
  
  const result = loadUnifiedEnv({ verbose: true, validate: true });
  
  if (result.loaded) {
    log('✅ Environment loading: PASSED', colors.green);
  } else {
    log('❌ Environment loading: FAILED', colors.red);
    result.errors.forEach(error => log(`   ${error}`, colors.red));
    return false;
  }
  
  return true;
}

/**
 * Test client environment variables
 */
function testClientEnvironment() {
  log('\n🌐 Testing Client Environment Variables', colors.cyan);
  log('=======================================', colors.cyan);
  
  const clientValidation = validateEnvironment('client');
  
  if (clientValidation.isValid) {
    log('✅ Client environment validation: PASSED', colors.green);
  } else {
    log('❌ Client environment validation: FAILED', colors.red);
    log(`   Missing: ${clientValidation.missing.join(', ')}`, colors.red);
    return false;
  }
  
  // Test specific client variables
  const clientVars = [
    'VITE_SERVER_PORT',
    'VITE_CLIENT_PORT',
    'VITE_API_BASE_URL',
    'VITE_APP_NAME'
  ];
  
  let allPresent = true;
  
  for (const varName of clientVars) {
    const value = process.env[varName];
    if (value) {
      log(`   ✅ ${varName}: ${value}`, colors.green);
    } else {
      log(`   ❌ ${varName}: NOT SET`, colors.red);
      allPresent = false;
    }
  }
  
  return allPresent;
}

/**
 * Test server environment variables
 */
function testServerEnvironment() {
  log('\n🔧 Testing Server Environment Variables', colors.cyan);
  log('======================================', colors.cyan);
  
  const serverValidation = validateEnvironment('server');
  
  if (serverValidation.isValid) {
    log('✅ Server environment validation: PASSED', colors.green);
  } else {
    log('❌ Server environment validation: FAILED', colors.red);
    log(`   Missing: ${serverValidation.missing.join(', ')}`, colors.red);
    return false;
  }
  
  // Test specific server variables
  const serverVars = [
    'NODE_ENV',
    'PORT',
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
    'DATABASE_TYPE'
  ];
  
  let allPresent = true;
  
  for (const varName of serverVars) {
    const value = process.env[varName];
    if (value) {
      // Hide sensitive values
      const displayValue = varName.includes('SECRET') ? '***' : value;
      log(`   ✅ ${varName}: ${displayValue}`, colors.green);
    } else {
      log(`   ❌ ${varName}: NOT SET`, colors.red);
      allPresent = false;
    }
  }
  
  return allPresent;
}

/**
 * Test environment info
 */
function testEnvironmentInfo() {
  log('\n📊 Testing Environment Info', colors.cyan);
  log('============================', colors.cyan);
  
  try {
    const envInfo = getEnvironmentInfo();
    
    log(`   Environment: ${envInfo.nodeEnv}`, colors.blue);
    log(`   Port: ${envInfo.port}`, colors.blue);
    log(`   SSR Enabled: ${envInfo.enableSSR}`, colors.blue);
    log(`   Database: ${envInfo.databaseType}`, colors.blue);
    log(`   Development: ${envInfo.isDevelopment}`, colors.blue);
    log(`   Production: ${envInfo.isProduction}`, colors.blue);
    log(`   CI: ${envInfo.isCI}`, colors.blue);
    
    log('✅ Environment info: PASSED', colors.green);
    return true;
  } catch (error) {
    log(`❌ Environment info: FAILED - ${error.message}`, colors.red);
    return false;
  }
}

/**
 * Test security warnings
 */
function testSecurityWarnings() {
  log('\n🔒 Testing Security Warnings', colors.cyan);
  log('=============================', colors.cyan);
  
  const serverValidation = validateEnvironment('server');
  
  if (serverValidation.warnings.length > 0) {
    log('⚠️ Security warnings found:', colors.yellow);
    serverValidation.warnings.forEach(warning => {
      log(`   ${warning}`, colors.yellow);
    });
  } else {
    log('✅ No security warnings', colors.green);
  }
  
  return true;
}

/**
 * Test variable conflicts
 */
function testVariableConflicts() {
  log('\n🔍 Testing Variable Conflicts', colors.cyan);
  log('==============================', colors.cyan);
  
  // Check for common conflicts
  const conflicts = [];
  
  // Check if both old and new style variables exist
  const oldStyleVars = ['API_URL', 'SERVER_URL'];
  const newStyleVars = ['VITE_API_BASE_URL', 'VITE_WS_URL'];
  
  for (const oldVar of oldStyleVars) {
    if (process.env[oldVar]) {
      conflicts.push(`Old style variable ${oldVar} found - consider migrating to VITE_ prefix`);
    }
  }
  
  if (conflicts.length > 0) {
    log('⚠️ Potential conflicts found:', colors.yellow);
    conflicts.forEach(conflict => {
      log(`   ${conflict}`, colors.yellow);
    });
  } else {
    log('✅ No variable conflicts detected', colors.green);
  }
  
  return true;
}

/**
 * Main test function
 */
async function main() {
  log('🧪 Environment Configuration Test Suite', colors.bright);
  log('========================================', colors.bright);
  log('');
  
  const tests = [
    { name: 'Environment Loading', fn: testEnvironmentLoading },
    { name: 'Client Environment', fn: testClientEnvironment },
    { name: 'Server Environment', fn: testServerEnvironment },
    { name: 'Environment Info', fn: testEnvironmentInfo },
    { name: 'Security Warnings', fn: testSecurityWarnings },
    { name: 'Variable Conflicts', fn: testVariableConflicts },
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    try {
      const result = test.fn();
      if (result) {
        passed++;
      } else {
        failed++;
      }
    } catch (error) {
      log(`❌ ${test.name}: ERROR - ${error.message}`, colors.red);
      failed++;
    }
  }
  
  // Display summary
  log('\n📊 Test Summary', colors.bright);
  log('===============', colors.bright);
  log(`✅ Passed: ${passed}`, colors.green);
  log(`❌ Failed: ${failed}`, colors.red);
  log(`📊 Total: ${tests.length}`, colors.blue);
  
  if (failed === 0) {
    log('\n🎉 All tests passed! Environment configuration is working correctly.', colors.green);
    
    // Display environment summary
    log('\n📋 Environment Summary:', colors.cyan);
    displayEnvironmentSummary(false);
  } else {
    log('\n⚠️ Some tests failed. Please check your environment configuration.', colors.yellow);
    log('Make sure you have copied .env.example to .env and configured all required variables.', colors.yellow);
  }
  
  process.exit(failed > 0 ? 1 : 0);
}

// Run the tests
main().catch(error => {
  console.error('❌ Test suite failed:', error);
  process.exit(1);
});
