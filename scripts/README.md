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

## 🔧 Technical Features

### ✅ **Cross-Platform Excellence**
- **Universal Compatibility**: Identical behavior on Windows, macOS, and Linux
- **Native Node.js**: Uses only built-in Node.js modules (no external dependencies)
- **Path Handling**: Proper path resolution for all operating systems
- **Process Management**: Cross-platform process spawning and signal handling

### 🎨 **Enhanced Developer Experience**
- **Colored Output**: Color-coded console output for better readability
- **Progress Indicators**: Real-time progress bars and status updates
- **Detailed Logging**: Comprehensive logging with different verbosity levels
- **Error Context**: Helpful error messages with troubleshooting suggestions
- **Interactive Prompts**: User-friendly confirmation dialogs

### 🔄 **Robust Process Management**
- **Signal Handling**: Proper SIGINT, SIGTERM, and SIGHUP handling
- **Concurrent Execution**: Efficient parallel process management
- **Exit Code Propagation**: Proper exit code handling and propagation
- **Resource Cleanup**: Automatic cleanup of resources on exit
- **Process Monitoring**: Health checks and automatic restart capabilities

### 📊 **Comprehensive Reporting**
- **Operation Summaries**: Detailed summaries for each operation
- **Performance Metrics**: Timing and resource usage statistics
- **Success/Failure Tracking**: Clear status reporting with actionable feedback
- **Next Steps**: Helpful suggestions for follow-up actions

## 💡 Usage Examples

### 🚀 **Complete Development Workflow**
```bash
# Fresh start development workflow
node scripts/clean.js --force     # Clean everything
node scripts/install.js           # Install dependencies
node scripts/seed.js              # Create demo data
node scripts/dev.js               # Start development servers

# Quick development restart
npm run clean && npm run setup && npm run dev
```

### 🏗️ **Production Deployment Workflow**
```bash
# Automated deployment pipeline
node scripts/deploy.js            # Complete deployment

# Manual deployment steps
node scripts/clean.js --force     # Clean build artifacts
node scripts/install.js           # Fresh dependency install
node scripts/test.js              # Run test suite
node scripts/build.js             # Build for production
node scripts/start.js             # Start production server
```

### 🧪 **Testing Workflows**
```bash
# Run all tests once
node scripts/test.js

# Continuous testing during development
cd client && npm run test:watch
cd server-ts && npm run test:watch

# Coverage analysis
cd client && npm run test:coverage
cd server-ts && npm run test:coverage
```

### 📦 **Package Manager Management**
```bash
# Switch from npm to bun
npm run pm:switch bun
npm run pm:clean                  # Clean old artifacts
npm run setup                     # Reinstall with bun

# Compare package managers
npm run pm:list                   # See available options
```

## ⚙️ Configuration & Arguments

### 🔧 **Command Line Arguments**

**Clean Script Options:**
```bash
node scripts/clean.js --force     # Skip confirmation prompts
node scripts/clean.js --help      # Show detailed help
node scripts/clean.js -f -h       # Short flags
```

**General Options (all scripts):**
```bash
--help, -h                        # Show help information
--verbose, -v                     # Verbose output
--quiet, -q                       # Minimal output
--dry-run                         # Show what would be done
```

### 🌍 **Environment Variables**

**CI/CD Integration:**
```bash
CI=true                           # Skips interactive prompts
NODE_ENV=production               # Sets production mode
FORCE_COLOR=1                     # Forces colored output in CI
```

**Package Manager Control:**
```bash
PREFERRED_PM=bun                  # Sets preferred package manager
PM_CACHE_DIR=/custom/cache        # Custom cache directory
```

### 📦 **Package Manager Integration**

**Automatic Detection:**
- **Primary**: Bun (fastest, modern features)
- **Fallback**: npm (universal compatibility)
- **Alternative**: yarn (workspace features)

**Smart Selection Logic:**
1. Check for lock files (bun.lock, package-lock.json, yarn.lock)
2. Respect `PREFERRED_PM` environment variable
3. Fall back to npm if others unavailable
4. Validate package manager installation

## 🛠️ **Advanced Features**

### 🔍 **Error Handling & Recovery**
```bash
# Automatic error recovery
node scripts/install.js           # Auto-retries on network failures
node scripts/build.js             # Suggests fixes for build failures
node scripts/test.js              # Provides test failure analysis
```

### 📊 **Performance Monitoring**
- **Execution Time**: Tracks and reports script execution time
- **Memory Usage**: Monitors memory consumption during operations
- **Network Activity**: Reports download/upload statistics
- **Disk Usage**: Shows space usage before/after operations

### 🔄 **Extensibility Framework**
```javascript
// Adding new scripts follows this pattern:
import { createScript, logger, colors } from './utils.js';

const myScript = createScript({
  name: 'my-feature',
  description: 'Custom feature implementation',
  async execute(args) {
    logger.info(colors.blue('Starting custom feature...'));
    // Implementation here
  }
});

export default myScript;
```

## 🚨 **Troubleshooting Guide**

### 🔧 **Common Issues & Solutions**

**Permission Errors (Unix/Linux/macOS):**
```bash
# Make scripts executable
chmod +x scripts/*.js

# Or run with node explicitly
node scripts/install.js
```

**Missing Dependencies:**
```bash
# Complete dependency reset
node scripts/clean.js --force
node scripts/install.js

# Check for corrupted node_modules
rm -rf node_modules package-lock.json
npm install
```

**Build Failures:**
```bash
# Individual package debugging
cd client && npm run build --verbose
cd server-ts && npm run build --verbose

# Check for TypeScript errors
cd client && npm run type-check
cd server-ts && npm run type-check
```

**Port Conflicts:**
```bash
# Check for running processes
lsof -i :3000  # Server port
lsof -i :5173  # Client port

# Kill conflicting processes
pkill -f "node.*3000"
pkill -f "vite.*5173"
```

### 📚 **Getting Detailed Help**

**Script-Specific Help:**
```bash
node scripts/install.js --help    # Installation help
node scripts/dev.js --help        # Development help
node scripts/test.js --help       # Testing help
node scripts/build.js --help      # Build help
node scripts/deploy.js --help     # Deployment help
```

**Verbose Debugging:**
```bash
node scripts/dev.js --verbose     # Detailed development logs
DEBUG=* node scripts/test.js      # Debug mode for testing
```

## 🌟 **Advantages Over Traditional Shell Scripts**

### 💪 **Technical Superiority**
1. **🌍 True Cross-Platform**: Identical behavior across all operating systems
2. **🔧 Maintainable Code**: JavaScript is more readable and debuggable than shell scripts
3. **🛡️ Robust Error Handling**: Comprehensive error handling with stack traces
4. **📊 Rich Feedback**: Detailed progress reporting and user feedback
5. **🔄 Process Management**: Advanced process lifecycle management
6. **🧪 Testable**: Scripts can be unit tested and validated
7. **📦 Dependency Management**: Smart package manager detection and switching
8. **🎨 User Experience**: Enhanced UX with colors, progress bars, and clear messaging

### 🚀 **Development Benefits**
- **Faster Onboarding**: New developers can start immediately on any OS
- **Consistent Behavior**: No surprises between development environments
- **Better Debugging**: Clear error messages and troubleshooting guidance
- **Extensible Architecture**: Easy to add new features and capabilities
- **CI/CD Ready**: Works seamlessly in automated environments
