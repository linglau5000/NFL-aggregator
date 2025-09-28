const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil(parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000') / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      connectSrc: ["'self'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}));

// Other middleware
app.use(compression());
app.use(morgan('combined'));
app.use(limiter);
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL || 'http://localhost:3000'] 
    : true,
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'NFL Aggregator API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      teams: '/api/teams',
      games: '/api/games',
      players: '/api/players',
      stats: '/api/stats',
      leaderboards: '/api/leaderboards',
      news: '/api/news'
    }
  });
});

// Mock API endpoints for now
app.get('/api/teams', (req, res) => {
  res.json({
    success: true,
    data: {
      teams: [
        { id: '1', name: 'Buffalo Bills', abbreviation: 'BUF', conference: 'AFC', division: 'East' },
        { id: '2', name: 'Miami Dolphins', abbreviation: 'MIA', conference: 'AFC', division: 'East' },
        { id: '3', name: 'New England Patriots', abbreviation: 'NE', conference: 'AFC', division: 'East' },
        { id: '4', name: 'New York Jets', abbreviation: 'NYJ', conference: 'AFC', division: 'East' }
      ]
    }
  });
});

app.get('/api/games', (req, res) => {
  res.json({
    success: true,
    data: {
      games: [
        { 
          id: '1', 
          homeTeam: { name: 'Buffalo Bills', abbreviation: 'BUF' },
          awayTeam: { name: 'Miami Dolphins', abbreviation: 'MIA' },
          homeScore: 24,
          awayScore: 17,
          status: 'completed'
        }
      ]
    }
  });
});

app.get('/api/players', (req, res) => {
  res.json({
    success: true,
    data: {
      players: [
        { id: '1', name: 'Josh Allen', position: 'QB', team: 'Buffalo Bills' },
        { id: '2', name: 'Tua Tagovailoa', position: 'QB', team: 'Miami Dolphins' }
      ]
    }
  });
});

app.get('/api/stats', (req, res) => {
  res.json({
    success: true,
    data: {
      message: 'Statistics endpoint - full implementation coming soon'
    }
  });
});

app.get('/api/leaderboards', (req, res) => {
  res.json({
    success: true,
    data: {
      message: 'Leaderboards endpoint - full implementation coming soon'
    }
  });
});

app.get('/api/news', (req, res) => {
  res.json({
    success: true,
    data: {
      news: [
        { id: '1', title: 'NFL Season 2024 Kicks Off', content: 'The 2024 NFL season is underway!' }
      ]
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `The requested endpoint ${req.originalUrl} does not exist`,
    availableEndpoints: [
      '/health',
      '/api/teams',
      '/api/games',
      '/api/players',
      '/api/stats',
      '/api/leaderboards',
      '/api/news'
    ]
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    error: {
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      statusCode: 500,
      timestamp: new Date().toISOString()
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 NFL Aggregator API server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
