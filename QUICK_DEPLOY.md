# Quick Deploy Guide 🚀

Get your NFL Aggregator app live in minutes!

## Option 1: Vercel (Fastest - 2 minutes)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   ./deploy.sh vercel
   ```

3. **Your app is live!** 
   - URL: `https://your-project-name.vercel.app`

## Option 2: Netlify (3 minutes)

1. **Install Netlify CLI**
   ```bash
   npm i -g netlify-cli
   ```

2. **Deploy**
   ```bash
   ./deploy.sh netlify
   ```

3. **Your app is live!**
   - URL: `https://your-site-name.netlify.app`

## Option 3: Heroku (5 minutes)

1. **Install Heroku CLI**
   - Download from: https://devcenter.heroku.com/articles/heroku-cli

2. **Login and create app**
   ```bash
   heroku login
   heroku create your-nfl-aggregator
   ```

3. **Deploy**
   ```bash
   ./deploy.sh heroku
   ```

4. **Your app is live!**
   - URL: `https://your-nfl-aggregator.herokuapp.com`

## Option 4: Railway (2 minutes)

1. **Go to [Railway](https://railway.app)**
2. **Connect GitHub account**
3. **Select this repository**
4. **Deploy automatically!**

## Option 5: Docker (Local testing)

1. **Build and run**
   ```bash
   ./deploy.sh docker
   docker run -p 5000:5000 nfl-aggregator
   ```

2. **Access locally**
   - URL: `http://localhost:5000`

## Manual Deployment (Any platform)

1. **Build the app**
   ```bash
   npm run build
   ```

2. **Start the server**
   ```bash
   npm start
   ```

3. **Upload to your hosting platform**

## Environment Variables

Set these in your hosting platform:

```env
NODE_ENV=production
PORT=5000
```

## Troubleshooting

- **Build fails?** Run `npm run install-all` first
- **Tests fail?** Run `npm test` to see errors
- **Linting fails?** Run `npm run lint` to fix issues
- **Security issues?** Run `npm run security:fix`

## Need Help?

1. Check the full [DEPLOYMENT.md](DEPLOYMENT.md) guide
2. Check the [README.md](README.md) for setup instructions
3. Create an issue in the repository

## Quick Commands

```bash
# Install all dependencies
npm run install-all

# Run tests
npm test

# Build for production
npm run build

# Start production server
npm start

# Deploy to Vercel
./deploy.sh vercel

# Deploy to Netlify
./deploy.sh netlify

# Deploy to Heroku
./deploy.sh heroku
```

**Choose your platform and get started! 🏈**

