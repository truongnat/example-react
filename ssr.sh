#!/bin/bash

# SSR Setup Script
# This script builds the client and sets up SSR serving

set -e

echo "🚀 Setting up SSR (Server-Side Rendering)..."
echo "============================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "client" ] || [ ! -d "server-ts" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Step 1: Build the client
print_status "Building client application..."
cd client

if ! command -v bun &> /dev/null; then
    print_error "Bun is not installed. Please install Bun first."
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    print_status "Installing client dependencies..."
    bun install
fi

# Build the client
print_status "Building client for production..."
bun run build

if [ ! -d "dist" ]; then
    print_error "Client build failed - dist directory not found"
    exit 1
fi

print_success "Client build completed"

# Step 2: Copy build files to server
cd ..
print_status "Copying build files to server..."

# Create build directory in server if it doesn't exist
mkdir -p server-ts/build

# Copy all files from client/dist to server-ts/build
cp -r client/dist/* server-ts/build/

print_success "Build files copied to server-ts/build/"

# Step 3: Check/Create .env file for server
print_status "Configuring server environment..."

cd server-ts

# Check if .env exists, if not copy from .env.example
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        print_success "Created .env file from .env.example"
    else
        print_warning ".env.example not found, creating basic .env file"
        cat > .env << EOF
# Server Configuration
PORT=5000
NODE_ENV=production
IS_SSR=true

# CORS Configuration
CORS_ALLOW_ORIGINS=http://localhost:3000,http://localhost:5173

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Database Configuration
DATABASE_TYPE=sqlite
SQLITE_DATABASE_PATH=./data/database.sqlite
EOF
    fi
else
    # Update existing .env to enable SSR
    if grep -q "IS_SSR=" .env; then
        sed -i.bak 's/IS_SSR=.*/IS_SSR=true/' .env
        print_success "Updated IS_SSR=true in existing .env file"
    else
        echo "IS_SSR=true" >> .env
        print_success "Added IS_SSR=true to .env file"
    fi
fi

# Step 4: Install server dependencies if needed
if [ ! -d "node_modules" ]; then
    print_status "Installing server dependencies..."
    bun install
fi

# Step 5: Build server if needed
if [ ! -d "dist" ]; then
    print_status "Building server..."
    bun run build
fi

cd ..

# Step 6: Display completion message
echo ""
print_success "SSR setup completed successfully!"
echo ""
echo "📋 What was done:"
echo "  ✅ Built client application"
echo "  ✅ Copied build files to server-ts/build/"
echo "  ✅ Configured server environment (IS_SSR=true)"
echo "  ✅ Installed dependencies"
echo ""
echo "🚀 To start the SSR server:"
echo "  cd server-ts && bun run start"
echo ""
echo "🌐 The server will serve the React app at:"
echo "  http://localhost:5000"
echo ""
echo "📝 Note: API endpoints are available at:"
echo "  http://localhost:5000/api/*"
echo ""
print_warning "Make sure to set the correct API base URL in your client environment"
print_warning "For SSR, the client should use the same domain as the server"
