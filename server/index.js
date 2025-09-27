const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const cron = require('node-cron');
const { body, query, validationResult } = require('express-validator');
const winston = require('winston');
require('dotenv').config();

const nflService = require('./services/nflService');
const cache = require('./utils/cache');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
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
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
app.use(limiter);
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : true,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cache middleware
app.use((req, res, next) => {
  req.cache = cache;
  next();
});

// Validation middleware
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api/scores', [
  query('season').optional().isInt({ min: 2000, max: 2030 }).withMessage('Season must be between 2000 and 2030'),
  query('week').optional().isInt({ min: 1, max: 18 }).withMessage('Week must be between 1 and 18'),
], validateRequest, async (req, res) => {
  try {
    const { week, season } = req.query;
    const cacheKey = `scores_${season || 'current'}_${week || 'current'}`;
    
    let scores = cache.get(cacheKey);
    if (!scores) {
      scores = await nflService.getScores(season, week);
      cache.set(cacheKey, scores, 300); // 5 minutes cache
    }
    
    logger.info(`Scores requested for season: ${season || 'current'}, week: ${week || 'current'}`);
    res.json(scores);
  } catch (error) {
    logger.error('Error fetching scores:', error);
    res.status(500).json({ error: 'Failed to fetch scores' });
  }
});

app.get('/api/standings', [
  query('season').optional().isInt({ min: 2000, max: 2030 }).withMessage('Season must be between 2000 and 2030'),
], validateRequest, async (req, res) => {
  try {
    const { season } = req.query;
    const cacheKey = `standings_${season || 'current'}`;
    
    let standings = cache.get(cacheKey);
    if (!standings) {
      standings = await nflService.getStandings(season);
      cache.set(cacheKey, standings, 1800); // 30 minutes cache
    }
    
    logger.info(`Standings requested for season: ${season || 'current'}`);
    res.json(standings);
  } catch (error) {
    logger.error('Error fetching standings:', error);
    res.status(500).json({ error: 'Failed to fetch standings' });
  }
});

app.get('/api/stats', [
  query('type').optional().isIn(['passing', 'rushing', 'receiving', 'defense', 'kicking']).withMessage('Type must be one of: passing, rushing, receiving, defense, kicking'),
  query('season').optional().isInt({ min: 2000, max: 2030 }).withMessage('Season must be between 2000 and 2030'),
], validateRequest, async (req, res) => {
  try {
    const { type, season } = req.query;
    const cacheKey = `stats_${type || 'passing'}_${season || 'current'}`;
    
    let stats = cache.get(cacheKey);
    if (!stats) {
      stats = await nflService.getStats(type || 'passing', season);
      cache.set(cacheKey, stats, 1800); // 30 minutes cache
    }
    
    logger.info(`Stats requested for type: ${type || 'passing'}, season: ${season || 'current'}`);
    res.json(stats);
  } catch (error) {
    logger.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

app.get('/api/news', async (req, res) => {
  try {
    const cacheKey = 'nfl_news';
    
    let news = cache.get(cacheKey);
    if (!news) {
      news = await nflService.getNews();
      cache.set(cacheKey, news, 600); // 10 minutes cache
    }
    
    logger.info('News requested');
    res.json(news);
  } catch (error) {
    logger.error('Error fetching news:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// Schedule data updates
cron.schedule('*/5 * * * *', async () => {
  logger.info('Updating NFL data...');
  try {
    await nflService.updateAllData();
    logger.info('NFL data updated successfully');
  } catch (error) {
    logger.error('Error updating NFL data:', error);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
