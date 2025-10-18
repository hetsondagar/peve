#!/bin/bash

# Production Build Script for Peve
echo "🚀 Starting production build process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] && [ ! -d "backend" ] && [ ! -d "frontend" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Clean previous builds
print_status "Cleaning previous builds..."
rm -rf backend/dist
rm -rf frontend/dist
rm -rf node_modules
rm -rf backend/node_modules
rm -rf frontend/node_modules

# Install dependencies
print_status "Installing backend dependencies..."
cd backend
npm ci --only=production
if [ $? -ne 0 ]; then
    print_error "Failed to install backend dependencies"
    exit 1
fi

print_status "Building backend..."
npm run build
if [ $? -ne 0 ]; then
    print_error "Failed to build backend"
    exit 1
fi

cd ../frontend

print_status "Installing frontend dependencies..."
npm ci
if [ $? -ne 0 ]; then
    print_error "Failed to install frontend dependencies"
    exit 1
fi

print_status "Building frontend..."
npm run build:prod
if [ $? -ne 0 ]; then
    print_error "Failed to build frontend"
    exit 1
fi

cd ..

# Create production package
print_status "Creating production package..."
mkdir -p production-build
cp -r backend/dist production-build/backend
cp -r frontend/dist production-build/frontend
cp backend/package.json production-build/backend/
cp backend/production.env.template production-build/backend/.env.template
cp frontend/production.env.template production-build/frontend/.env.template
cp docker-compose.production.yml production-build/
cp DEPLOYMENT_GUIDE.md production-build/

# Create deployment archive
print_status "Creating deployment archive..."
tar -czf peve-production-$(date +%Y%m%d-%H%M%S).tar.gz production-build/

print_status "Production build completed successfully!"
print_status "Files created:"
echo "  - production-build/ (directory)"
echo "  - peve-production-$(date +%Y%m%d-%H%M%S).tar.gz (archive)"
echo ""
print_warning "Next steps:"
echo "  1. Review and update environment variables in production-build/"
echo "  2. Follow the DEPLOYMENT_GUIDE.md for deployment instructions"
echo "  3. Test the build locally using docker-compose.production.yml"
