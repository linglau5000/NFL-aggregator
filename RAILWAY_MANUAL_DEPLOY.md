# 🚀 Manual Railway Deployment Guide

## Step 1: Login to Railway

Run this command and follow the prompts:
```bash
railway login
```

## Step 2: Create New Project

```bash
railway new
```
- Choose a name for your project (e.g., "nfl-aggregator")
- Select the region closest to you

## Step 3: Add PostgreSQL Database

```bash
railway add postgresql
```

## Step 4: Set Environment Variables

```bash
# Set production environment
railway variables set NODE_ENV=production
railway variables set PORT=5000
railway variables set JWT_SECRET=nfl-aggregator-super-secret-jwt-key-2024
railway variables set BCRYPT_ROUNDS=12
railway variables set RATE_LIMIT_WINDOW_MS=900000
railway variables set RATE_LIMIT_MAX_REQUESTS=100
railway variables set LOG_LEVEL=info
```

## Step 5: Install Dependencies

```bash
railway run npm install
```

## Step 6: Setup Database

```bash
# Generate Prisma client
railway run npx prisma generate

# Run database migrations
railway run npx prisma migrate deploy

# Seed the database
railway run npm run db:seed
```

## Step 7: Deploy Application

```bash
railway up
```

## Step 8: Get Your Live URL

```bash
railway status
```

## 🎉 Success!

Your NFL Aggregator will be live at the Railway URL!

### Test Your Deployment

```bash
# Health check
curl https://your-app.railway.app/health

# Test API endpoints
curl https://your-app.railway.app/api/teams
curl https://your-app.railway.app/api/games
```

## 📊 Available Endpoints

- Health: `/health`
- Teams: `/api/teams`
- Games: `/api/games`
- Players: `/api/players`
- Stats: `/api/stats`
- Leaderboards: `/api/leaderboards`
- News: `/api/news`
