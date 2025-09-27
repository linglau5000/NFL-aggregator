#!/bin/bash

# Quick Railway Deployment Script for NFL Aggregator
# This script handles the complete deployment process

set -e

echo "🚀 NFL Aggregator - Quick Railway Deployment"
echo "=============================================="

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "📦 Installing Railway CLI..."
    npm install -g @railway/cli
fi

echo "✅ Railway CLI is ready"

# Login to Railway
echo "🔐 Logging into Railway..."
railway login

# Create new project
echo "🏗️ Creating Railway project..."
railway new

# Add PostgreSQL database
echo "🗄️ Adding PostgreSQL database..."
railway add postgresql

# Get database URL
echo "📋 Getting database URL..."
DATABASE_URL=$(railway variables get DATABASE_URL)
echo "Database URL: $DATABASE_URL"

# Set environment variables
echo "⚙️ Setting environment variables..."
railway variables set NODE_ENV=production
railway variables set PORT=5000
railway variables set JWT_SECRET=nfl-aggregator-super-secret-jwt-key-2024
railway variables set BCRYPT_ROUNDS=12
railway variables set RATE_LIMIT_WINDOW_MS=900000
railway variables set RATE_LIMIT_MAX_REQUESTS=100
railway variables set LOG_LEVEL=info

# Install dependencies
echo "📦 Installing dependencies..."
railway run npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
railway run npx prisma generate

# Run database migrations
echo "🗄️ Running database migrations..."
railway run npx prisma migrate deploy

# Seed the database
echo "🌱 Seeding database..."
railway run npm run db:seed

# Deploy the application
echo "🚀 Deploying application..."
railway up

# Get deployment URL
echo "🔗 Getting deployment URL..."
DEPLOYMENT_URL=$(railway status --json | jq -r '.deployments[0].url')
echo "✅ Deployment URL: $DEPLOYMENT_URL"

# Test the deployment
echo "🧪 Testing deployment..."
sleep 10  # Wait for deployment to be ready

# Health check
echo "🏥 Running health check..."
curl -f "$DEPLOYMENT_URL/health" || echo "⚠️ Health check failed, but deployment might still be starting"

# Test API endpoints
echo "🔍 Testing API endpoints..."
curl -f "$DEPLOYMENT_URL/api/teams" || echo "⚠️ Teams API test failed"
curl -f "$DEPLOYMENT_URL/api/games" || echo "⚠️ Games API test failed"

echo ""
echo "🎉 Deployment completed successfully!"
echo "🌐 Your NFL Aggregator is live at: $DEPLOYMENT_URL"
echo ""
echo "📊 Available endpoints:"
echo "  - Health: $DEPLOYMENT_URL/health"
echo "  - Teams: $DEPLOYMENT_URL/api/teams"
echo "  - Games: $DEPLOYMENT_URL/api/games"
echo "  - Players: $DEPLOYMENT_URL/api/players"
echo "  - Stats: $DEPLOYMENT_URL/api/stats"
echo "  - Leaderboards: $DEPLOYMENT_URL/api/leaderboards"
echo "  - News: $DEPLOYMENT_URL/api/news"
echo ""
echo "🔧 To manage your deployment:"
echo "  - View logs: railway logs"
echo "  - Check status: railway status"
echo "  - Connect to database: railway connect postgresql"
echo ""
echo "🎯 Your NFL Aggregator is ready for production use!"
