#!/bin/bash

# NFL Aggregator Deployment Script
# This script helps deploy the application to various platforms

set -e

echo "🏈 NFL Aggregator Deployment Script"
echo "=================================="

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

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to run tests
run_tests() {
    print_status "Running tests..."
    if npm run test:ci; then
        print_success "All tests passed!"
    else
        print_error "Tests failed! Please fix before deploying."
        exit 1
    fi
}

# Function to run linting
run_linting() {
    print_status "Running linting..."
    if npm run lint:check; then
        print_success "Linting passed!"
    else
        print_error "Linting failed! Please fix before deploying."
        exit 1
    fi
}

# Function to run security audit
run_security_audit() {
    print_status "Running security audit..."
    if npm run security:audit; then
        print_success "Security audit passed!"
    else
        print_warning "Security issues found. Please review before deploying."
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
}

# Function to build application
build_app() {
    print_status "Building application..."
    if npm run build; then
        print_success "Application built successfully!"
    else
        print_error "Build failed!"
        exit 1
    fi
}

# Function to deploy to Vercel
deploy_vercel() {
    print_status "Deploying to Vercel..."
    
    if ! command_exists vercel; then
        print_error "Vercel CLI not found. Please install it first:"
        echo "npm i -g vercel"
        exit 1
    fi
    
    if vercel --prod; then
        print_success "Deployed to Vercel successfully!"
    else
        print_error "Vercel deployment failed!"
        exit 1
    fi
}

# Function to deploy to Netlify
deploy_netlify() {
    print_status "Deploying to Netlify..."
    
    if ! command_exists netlify; then
        print_error "Netlify CLI not found. Please install it first:"
        echo "npm i -g netlify-cli"
        exit 1
    fi
    
    if netlify deploy --prod; then
        print_success "Deployed to Netlify successfully!"
    else
        print_error "Netlify deployment failed!"
        exit 1
    fi
}

# Function to deploy to Heroku
deploy_heroku() {
    print_status "Deploying to Heroku..."
    
    if ! command_exists heroku; then
        print_error "Heroku CLI not found. Please install it first:"
        echo "Visit: https://devcenter.heroku.com/articles/heroku-cli"
        exit 1
    fi
    
    if git push heroku main; then
        print_success "Deployed to Heroku successfully!"
    else
        print_error "Heroku deployment failed!"
        exit 1
    fi
}

# Function to deploy with Docker
deploy_docker() {
    print_status "Building Docker image..."
    
    if ! command_exists docker; then
        print_error "Docker not found. Please install Docker first."
        exit 1
    fi
    
    if docker build -t nfl-aggregator .; then
        print_success "Docker image built successfully!"
        print_status "To run the container:"
        echo "docker run -p 5000:5000 nfl-aggregator"
    else
        print_error "Docker build failed!"
        exit 1
    fi
}

# Main deployment function
main() {
    local platform=$1
    
    print_status "Starting deployment process..."
    
    # Pre-deployment checks
    run_tests
    run_linting
    run_security_audit
    build_app
    
    # Deploy based on platform
    case $platform in
        "vercel")
            deploy_vercel
            ;;
        "netlify")
            deploy_netlify
            ;;
        "heroku")
            deploy_heroku
            ;;
        "docker")
            deploy_docker
            ;;
        *)
            print_error "Unknown platform: $platform"
            echo "Available platforms: vercel, netlify, heroku, docker"
            exit 1
            ;;
    esac
    
    print_success "Deployment completed successfully! 🎉"
}

# Show usage if no arguments
if [ $# -eq 0 ]; then
    echo "Usage: $0 <platform>"
    echo ""
    echo "Available platforms:"
    echo "  vercel  - Deploy to Vercel"
    echo "  netlify - Deploy to Netlify"
    echo "  heroku  - Deploy to Heroku"
    echo "  docker  - Build Docker image"
    echo ""
    echo "Example: $0 vercel"
    exit 1
fi

# Run main function with platform argument
main "$1"

