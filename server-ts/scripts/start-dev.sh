#!/bin/bash

# Development startup script

set -e

echo "🚀 Starting Development Environment"
echo "=================================="

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please update .env file with your configuration"
fi

# Load environment variables
export $(cat .env | grep -v '#' | awk '/=/ {print $1}')

DATABASE_TYPE=${DATABASE_TYPE:-sqlite}

echo "Environment: ${NODE_ENV:-development}"
echo "Database: $DATABASE_TYPE"
echo "Port: ${PORT:-5000}"

# Setup database if needed
case $DATABASE_TYPE in
    "postgres")
        echo "🗄️  Starting PostgreSQL..."
        cd docker
        docker-compose up -d postgres
        echo "Waiting for PostgreSQL to be ready..."
        sleep 5
        cd ..
        ;;
    "sqlite")
        echo "🗄️  Using SQLite database"
        mkdir -p ./data
        ;;
esac

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build if needed
if [ ! -d "dist" ]; then
    echo "🔨 Building application..."
    npm run build
fi

echo ""
echo "✅ Development environment ready!"
echo "🌐 Starting server..."
echo ""

# Start the development server
npm run dev
