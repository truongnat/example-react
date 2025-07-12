#!/bin/bash

# Simple CI script for Example React Monorepo
set -e

echo "🔄 Starting CI pipeline..."

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Main CI pipeline
main() {
    echo "🚀 Running CI pipeline..."

    print_success "1. Installing dependencies..."
    if ! bun run install; then
        print_error "Installation failed"
        exit 1
    fi

    print_success "2. Running tests..."
    if ! bun run test; then
        print_error "Tests failed"
        exit 1
    fi

    print_success "3. Building applications..."
    if ! bun run build; then
        print_error "Build failed"
        exit 1
    fi

    print_success "🎉 CI pipeline completed successfully!"
}

# Run CI pipeline
main
