#!/bin/bash

# NFL Aggregator - Step-by-Step Railway Deployment
# Run each command one by one

echo "🚀 NFL Aggregator - Railway Deployment"
echo "======================================"
echo ""
echo "Follow these steps in order:"
echo ""

echo "Step 1: Login to Railway"
echo "Run: railway login"
echo "This will open a browser - login with your GitHub account"
echo "Press Enter when done..."
read

echo ""
echo "Step 2: Create new Railway project"
echo "Run: railway new"
echo "Choose project name: nfl-aggregator"
echo "Choose region: closest to you"
echo "Press Enter when done..."
read

echo ""
echo "Step 3: Add PostgreSQL database"
echo "Run: railway add postgresql"
echo "Press Enter when done..."
read

echo ""
echo "Step 4: Set environment variables"
echo "Running: railway variables set NODE_ENV=production"
railway variables set NODE_ENV=production

echo "Running: railway variables set PORT=5000"
railway variables set PORT=5000

echo "Running: railway variables set JWT_SECRET=nfl-aggregator-super-secret-jwt-key-2024"
railway variables set JWT_SECRET=nfl-aggregator-super-secret-jwt-key-2024

echo "Running: railway variables set BCRYPT_ROUNDS=12"
railway variables set BCRYPT_ROUNDS=12

echo "Running: railway variables set RATE_LIMIT_WINDOW_MS=900000"
railway variables set RATE_LIMIT_WINDOW_MS=900000

echo "Running: railway variables set RATE_LIMIT_MAX_REQUESTS=100"
railway variables set RATE_LIMIT_MAX_REQUESTS=100

echo "Running: railway variables set LOG_LEVEL=info"
railway variables set LOG_LEVEL=info

echo ""
echo "Step 5: Install dependencies"
echo "Running: railway run npm install"
railway run npm install

echo ""
echo "Step 6: Setup database"
echo "Running: railway run npx prisma generate"
railway run npx prisma generate

echo "Running: railway run npx prisma migrate deploy"
railway run npx prisma migrate deploy

echo "Running: railway run npm run db:seed"
railway run npm run db:seed

echo ""
echo "Step 7: Deploy application"
echo "Running: railway up"
railway up

echo ""
echo "Step 8: Get your live URL"
echo "Running: railway status"
railway status

echo ""
echo "🎉 Deployment completed!"
echo "Your NFL Aggregator should now be live!"
echo ""
echo "Test your deployment:"
echo "curl https://your-app.railway.app/health"
echo "curl https://your-app.railway.app/api/teams"
