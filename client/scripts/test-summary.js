#!/usr/bin/env node

/**
 * Test Summary Generator
 * Generates a comprehensive summary of test coverage and results
 */

import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

function readJsonFile(filePath) {
  try {
    if (!existsSync(filePath)) {
      return null
    }
    const content = readFileSync(filePath, 'utf8')
    return JSON.parse(content)
  } catch (error) {
    console.warn(`Warning: Could not read ${filePath}:`, error.message)
    return null
  }
}

function generateTestSummary() {
  console.log('📊 Test Coverage Summary')
  console.log('=' .repeat(50))
  console.log('')

  // Read package.json to get project info
  const packageJson = readJsonFile(join(projectRoot, 'package.json'))
  if (packageJson) {
    console.log(`Project: ${packageJson.name} v${packageJson.version}`)
    console.log('')
  }

  // Test file statistics
  const testFiles = [
    'src/test/setup.ts',
    'src/test/test-utils.tsx',
    'src/services/__tests__/auth.service.test.ts',
    'src/services/__tests__/chat.service.test.ts',
    'src/services/__tests__/socket.service.test.ts',
    'src/services/__tests__/todo.service.test.ts',
    'src/services/__tests__/user.service.test.ts',
    'src/hooks/__tests__/useAuth.test.ts',
    'src/hooks/__tests__/useChat.test.ts',
    'src/hooks/__tests__/useTodos.test.ts',
    'src/hooks/__tests__/useUsers.test.ts',
    'src/hooks/__tests__/useDebounce.test.ts',
    'src/stores/__tests__/authStore.test.ts',
    'src/stores/__tests__/chatStore.test.ts',
    'src/lib/__tests__/http-client.test.ts',
    'src/lib/__tests__/error-handler.test.ts',
    'src/lib/__tests__/config.test.ts',
    'src/lib/__tests__/utils.test.ts',
    'src/components/__tests__/AuthRequired.test.tsx',
    'src/components/__tests__/Navigation.test.tsx',
    'src/components/__tests__/ConnectionStatus.test.tsx',
    'src/components/chat/__tests__/MessageInput.test.tsx',
    'src/routes/__tests__/profile.test.tsx',
    'src/routes/__tests__/todo.test.tsx'
  ]

  let existingFiles = 0
  let missingFiles = []

  testFiles.forEach(file => {
    const fullPath = join(projectRoot, file)
    if (existsSync(fullPath)) {
      existingFiles++
    } else {
      missingFiles.push(file)
    }
  })

  console.log('📁 Test Files Overview:')
  console.log(`  ✅ Existing test files: ${existingFiles}`)
  console.log(`  ❌ Missing test files: ${missingFiles.length}`)
  console.log('')

  if (missingFiles.length > 0) {
    console.log('📋 Missing Test Files:')
    missingFiles.forEach(file => {
      console.log(`  - ${file}`)
    })
    console.log('')
  }

  // Test categories
  const categories = {
    'Services': testFiles.filter(f => f.includes('services/__tests__')),
    'Hooks': testFiles.filter(f => f.includes('hooks/__tests__')),
    'Stores': testFiles.filter(f => f.includes('stores/__tests__')),
    'Utils/Lib': testFiles.filter(f => f.includes('lib/__tests__')),
    'Components': testFiles.filter(f => f.includes('components/__tests__') || f.includes('components/chat/__tests__')),
    'Routes': testFiles.filter(f => f.includes('routes/__tests__')),
    'Setup': testFiles.filter(f => f.includes('test/'))
  }

  console.log('📊 Test Coverage by Category:')
  Object.entries(categories).forEach(([category, files]) => {
    const existing = files.filter(f => existsSync(join(projectRoot, f))).length
    const total = files.length
    const percentage = total > 0 ? Math.round((existing / total) * 100) : 0
    const status = percentage === 100 ? '✅' : percentage >= 80 ? '🟡' : '❌'
    
    console.log(`  ${status} ${category}: ${existing}/${total} (${percentage}%)`)
  })
  console.log('')

  // Test commands available
  console.log('🚀 Available Test Commands:')
  console.log('  npm test              - Run tests in watch mode')
  console.log('  npm run test:ci       - Run tests once (CI mode)')
  console.log('  npm run test:coverage - Run tests with coverage')
  console.log('  npm run test:ui       - Run tests with UI interface')
  console.log('  node scripts/test.js  - Custom test runner with options')
  console.log('')

  // Coverage information
  const coverageFile = join(projectRoot, 'coverage/coverage-summary.json')
  const coverage = readJsonFile(coverageFile)
  
  if (coverage && coverage.total) {
    console.log('📈 Coverage Summary:')
    const { lines, statements, functions, branches } = coverage.total
    console.log(`  Lines: ${lines.pct}%`)
    console.log(`  Statements: ${statements.pct}%`)
    console.log(`  Functions: ${functions.pct}%`)
    console.log(`  Branches: ${branches.pct}%`)
    console.log('')
  } else {
    console.log('📈 Coverage Summary:')
    console.log('  Run "npm run test:coverage" to generate coverage report')
    console.log('')
  }

  // Recommendations
  console.log('💡 Recommendations:')
  if (missingFiles.length > 0) {
    console.log('  - Complete missing test files for full coverage')
  }
  if (existingFiles / testFiles.length < 0.8) {
    console.log('  - Aim for at least 80% test file coverage')
  }
  console.log('  - Run tests regularly during development')
  console.log('  - Use watch mode for continuous testing')
  console.log('  - Review coverage reports to identify gaps')
  console.log('')

  console.log('🎯 Quick Start:')
  console.log('  npm test                    # Start developing with tests')
  console.log('  npm run test:coverage       # Check current coverage')
  console.log('  node scripts/test.js --help # See all test options')
  console.log('')
}

// Run the summary
generateTestSummary()
