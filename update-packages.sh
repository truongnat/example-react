#!/bin/bash

# Script to update all packages to latest versions using Bun
# Usage: ./update-packages.sh

set -e  # Exit on any error

echo "🚀 Starting package updates with Bun..."
echo "========================================"

# Function to update packages in a directory
update_packages() {
    local dir=$1
    local name=$2
    
    echo ""
    echo "📦 Updating packages in $name ($dir)..."
    echo "----------------------------------------"
    
    if [ -d "$dir" ]; then
        cd "$dir"
        
        # Check if package.json exists
        if [ -f "package.json" ]; then
            echo "✅ Found package.json in $dir"
            
            # Remove existing lock file to ensure fresh install
            if [ -f "bun.lock" ]; then
                echo "🗑️  Removing old bun.lock..."
                rm bun.lock
            fi
            
            # Remove node_modules to ensure clean install
            if [ -d "node_modules" ]; then
                echo "🗑️  Removing old node_modules..."
                rm -rf node_modules
            fi
            
            # Update all packages to latest
            echo "⬆️  Updating all packages to latest versions..."
            bun update
            
            # Install any missing dependencies
            echo "📥 Installing dependencies..."
            bun install
            
            echo "✅ $name packages updated successfully!"
        else
            echo "❌ No package.json found in $dir"
        fi
        
        cd ..
    else
        echo "❌ Directory $dir not found"
    fi
}

# Save current directory
ORIGINAL_DIR=$(pwd)

# Update client packages
update_packages "client" "Client (Frontend)"

# Update server packages
update_packages "server" "Server (Backend)"

# Return to original directory
cd "$ORIGINAL_DIR"

echo ""
echo "🎉 All packages updated successfully!"
echo "========================================"
echo ""
echo "📋 Next steps:"
echo "1. Test the client: cd client && bun run dev"
echo "2. Test the server: cd server && bun run dev"
echo "3. Check for any breaking changes in updated packages"
echo ""
echo "⚠️  Note: Some packages might have breaking changes."
echo "   Please review the changelog of major version updates."
