#!/bin/bash

# Simple deployment script for Example React Monorepo
set -e

echo "🚀 Starting deployment process..."

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Main deployment function
deploy() {
    print_status "1. Installing dependencies..."
    if ! bun run install; then
        print_error "Installation failed"
        exit 1
    fi

    print_status "2. Running tests..."
    if ! bun run test; then
        print_error "Tests failed"
        exit 1
    fi

    print_status "3. Building applications..."
    if ! bun run build; then
        print_error "Build failed"
        exit 1
    fi

    print_status "🎉 Deployment ready!"
    echo "You can now:"
    echo "  - Run 'bun run start' to start production server"
    echo "  - Deploy the built files to your hosting platform"
}

# Run deployment
deploy
