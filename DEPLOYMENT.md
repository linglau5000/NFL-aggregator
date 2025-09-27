# 🚀 NFL Aggregator Deployment Guide

This guide covers deploying the NFL Aggregator to Railway with PostgreSQL database.

## 📋 Prerequisites

- Railway account (sign up at [railway.app](https://railway.app))
- Railway CLI installed (`npm install -g @railway/cli`)
- GitHub repository with the code

## 🗄️ Database Setup

### 1. Create PostgreSQL Database on Railway

```bash
# Login to Railway
railway login

# Create new project
railway new

# Add PostgreSQL database
railway add postgresql

# Get database URL
railway variables
```

### 2. Set Environment Variables

Set these variables in Railway dashboard or via CLI:

```bash
# Database
railway variables set DATABASE_URL="postgresql://username:password@host:port/database"

# Application
railway variables set NODE_ENV="production"
railway variables set PORT="5000"

# Security
railway variables set JWT_SECRET="your-super-secret-jwt-key-here"
railway variables set BCRYPT_ROUNDS="12"

# CORS
railway variables set FRONTEND_URL="https://your-frontend-domain.com"

# Rate Limiting
railway variables set RATE_LIMIT_WINDOW_MS="900000"
railway variables set RATE_LIMIT_MAX_REQUESTS="100"

# Logging
railway variables set LOG_LEVEL="info"
```

## 🚀 Deployment Steps

### Option 1: Automatic Deployment (Recommended)

1. **Connect GitHub Repository**
   - Go to Railway dashboard
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

2. **Configure Environment Variables**
   - Add all required environment variables
   - Set `DATABASE_URL` to your PostgreSQL connection string

3. **Deploy**
   - Railway will automatically build and deploy
   - Monitor the deployment logs

### Option 2: Manual Deployment

```bash
# Clone repository
git clone https://github.com/linglau5000/NFL-aggregator.git
cd NFL-aggregator

# Login to Railway
railway login

# Link to existing project
railway link

# Deploy
railway up
```

### Option 3: Using Deployment Script

```bash
# Make script executable
chmod +x railway-deploy.sh

# Run deployment script
./railway-deploy.sh
```

## 🗃️ Database Migration

After deployment, run database migrations:

```bash
# Connect to Railway project
railway link

# Run migrations
railway run npx prisma migrate deploy

# Generate Prisma client
railway run npx prisma generate

# Seed database (optional)
railway run npm run db:seed
```

## 🔧 Post-Deployment Configuration

### 1. Health Check

Verify deployment:
```bash
curl https://your-app.railway.app/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "environment": "production",
  "version": "1.0.0"
}
```

### 2. Database Connection Test

```bash
# Test database connection
railway run npx prisma db pull
```

### 3. API Endpoints Test

```bash
# Test API endpoints
curl https://your-app.railway.app/api/teams
curl https://your-app.railway.app/api/games
```

## 📊 Monitoring

### 1. Railway Dashboard
- Monitor application logs
- Check resource usage
- View deployment history

### 2. Database Monitoring
```bash
# Connect to database
railway connect postgresql

# Check database status
railway run npx prisma db status
```

### 3. Application Logs
```bash
# View logs
railway logs

# Follow logs in real-time
railway logs --follow
```

## 🔒 Security Configuration

### 1. Environment Variables Security
- Use strong, unique secrets
- Rotate secrets regularly
- Never commit secrets to version control

### 2. Database Security
- Use connection pooling
- Enable SSL connections
- Regular backups

### 3. API Security
- Rate limiting enabled
- CORS configured
- Helmet security headers
- Input validation

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   ```bash
   # Check DATABASE_URL
   railway variables get DATABASE_URL
   
   # Test connection
   railway run npx prisma db pull
   ```

2. **Build Failures**
   ```bash
   # Check build logs
   railway logs --build
   
   # Verify Node.js version
   railway variables set NODE_VERSION="20"
   ```

3. **Memory Issues**
   ```bash
   # Check resource usage
   railway status
   
   # Scale up if needed
   railway scale web
   ```

### Debug Commands

```bash
# Check application status
railway status

# View environment variables
railway variables

# Connect to running container
railway shell

# View detailed logs
railway logs --tail 100
```

## 📈 Performance Optimization

### 1. Database Optimization
- Add proper indexes
- Use connection pooling
- Monitor query performance

### 2. Application Optimization
- Enable compression
- Use caching
- Optimize bundle size

### 3. Railway Optimization
- Use appropriate plan
- Monitor resource usage
- Scale as needed

## 🔄 CI/CD Pipeline

The project includes GitHub Actions for automated deployment:

1. **On Push to Main**: Automatic deployment to Railway
2. **On Pull Request**: Run tests and security checks
3. **On Release**: Create new deployment

### Required Secrets

Add these secrets to your GitHub repository:

- `RAILWAY_TOKEN`: Your Railway API token
- `RAILWAY_SERVICE`: Your Railway service name
- `SNYK_TOKEN`: Snyk API token for security scanning

## 📞 Support

If you encounter issues:

1. Check Railway documentation
2. Review application logs
3. Test locally first
4. Contact support team

## 🎉 Success!

Your NFL Aggregator should now be running on Railway with:
- ✅ PostgreSQL database
- ✅ API endpoints
- ✅ Security measures
- ✅ Monitoring
- ✅ CI/CD pipeline

Visit your Railway domain to see the live application!