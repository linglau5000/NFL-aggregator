# 🚀 GitHub Setup & Railway Deployment Guide

## 📋 Step 1: GitHub Authentication & Push

### Option A: Using GitHub CLI (Recommended)
```bash
# Install GitHub CLI if not already installed
brew install gh

# Login to GitHub
gh auth login

# Push to GitHub
git push -u origin main
```

### Option B: Using Personal Access Token
```bash
# Set up GitHub credentials
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Use token for authentication
git remote set-url origin https://your-username:your-token@github.com/linglau5000/NFL-aggregator.git
git push -u origin main
```

### Option C: SSH Key Setup
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"

# Add to SSH agent
ssh-add ~/.ssh/id_ed25519

# Copy public key to GitHub
cat ~/.ssh/id_ed25519.pub
# Add this key to your GitHub account under Settings > SSH and GPG keys

# Test connection
ssh -T git@github.com

# Push to GitHub
git push -u origin main
```

## 🚀 Step 2: Railway Deployment

### 1. Install Railway CLI
```bash
npm install -g @railway/cli
```

### 2. Login to Railway
```bash
railway login
```

### 3. Create New Project
```bash
# Create new Railway project
railway new

# Add PostgreSQL database
railway add postgresql
```

### 4. Set Environment Variables
```bash
# Get database URL
railway variables

# Set required environment variables
railway variables set NODE_ENV=production
railway variables set PORT=5000
railway variables set JWT_SECRET=your-super-secret-jwt-key-here
railway variables set BCRYPT_ROUNDS=12
railway variables set RATE_LIMIT_WINDOW_MS=900000
railway variables set RATE_LIMIT_MAX_REQUESTS=100
railway variables set LOG_LEVEL=info
```

### 5. Deploy to Railway
```bash
# Deploy the application
railway up

# Or use the deployment script
chmod +x railway-deploy.sh
./railway-deploy.sh
```

### 6. Database Setup
```bash
# Run database migrations
railway run npx prisma migrate deploy

# Generate Prisma client
railway run npx prisma generate

# Seed the database
railway run npm run db:seed
```

## 🔗 Step 3: Get Your Live URL

After deployment, Railway will provide you with a URL like:
- `https://your-app-name.railway.app`

### Test Your Deployment
```bash
# Health check
curl https://your-app-name.railway.app/health

# Test API endpoints
curl https://your-app-name.railway.app/api/teams
curl https://your-app-name.railway.app/api/games
```

## 📊 Step 4: Verify Deployment

1. **Health Check**: Visit `/health` endpoint
2. **API Endpoints**: Test all API endpoints
3. **Database**: Verify database connection
4. **Logs**: Check Railway logs for any issues

## 🎯 Quick Commands Summary

```bash
# 1. Push to GitHub (choose one method above)
git push -u origin main

# 2. Deploy to Railway
railway login
railway new
railway add postgresql
railway variables set NODE_ENV=production
railway up

# 3. Setup database
railway run npx prisma migrate deploy
railway run npx prisma generate
railway run npm run db:seed

# 4. Get your live URL
railway status
```

## 🆘 Troubleshooting

### GitHub Issues
- Make sure you have access to the repository
- Check your authentication method
- Verify your SSH keys or tokens

### Railway Issues
- Check Railway logs: `railway logs`
- Verify environment variables: `railway variables`
- Test database connection: `railway run npx prisma db pull`

## 🎉 Success!

Once completed, you'll have:
- ✅ Code committed to GitHub
- ✅ Live application on Railway
- ✅ PostgreSQL database
- ✅ All API endpoints working
- ✅ Production-ready deployment

Your NFL Aggregator will be live and accessible via the Railway URL!
