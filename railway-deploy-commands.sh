#!/bin/bash

# NFL Aggregator - Railway Deployment Commands
# Run these commands in order

echo "🚀 NFL Aggregator - Railway Deployment"
echo "======================================"

echo ""
echo "Step 1: Login to Railway (run this first)"
echo "railway login"
echo ""

echo "Step 2: Create new project (run this second)"
echo "railway new"
echo ""

echo "Step 3: Add PostgreSQL database (run this third)"
echo "railway add postgresql"
echo ""

echo "Step 4: Set environment variables (run these commands)"
echo "railway variables --set NODE_ENV=production"
echo "railway variables --set PORT=5000"
echo "railway variables --set JWT_SECRET=nfl-aggregator-super-secret-jwt-key-2024"
echo "railway variables --set BCRYPT_ROUNDS=12"
echo "railway variables --set RATE_LIMIT_WINDOW_MS=900000"
echo "railway variables --set RATE_LIMIT_MAX_REQUESTS=100"
echo "railway variables --set LOG_LEVEL=info"
echo ""

echo "Step 5: Install dependencies"
echo "railway run npm install"
echo ""

echo "Step 6: Setup database"
echo "railway run npx prisma generate"
echo "railway run npx prisma migrate deploy"
echo "railway run npm run db:seed"
echo ""

echo "Step 7: Deploy application"
echo "railway up"
echo ""

echo "Step 8: Get your live URL"
echo "railway status"
echo ""

echo "🎉 Your NFL Aggregator will be live!"
echo "Test with: curl https://your-app.railway.app/health"
