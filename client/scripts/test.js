#!/usr/bin/env node

/**
 * Test runner script for local development
 * Usage: node scripts/test.js [options]
 */

import { spawn } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

// Parse command line arguments
const args = process.argv.slice(2)
const options = {
  watch: args.includes('--watch') || args.includes('-w'),
  coverage: args.includes('--coverage') || args.includes('-c'),
  ui: args.includes('--ui'),
  verbose: args.includes('--verbose') || args.includes('-v'),
  silent: args.includes('--silent') || args.includes('-s'),
  pattern: args.find(arg => arg.startsWith('--pattern='))?.split('=')[1],
  help: args.includes('--help') || args.includes('-h')
}

function showHelp() {
  console.log(`
Test Runner Script

Usage: node scripts/test.js [options]

Options:
  -w, --watch      Run tests in watch mode
  -c, --coverage   Run tests with coverage report
  --ui             Run tests with UI interface
  -v, --verbose    Show verbose output
  -s, --silent     Run tests silently
  --pattern=<glob> Run tests matching pattern
  -h, --help       Show this help message

Examples:
  node scripts/test.js                    # Run all tests once
  node scripts/test.js --watch            # Run tests in watch mode
  node scripts/test.js --coverage         # Run tests with coverage
  node scripts/test.js --pattern="**/*.service.test.*"  # Run service tests only
`)
}

function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: projectRoot,
      stdio: 'inherit',
      shell: true,
      ...options
    })

    child.on('close', (code) => {
      if (code === 0) {
        resolve(code)
      } else {
        reject(new Error(`Command failed with exit code ${code}`))
      }
    })

    child.on('error', (error) => {
      reject(error)
    })
  })
}

async function runTests() {
  if (options.help) {
    showHelp()
    return
  }

  const vitestArgs = []

  // Add test mode
  if (options.watch) {
    vitestArgs.push('--watch')
  } else {
    vitestArgs.push('run')
  }

  // Add coverage
  if (options.coverage) {
    vitestArgs.push('--coverage')
  }

  // Add UI
  if (options.ui) {
    vitestArgs.push('--ui')
  }

  // Add verbosity
  if (options.verbose) {
    vitestArgs.push('--reporter=verbose')
  } else if (options.silent) {
    vitestArgs.push('--reporter=basic')
  }

  // Add pattern filter
  if (options.pattern) {
    vitestArgs.push(options.pattern)
  }

  try {
    console.log('🧪 Running tests...')
    console.log(`Command: npx vitest ${vitestArgs.join(' ')}`)
    console.log('')

    await runCommand('npx', ['vitest', ...vitestArgs])
    
    console.log('')
    console.log('✅ Tests completed successfully!')
    
    if (options.coverage) {
      console.log('📊 Coverage report generated in coverage/ directory')
    }
  } catch (error) {
    console.error('')
    console.error('❌ Tests failed:', error.message)
    process.exit(1)
  }
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Test runner interrupted')
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('\n🛑 Test runner terminated')
  process.exit(0)
})

// Run the tests
runTests().catch((error) => {
  console.error('❌ Unexpected error:', error)
  process.exit(1)
})
