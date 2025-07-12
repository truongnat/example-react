# Project Scripts

This directory contains cross-platform JavaScript scripts for managing the monorepo. These scripts replace OS-specific shell commands with Node.js-based solutions that work consistently across Windows, macOS, and Linux.

## Available Scripts

### 🔧 Installation
```bash
node scripts/install.js
# or via package.json
npm run install
```
- Installs dependencies for all packages in the monorepo
- Handles frozen lockfiles automatically
- Works with Bun package manager

### 🚀 Development
```bash
node scripts/dev.js
# or via package.json
npm run dev
```
- Starts both client and server in development mode concurrently
- Handles graceful shutdown with Ctrl+C
- Provides colored output for better visibility

### 🧪 Testing
```bash
node scripts/test.js
# or via package.json
npm run test
```
- Runs tests for all packages in the monorepo
- Provides detailed test summary
- Fails fast if any test suite fails

### 🏗️ Building
```bash
node scripts/build.js
# or via package.json
npm run build
```
- Builds all packages for production
- Provides build summary and status
- Optimized for production deployment

### 🌟 Production Start
```bash
node scripts/start.js
# or via package.json
npm run start
```
- Starts the production server
- Checks for required build artifacts
- Handles graceful shutdown signals

### 🚀 Deployment
```bash
node scripts/deploy.js
# or via package.json
npm run deploy
```
- Complete deployment pipeline
- Runs build and test in sequence
- Provides deployment instructions
- Checks deployment artifacts

### 🧹 Cleanup
```bash
node scripts/clean.js
# or via package.json
npm run clean
```
- Removes build artifacts and dependencies
- Cross-platform file/directory removal
- Interactive confirmation (unless --force flag)
- Comprehensive cleanup of cache and temporary files

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
