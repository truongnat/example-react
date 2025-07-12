# Example React Monorepo Makefile

.PHONY: help install dev test deploy build start clean

# Default target
help:
	@echo "Available commands:"
	@echo "  install - Install all dependencies for client and server"
	@echo "  dev     - Start development servers (client + server)"
	@echo "  test    - Run all tests (client + server)"
	@echo "  deploy  - Build and test everything for deployment"
	@echo "  build   - Build client and server for production"
	@echo "  start   - Start production server"
	@echo "  clean   - Clean all dependencies and build artifacts"

# 1. Install for all
install:
	@echo "📦 Installing all dependencies..."
	bun run install

# 2. Dev for all
dev:
	@echo "🚀 Starting development servers..."
	bun run dev

# 3. Test for all
test:
	@echo "🧪 Running all tests..."
	bun run test

# 4. Deploy for all
deploy:
	@echo "🚢 Preparing deployment..."
	bun run deploy

# Additional useful commands
build:
	@echo "🔨 Building for production..."
	bun run build

start:
	@echo "▶️  Starting production server..."
	bun run start

clean:
	@echo "🧹 Cleaning everything..."
	bun run clean
