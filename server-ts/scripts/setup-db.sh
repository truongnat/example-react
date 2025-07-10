#!/bin/bash

# Database setup script for different environments

set -e

echo "🗄️  Database Setup Script"
echo "========================"

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '#' | awk '/=/ {print $1}')
fi

DATABASE_TYPE=${DATABASE_TYPE:-sqlite}

echo "Database type: $DATABASE_TYPE"

case $DATABASE_TYPE in
    "sqlite")
        echo "Setting up SQLite database..."
        
        # Create data directory
        mkdir -p ./data
        
        echo "✅ SQLite setup complete"
        echo "Database will be created at: ./data/database.sqlite"
        ;;
        
    "postgres")
        echo "Setting up PostgreSQL database..."
        
        # Check if Docker is available
        if ! command -v docker &> /dev/null; then
            echo "❌ Docker is required for PostgreSQL setup"
            exit 1
        fi
        
        # Start PostgreSQL container
        echo "Starting PostgreSQL container..."
        cd docker
        docker-compose up -d postgres
        
        # Wait for PostgreSQL to be ready
        echo "Waiting for PostgreSQL to be ready..."
        sleep 10
        
        # Check if PostgreSQL is healthy
        if docker-compose exec postgres pg_isready -U ${POSTGRES_USERNAME:-postgres} -d ${POSTGRES_DATABASE:-example_db}; then
            echo "✅ PostgreSQL setup complete"
            echo "Connection: postgresql://${POSTGRES_USERNAME:-postgres}:${POSTGRES_PASSWORD:-password}@localhost:${POSTGRES_PORT:-5432}/${POSTGRES_DATABASE:-example_db}"
        else
            echo "❌ PostgreSQL setup failed"
            exit 1
        fi
        
        cd ..
        ;;
        
    "supabase")
        echo "Setting up Supabase connection..."
        
        if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
            echo "❌ Supabase configuration missing"
            echo "Please set SUPABASE_URL, SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY in your .env file"
            exit 1
        fi
        
        echo "✅ Supabase configuration found"
        echo "URL: $SUPABASE_URL"
        ;;
        
    "mongodb")
        echo "Setting up MongoDB (legacy support)..."
        
        if [ -z "$MONGO_URL" ]; then
            echo "❌ MongoDB URL missing"
            echo "Please set MONGO_URL in your .env file"
            exit 1
        fi
        
        echo "✅ MongoDB configuration found"
        echo "URL: $MONGO_URL"
        ;;
        
    *)
        echo "❌ Unsupported database type: $DATABASE_TYPE"
        echo "Supported types: sqlite, postgres, supabase, mongodb"
        exit 1
        ;;
esac

echo ""
echo "🎉 Database setup completed successfully!"
echo "You can now start the application with: npm run dev"
