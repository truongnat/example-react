# Cross-Platform Development Scripts 2025

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18+-green?logo=node.js" alt="Node.js" />
  <img src="https://img.shields.io/badge/Cross_Platform-✅-brightgreen" alt="Cross Platform" />
  <img src="https://img.shields.io/badge/JavaScript-ES2022-yellow?logo=javascript" alt="JavaScript" />
</p>

This directory contains **cross-platform JavaScript scripts** for managing the monorepo efficiently. These scripts replace OS-specific shell commands with Node.js-based solutions that work consistently across **Windows**, **macOS**, and **Linux**.

## 🎯 Design Philosophy

- **🌍 Universal Compatibility**: Works identically on all operating systems
- **🔧 Zero Dependencies**: Uses only Node.js built-in modules
- **🎨 Enhanced UX**: Colored output, progress indicators, and clear feedback
- **🛡️ Robust Error Handling**: Comprehensive error handling with helpful messages
- **⚡ Performance Optimized**: Efficient process management and resource usage

## 📜 Available Scripts

### 🔧 **Installation & Setup**
```bash
# Install all dependencies across the monorepo
node scripts/install.js
npm run setup                    # Alias via package.json
```
**Features:**
- 📦 Installs dependencies for all packages (client, server, root)
- 🔒 Handles frozen lockfiles automatically
- 🏃‍♂️ Supports multiple package managers (npm, yarn, bun)
- 🔄 Detects and uses the appropriate package manager
- 📊 Provides installation progress and summary

### 🚀 **Development Server**
```bash
# Start both client and server in development mode
node scripts/dev.js
npm run dev                      # Alias via package.json
```
**Features:**
- 🔄 Concurrent client and server startup
- 🎨 Colored output for better visibility (client=blue, server=green)
- ⚡ Hot reload for both frontend and backend
- 🛑 Graceful shutdown with Ctrl+C
- 🔍 Process monitoring and restart on crashes
- 📱 Network access information display

### 🧪 **Testing Suite**
```bash
# Run comprehensive test suite
node scripts/test.js
npm run test                     # Alias via package.json
```
**Features:**
- 🧪 Runs tests for all packages in the monorepo
- 📊 Detailed test summary with pass/fail counts
- ⚡ Fails fast if any test suite fails
- 📈 Coverage reporting integration
- 🔄 Supports watch mode for individual packages
- 🎯 Parallel test execution for speed

### 🏗️ **Production Build**
```bash
# Build all packages for production
node scripts/build.js
npm run build                    # Alias via package.json
```
**Features:**
- 🏗️ Builds all packages for production deployment
- 📦 Optimized bundles with tree shaking
- 📊 Build summary with file sizes and timing
- 🔍 Bundle analysis and optimization suggestions
- ✅ Build artifact verification
- 🗜️ Automatic compression and minification

### 🌟 **Production Server**
```bash
# Start production server
node scripts/start.js
npm run start                    # Alias via package.json
```
**Features:**
- 🚀 Starts the production server
- ✅ Checks for required build artifacts
- 🛡️ Handles graceful shutdown signals (SIGTERM, SIGINT)
- 📊 Process monitoring and health checks
- 🔄 Automatic restart on crashes
- 📝 Production logging configuration

### 🚀 **Complete Deployment Pipeline**
```bash
# Full deployment workflow
node scripts/deploy.js
npm run deploy                   # Alias via package.json
```
**Features:**
- 🔄 Complete CI/CD pipeline simulation
- 🧪 Runs tests before deployment
- 🏗️ Builds optimized production bundles
- ✅ Validates deployment artifacts
- 📋 Provides deployment checklist and instructions
- 🔍 Pre-deployment health checks

### 🧹 **Cleanup & Maintenance**
```bash
# Clean build artifacts and dependencies
node scripts/clean.js
npm run clean                    # Alias via package.json

# Force cleanup without confirmation
node scripts/clean.js --force
npm run clean -- --force
```
**Features:**
- 🗑️ Removes build artifacts and dependencies
- 🌍 Cross-platform file/directory removal
- 🤔 Interactive confirmation (unless --force flag)
- 📊 Shows space freed up after cleanup
- 🔄 Comprehensive cleanup of caches and temporary files
- 🛡️ Safe cleanup with backup options

### 📦 **Package Manager Utilities**
```bash
# List available package managers
node scripts/package-manager.js list
npm run pm:list

# Switch package manager
node scripts/package-manager.js switch yarn
npm run pm:switch yarn

# Clean package manager artifacts
node scripts/package-manager.js clean
npm run pm:clean
```
**Features:**
- 🔄 Switch between npm, yarn, and bun seamlessly
- 🧹 Clean package manager specific files
- 📊 Compare package manager performance
- 🔍 Detect and validate package manager installations

### 🌱 **Demo Data Seeding**
```bash
# Seed demo data for development
node scripts/seed.js
npm run seed

# Force reseed with fresh data
node scripts/seed.js --force
npm run seed:force
```
**Features:**
- 👤 Creates demo user account
- 📝 Generates sample todos and chat data
- 🔄 Idempotent seeding (won't duplicate data)
- 🗑️ Force option to recreate fresh demo data
- 📊 Seeding progress and summary

## Script Features

### ✅ Cross-Platform Compatibility
- Works on Windows, macOS, and Linux
- Uses Node.js built-in modules
- No OS-specific shell commands

### 🎨 Enhanced User Experience
- Colored console output
- Progress indicators
- Detailed error messages
- Graceful error handling

### 🔄 Process Management
- Proper signal handling (SIGINT, SIGTERM)
- Concurrent process management
- Exit code propagation

### 📊 Comprehensive Reporting
- Detailed summaries for each operation
- Success/failure status tracking
- Helpful next-step suggestions

## Usage Examples

### Development Workflow
```bash
# Clean start
node scripts/clean.js --force
node scripts/install.js
node scripts/dev.js
```

### Production Deployment
```bash
# Full deployment pipeline
node scripts/deploy.js

# Manual steps
node scripts/build.js
node scripts/test.js
node scripts/start.js
```

### Testing Only
```bash
# Run all tests
node scripts/test.js

# For watch mode, use individual package scripts
cd client && npm run test:watch
cd server-ts && npm run test:watch
```

## Command Line Arguments

### Clean Script
- `--force` or `-f`: Skip confirmation prompt
- `--help` or `-h`: Show help information

### General
- `--help` or `-h`: Available for all scripts

## Environment Variables

The scripts respect the following environment variables:
- `CI`: When set, skips interactive prompts
- `NODE_ENV`: Used by individual packages

## Integration with Package Managers

These scripts are designed to work with:
- **Bun** (primary)
- **npm** (fallback)
- **yarn** (fallback)

The scripts automatically detect and use the appropriate package manager commands.

## Error Handling

All scripts include comprehensive error handling:
- Detailed error messages
- Proper exit codes
- Cleanup on failure
- Helpful troubleshooting suggestions

## Extending the Scripts

To add new scripts:
1. Create a new `.js` file in the `scripts` directory
2. Follow the existing pattern for colors, logging, and error handling
3. Add the script to `package.json` scripts section
4. Update this README

## Troubleshooting

### Common Issues

**Permission Errors**
```bash
# Make scripts executable (Unix-like systems)
chmod +x scripts/*.js
```

**Missing Dependencies**
```bash
# Reinstall all dependencies
node scripts/clean.js --force
node scripts/install.js
```

**Build Failures**
```bash
# Check individual package builds
cd client && npm run build
cd server-ts && npm run build
```

### Getting Help

Each script supports the `--help` flag:
```bash
node scripts/install.js --help
node scripts/dev.js --help
node scripts/test.js --help
# ... etc
```

## Benefits Over Shell Scripts

1. **Cross-Platform**: Works identically on all operating systems
2. **Maintainable**: JavaScript is more readable and maintainable than shell scripts
3. **Robust**: Better error handling and process management
4. **Consistent**: Same behavior regardless of shell or OS
5. **Extensible**: Easy to add new features and functionality
