const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');
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

// Serve static files
app.use(express.static('public'));

// Route for FootballDB.com style homepage
app.get('/footballdb', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'footballdb.html'));
});

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
        // AFC East
        { id: '1', name: 'Buffalo Bills', abbreviation: 'BUF', conference: 'AFC', division: 'East' },
        { id: '2', name: 'Miami Dolphins', abbreviation: 'MIA', conference: 'AFC', division: 'East' },
        { id: '3', name: 'New England Patriots', abbreviation: 'NE', conference: 'AFC', division: 'East' },
        { id: '4', name: 'New York Jets', abbreviation: 'NYJ', conference: 'AFC', division: 'East' },
        // AFC North
        { id: '5', name: 'Baltimore Ravens', abbreviation: 'BAL', conference: 'AFC', division: 'North' },
        { id: '6', name: 'Cincinnati Bengals', abbreviation: 'CIN', conference: 'AFC', division: 'North' },
        { id: '7', name: 'Cleveland Browns', abbreviation: 'CLE', conference: 'AFC', division: 'North' },
        { id: '8', name: 'Pittsburgh Steelers', abbreviation: 'PIT', conference: 'AFC', division: 'North' },
        // AFC South
        { id: '9', name: 'Houston Texans', abbreviation: 'HOU', conference: 'AFC', division: 'South' },
        { id: '10', name: 'Indianapolis Colts', abbreviation: 'IND', conference: 'AFC', division: 'South' },
        { id: '11', name: 'Jacksonville Jaguars', abbreviation: 'JAX', conference: 'AFC', division: 'South' },
        { id: '12', name: 'Tennessee Titans', abbreviation: 'TEN', conference: 'AFC', division: 'South' },
        // AFC West
        { id: '13', name: 'Denver Broncos', abbreviation: 'DEN', conference: 'AFC', division: 'West' },
        { id: '14', name: 'Kansas City Chiefs', abbreviation: 'KC', conference: 'AFC', division: 'West' },
        { id: '15', name: 'Las Vegas Raiders', abbreviation: 'LV', conference: 'AFC', division: 'West' },
        { id: '16', name: 'Los Angeles Chargers', abbreviation: 'LAC', conference: 'AFC', division: 'West' },
        // NFC East
        { id: '17', name: 'Dallas Cowboys', abbreviation: 'DAL', conference: 'NFC', division: 'East' },
        { id: '18', name: 'New York Giants', abbreviation: 'NYG', conference: 'NFC', division: 'East' },
        { id: '19', name: 'Philadelphia Eagles', abbreviation: 'PHI', conference: 'NFC', division: 'East' },
        { id: '20', name: 'Washington Commanders', abbreviation: 'WAS', conference: 'NFC', division: 'East' },
        // NFC North
        { id: '21', name: 'Chicago Bears', abbreviation: 'CHI', conference: 'NFC', division: 'North' },
        { id: '22', name: 'Detroit Lions', abbreviation: 'DET', conference: 'NFC', division: 'North' },
        { id: '23', name: 'Green Bay Packers', abbreviation: 'GB', conference: 'NFC', division: 'North' },
        { id: '24', name: 'Minnesota Vikings', abbreviation: 'MIN', conference: 'NFC', division: 'North' },
        // NFC South
        { id: '25', name: 'Atlanta Falcons', abbreviation: 'ATL', conference: 'NFC', division: 'South' },
        { id: '26', name: 'Carolina Panthers', abbreviation: 'CAR', conference: 'NFC', division: 'South' },
        { id: '27', name: 'New Orleans Saints', abbreviation: 'NO', conference: 'NFC', division: 'South' },
        { id: '28', name: 'Tampa Bay Buccaneers', abbreviation: 'TB', conference: 'NFC', division: 'South' },
        // NFC West
        { id: '29', name: 'Arizona Cardinals', abbreviation: 'ARI', conference: 'NFC', division: 'West' },
        { id: '30', name: 'Los Angeles Rams', abbreviation: 'LAR', conference: 'NFC', division: 'West' },
        { id: '31', name: 'San Francisco 49ers', abbreviation: 'SF', conference: 'NFC', division: 'West' },
        { id: '32', name: 'Seattle Seahawks', abbreviation: 'SEA', conference: 'NFC', division: 'West' }
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
          status: 'completed',
          date: '2024-01-07',
          time: '1:00 PM ET'
        },
        { 
          id: '2', 
          homeTeam: { name: 'Kansas City Chiefs', abbreviation: 'KC' },
          awayTeam: { name: 'Las Vegas Raiders', abbreviation: 'LV' },
          homeScore: 31,
          awayScore: 13,
          status: 'completed',
          date: '2024-01-07',
          time: '4:25 PM ET'
        },
        { 
          id: '3', 
          homeTeam: { name: 'Dallas Cowboys', abbreviation: 'DAL' },
          awayTeam: { name: 'Philadelphia Eagles', abbreviation: 'PHI' },
          homeScore: 0,
          awayScore: 0,
          status: 'scheduled',
          date: '2024-01-14',
          time: '8:15 PM ET'
        },
        { 
          id: '4', 
          homeTeam: { name: 'San Francisco 49ers', abbreviation: 'SF' },
          awayTeam: { name: 'Green Bay Packers', abbreviation: 'GB' },
          homeScore: 0,
          awayScore: 0,
          status: 'scheduled',
          date: '2024-01-14',
          time: '4:30 PM ET'
        },
        { 
          id: '5', 
          homeTeam: { name: 'Baltimore Ravens', abbreviation: 'BAL' },
          awayTeam: { name: 'Houston Texans', abbreviation: 'HOU' },
          homeScore: 0,
          awayScore: 0,
          status: 'scheduled',
          date: '2024-01-14',
          time: '1:00 PM ET'
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
        // Quarterbacks
        { id: '1', name: 'Josh Allen', position: 'QB', team: 'BUF', jersey: '17' },
        { id: '2', name: 'Tua Tagovailoa', position: 'QB', team: 'MIA', jersey: '1' },
        { id: '3', name: 'Patrick Mahomes', position: 'QB', team: 'KC', jersey: '15' },
        { id: '4', name: 'Lamar Jackson', position: 'QB', team: 'BAL', jersey: '8' },
        { id: '5', name: 'Dak Prescott', position: 'QB', team: 'DAL', jersey: '4' },
        // Running Backs
        { id: '6', name: 'Derrick Henry', position: 'RB', team: 'TEN', jersey: '22' },
        { id: '7', name: 'Christian McCaffrey', position: 'RB', team: 'SF', jersey: '23' },
        { id: '8', name: 'Saquon Barkley', position: 'RB', team: 'NYG', jersey: '26' },
        { id: '9', name: 'Nick Chubb', position: 'RB', team: 'CLE', jersey: '24' },
        // Wide Receivers
        { id: '10', name: 'Stefon Diggs', position: 'WR', team: 'BUF', jersey: '14' },
        { id: '11', name: 'Tyreek Hill', position: 'WR', team: 'MIA', jersey: '10' },
        { id: '12', name: 'Cooper Kupp', position: 'WR', team: 'LAR', jersey: '10' },
        { id: '13', name: 'Davante Adams', position: 'WR', team: 'LV', jersey: '17' },
        { id: '14', name: 'A.J. Brown', position: 'WR', team: 'PHI', jersey: '11' },
        // Tight Ends
        { id: '15', name: 'Travis Kelce', position: 'TE', team: 'KC', jersey: '87' },
        { id: '16', name: 'Mark Andrews', position: 'TE', team: 'BAL', jersey: '89' },
        { id: '17', name: 'George Kittle', position: 'TE', team: 'SF', jersey: '85' },
        // Defensive Players
        { id: '18', name: 'Aaron Donald', position: 'DT', team: 'LAR', jersey: '99' },
        { id: '19', name: 'T.J. Watt', position: 'LB', team: 'PIT', jersey: '90' },
        { id: '20', name: 'Myles Garrett', position: 'DE', team: 'CLE', jersey: '95' }
      ]
    }
  });
});

app.get('/api/stats', (req, res) => {
  res.json({
    success: true,
    data: {
      stats: [
        // Passing Stats
        { id: '1', player: 'Josh Allen', category: 'Passing Yards', value: 4200, team: 'BUF' },
        { id: '2', player: 'Patrick Mahomes', category: 'Passing Yards', value: 4183, team: 'KC' },
        { id: '3', player: 'Lamar Jackson', category: 'Passing Yards', value: 3678, team: 'BAL' },
        { id: '4', player: 'Tua Tagovailoa', category: 'Passing Yards', value: 4624, team: 'MIA' },
        { id: '5', player: 'Dak Prescott', category: 'Passing Yards', value: 4516, team: 'DAL' },
        // Receiving Stats
        { id: '6', player: 'Stefon Diggs', category: 'Receiving Yards', value: 1400, team: 'BUF' },
        { id: '7', player: 'Tyreek Hill', category: 'Receiving Yards', value: 1799, team: 'MIA' },
        { id: '8', player: 'Cooper Kupp', category: 'Receiving Yards', value: 1086, team: 'LAR' },
        { id: '9', player: 'Davante Adams', category: 'Receiving Yards', value: 1144, team: 'LV' },
        { id: '10', player: 'A.J. Brown', category: 'Receiving Yards', value: 1066, team: 'PHI' },
        // Rushing Stats
        { id: '11', player: 'Derrick Henry', category: 'Rushing Yards', value: 1167, team: 'TEN' },
        { id: '12', player: 'Christian McCaffrey', category: 'Rushing Yards', value: 1459, team: 'SF' },
        { id: '13', player: 'Saquon Barkley', category: 'Rushing Yards', value: 962, team: 'NYG' },
        { id: '14', player: 'Nick Chubb', category: 'Rushing Yards', value: 170, team: 'CLE' },
        // Touchdown Stats
        { id: '15', player: 'Josh Allen', category: 'Passing TDs', value: 29, team: 'BUF' },
        { id: '16', player: 'Patrick Mahomes', category: 'Passing TDs', value: 27, team: 'KC' },
        { id: '17', player: 'Derrick Henry', category: 'Rushing TDs', value: 12, team: 'TEN' },
        { id: '18', player: 'Christian McCaffrey', category: 'Rushing TDs', value: 14, team: 'SF' },
        { id: '19', player: 'Tyreek Hill', category: 'Receiving TDs', value: 13, team: 'MIA' },
        { id: '20', player: 'Stefon Diggs', category: 'Receiving TDs', value: 8, team: 'BUF' }
      ]
    }
  });
});

app.get('/api/leaderboards', (req, res) => {
  res.json({
    success: true,
    data: {
      leaderboards: [
        { category: 'Passing Yards', leader: 'Tua Tagovailoa', value: 4624, team: 'MIA' },
        { category: 'Passing TDs', leader: 'Josh Allen', value: 29, team: 'BUF' },
        { category: 'Rushing Yards', leader: 'Christian McCaffrey', value: 1459, team: 'SF' },
        { category: 'Rushing TDs', leader: 'Christian McCaffrey', value: 14, team: 'SF' },
        { category: 'Receiving Yards', leader: 'Tyreek Hill', value: 1799, team: 'MIA' },
        { category: 'Receiving TDs', leader: 'Tyreek Hill', value: 13, team: 'MIA' },
        { category: 'Interceptions', leader: 'DaRon Bland', value: 9, team: 'DAL' },
        { category: 'Sacks', leader: 'T.J. Watt', value: 19, team: 'PIT' },
        { category: 'Tackles', leader: 'Foyesade Oluokun', value: 173, team: 'JAX' }
      ]
    }
  });
});

app.get('/api/news', (req, res) => {
  res.json({
    success: true,
    data: {
      news: [
        { 
          id: '1', 
          title: 'NFL Playoffs Begin This Weekend', 
          content: 'The 2024 NFL playoffs kick off with wild card weekend featuring exciting matchups across both conferences.',
          source: 'NFL.com',
          date: '2024-01-13'
        },
        { 
          id: '2', 
          title: 'Chiefs Secure AFC West Title', 
          content: 'Kansas City Chiefs clinched the AFC West division title with a dominant performance against the Raiders.',
          source: 'ESPN',
          date: '2024-01-07'
        },
        { 
          id: '3', 
          title: 'Bills Win Thriller Against Dolphins', 
          content: 'Buffalo Bills defeated Miami Dolphins 24-17 in a crucial AFC East matchup that went down to the wire.',
          source: 'CBS Sports',
          date: '2024-01-07'
        },
        { 
          id: '4', 
          title: 'Cowboys vs Eagles Set for Divisional Round', 
          content: 'The Dallas Cowboys will host the Philadelphia Eagles in what promises to be an epic NFC East showdown.',
          source: 'NFL Network',
          date: '2024-01-14'
        },
        { 
          id: '5', 
          title: 'Ravens Earn Top Seed in AFC', 
          content: 'Baltimore Ravens secured the #1 seed in the AFC with their impressive regular season performance.',
          source: 'Fox Sports',
          date: '2024-01-08'
        }
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
