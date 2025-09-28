// Vercel serverless function for NFL Aggregator API
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Mock data for API endpoints
const mockData = {
  teams: [
    { id: 1, name: 'Buffalo Bills', city: 'Buffalo', conference: 'AFC', division: 'East', wins: 11, losses: 6, ties: 0 },
    { id: 2, name: 'Miami Dolphins', city: 'Miami', conference: 'AFC', division: 'East', wins: 11, losses: 6, ties: 0 },
    { id: 3, name: 'New England Patriots', city: 'New England', conference: 'AFC', division: 'East', wins: 4, losses: 13, ties: 0 },
    { id: 4, name: 'New York Jets', city: 'New York', conference: 'AFC', division: 'East', wins: 7, losses: 10, ties: 0 },
    { id: 5, name: 'Baltimore Ravens', city: 'Baltimore', conference: 'AFC', division: 'North', wins: 13, losses: 4, ties: 0 },
    { id: 6, name: 'Cincinnati Bengals', city: 'Cincinnati', conference: 'AFC', division: 'North', wins: 9, losses: 8, ties: 0 },
    { id: 7, name: 'Cleveland Browns', city: 'Cleveland', conference: 'AFC', division: 'North', wins: 11, losses: 6, ties: 0 },
    { id: 8, name: 'Pittsburgh Steelers', city: 'Pittsburgh', conference: 'AFC', division: 'North', wins: 10, losses: 7, ties: 0 },
    { id: 9, name: 'Houston Texans', city: 'Houston', conference: 'AFC', division: 'South', wins: 10, losses: 7, ties: 0 },
    { id: 10, name: 'Indianapolis Colts', city: 'Indianapolis', conference: 'AFC', division: 'South', wins: 9, losses: 8, ties: 0 },
    { id: 11, name: 'Jacksonville Jaguars', city: 'Jacksonville', conference: 'AFC', division: 'South', wins: 9, losses: 8, ties: 0 },
    { id: 12, name: 'Tennessee Titans', city: 'Tennessee', conference: 'AFC', division: 'South', wins: 6, losses: 11, ties: 0 },
    { id: 13, name: 'Denver Broncos', city: 'Denver', conference: 'AFC', division: 'West', wins: 8, losses: 9, ties: 0 },
    { id: 14, name: 'Kansas City Chiefs', city: 'Kansas City', conference: 'AFC', division: 'West', wins: 11, losses: 6, ties: 0 },
    { id: 15, name: 'Las Vegas Raiders', city: 'Las Vegas', conference: 'AFC', division: 'West', wins: 8, losses: 9, ties: 0 },
    { id: 16, name: 'Los Angeles Chargers', city: 'Los Angeles', conference: 'AFC', division: 'West', wins: 5, losses: 12, ties: 0 },
    { id: 17, name: 'Dallas Cowboys', city: 'Dallas', conference: 'NFC', division: 'East', wins: 12, losses: 5, ties: 0 },
    { id: 18, name: 'New York Giants', city: 'New York', conference: 'NFC', division: 'East', wins: 6, losses: 11, ties: 0 },
    { id: 19, name: 'Philadelphia Eagles', city: 'Philadelphia', conference: 'NFC', division: 'East', wins: 11, losses: 6, ties: 0 },
    { id: 20, name: 'Washington Commanders', city: 'Washington', conference: 'NFC', division: 'East', wins: 4, losses: 13, ties: 0 },
    { id: 21, name: 'Chicago Bears', city: 'Chicago', conference: 'NFC', division: 'North', wins: 7, losses: 10, ties: 0 },
    { id: 22, name: 'Detroit Lions', city: 'Detroit', conference: 'NFC', division: 'North', wins: 12, losses: 5, ties: 0 },
    { id: 23, name: 'Green Bay Packers', city: 'Green Bay', conference: 'NFC', division: 'North', wins: 9, losses: 8, ties: 0 },
    { id: 24, name: 'Minnesota Vikings', city: 'Minnesota', conference: 'NFC', division: 'North', wins: 7, losses: 10, ties: 0 },
    { id: 25, name: 'Atlanta Falcons', city: 'Atlanta', conference: 'NFC', division: 'South', wins: 7, losses: 10, ties: 0 },
    { id: 26, name: 'Carolina Panthers', city: 'Carolina', conference: 'NFC', division: 'South', wins: 2, losses: 15, ties: 0 },
    { id: 27, name: 'New Orleans Saints', city: 'New Orleans', conference: 'NFC', division: 'South', wins: 9, losses: 8, ties: 0 },
    { id: 28, name: 'Tampa Bay Buccaneers', city: 'Tampa Bay', conference: 'NFC', division: 'South', wins: 9, losses: 8, ties: 0 },
    { id: 29, name: 'Arizona Cardinals', city: 'Arizona', conference: 'NFC', division: 'West', wins: 4, losses: 13, ties: 0 },
    { id: 30, name: 'Los Angeles Rams', city: 'Los Angeles', conference: 'NFC', division: 'West', wins: 10, losses: 7, ties: 0 },
    { id: 31, name: 'San Francisco 49ers', city: 'San Francisco', conference: 'NFC', division: 'West', wins: 12, losses: 5, ties: 0 },
    { id: 32, name: 'Seattle Seahawks', city: 'Seattle', conference: 'NFC', division: 'West', wins: 9, losses: 8, ties: 0 }
  ],
  games: [
    { id: 1, homeTeam: 'Buffalo Bills', awayTeam: 'Miami Dolphins', homeScore: 21, awayScore: 14, status: 'completed', date: '2024-01-07', time: '20:00' },
    { id: 2, homeTeam: 'Kansas City Chiefs', awayTeam: 'Las Vegas Raiders', homeScore: 13, awayScore: 12, status: 'completed', date: '2024-01-07', time: '16:25' },
    { id: 3, homeTeam: 'Dallas Cowboys', awayTeam: 'Washington Commanders', homeScore: 38, awayScore: 10, status: 'completed', date: '2024-01-07', time: '16:25' },
    { id: 4, homeTeam: 'San Francisco 49ers', awayTeam: 'Los Angeles Rams', homeScore: 21, awayScore: 20, status: 'completed', date: '2024-01-07', time: '16:25' },
    { id: 5, homeTeam: 'Baltimore Ravens', awayTeam: 'Pittsburgh Steelers', homeScore: 17, awayScore: 10, status: 'completed', date: '2024-01-06', time: '16:30' },
    { id: 6, homeTeam: 'Detroit Lions', awayTeam: 'Minnesota Vikings', homeScore: 30, awayScore: 20, status: 'completed', date: '2024-01-07', time: '13:00' },
    { id: 7, homeTeam: 'Houston Texans', awayTeam: 'Indianapolis Colts', homeScore: 23, awayScore: 19, status: 'completed', date: '2024-01-07', time: '13:00' },
    { id: 8, homeTeam: 'Tampa Bay Buccaneers', awayTeam: 'Carolina Panthers', homeScore: 9, awayScore: 0, status: 'completed', date: '2024-01-07', time: '13:00' },
    { id: 9, homeTeam: 'New York Jets', awayTeam: 'New England Patriots', homeScore: 17, awayScore: 3, status: 'completed', date: '2024-01-07', time: '13:00' },
    { id: 10, homeTeam: 'Atlanta Falcons', awayTeam: 'New Orleans Saints', homeScore: 48, awayScore: 17, status: 'completed', date: '2024-01-07', time: '13:00' },
    { id: 11, homeTeam: 'Cleveland Browns', awayTeam: 'Cincinnati Bengals', homeScore: 31, awayScore: 14, status: 'completed', date: '2024-01-07', time: '13:00' },
    { id: 12, homeTeam: 'Jacksonville Jaguars', awayTeam: 'Tennessee Titans', homeScore: 28, awayScore: 20, status: 'completed', date: '2024-01-07', time: '13:00' },
    { id: 13, homeTeam: 'Denver Broncos', awayTeam: 'Los Angeles Chargers', homeScore: 16, awayScore: 9, status: 'completed', date: '2024-01-07', time: '16:25' },
    { id: 14, homeTeam: 'Green Bay Packers', awayTeam: 'Chicago Bears', homeScore: 17, awayScore: 9, status: 'completed', date: '2024-01-07', time: '16:25' },
    { id: 15, homeTeam: 'Seattle Seahawks', awayTeam: 'Arizona Cardinals', homeScore: 21, awayScore: 20, status: 'completed', date: '2024-01-07', time: '16:25' },
    { id: 16, homeTeam: 'Philadelphia Eagles', awayTeam: 'New York Giants', homeScore: 27, awayScore: 10, status: 'completed', date: '2024-01-07', time: '16:25' }
  ],
  players: [
    { id: 1, name: 'Tua Tagovailoa', team: 'MIA', position: 'QB', jersey: 1, stats: { passingYards: 4624, passingTDs: 29, interceptions: 14 } },
    { id: 2, name: 'Christian McCaffrey', team: 'SF', position: 'RB', jersey: 23, stats: { rushingYards: 1459, rushingTDs: 14, receptions: 67 } },
    { id: 3, name: 'Tyreek Hill', team: 'MIA', position: 'WR', jersey: 10, stats: { receivingYards: 1799, receivingTDs: 13, receptions: 119 } },
    { id: 4, name: 'T.J. Watt', team: 'PIT', position: 'LB', jersey: 90, stats: { sacks: 19, tackles: 68, forcedFumbles: 4 } },
    { id: 5, name: 'Josh Allen', team: 'BUF', position: 'QB', jersey: 17, stats: { passingYards: 4306, passingTDs: 29, interceptions: 18 } },
    { id: 6, name: 'Lamar Jackson', team: 'BAL', position: 'QB', jersey: 8, stats: { passingYards: 3678, passingTDs: 24, interceptions: 7 } },
    { id: 7, name: 'Dak Prescott', team: 'DAL', position: 'QB', jersey: 4, stats: { passingYards: 4516, passingTDs: 36, interceptions: 9 } },
    { id: 8, name: 'Brock Purdy', team: 'SF', position: 'QB', jersey: 13, stats: { passingYards: 4280, passingTDs: 31, interceptions: 11 } }
  ],
  news: [
    { id: 1, title: 'Ravens Secure Top Seed in AFC', content: 'Baltimore Ravens clinched the #1 seed in the AFC with their victory over Pittsburgh.', source: 'NFL.com', date: '2024-01-07' },
    { id: 2, title: 'Cowboys Win NFC East', content: 'Dallas Cowboys secured the NFC East division title with a dominant performance.', source: 'ESPN', date: '2024-01-07' },
    { id: 3, title: 'Playoff Picture Set', content: 'The NFL playoff picture is now complete with all 14 teams determined.', source: 'CBS Sports', date: '2024-01-07' },
    { id: 4, title: 'Wild Card Weekend Schedule', content: 'Wild Card Weekend games have been announced with exciting matchups ahead.', source: 'NFL.com', date: '2024-01-07' },
    { id: 5, title: 'MVP Race Heats Up', content: 'Lamar Jackson and Josh Allen lead the MVP conversation heading into playoffs.', source: 'NFL.com', date: '2024-01-06' }
  ]
};

// API Routes
app.get('/api/teams', (req, res) => {
  res.set({
    'Cache-Control': 'public, max-age=300', // 5 minutes cache
    'ETag': '"teams-v1"',
    'Last-Modified': new Date().toUTCString()
  });
  res.json({ success: true, data: { teams: mockData.teams } });
});

app.get('/api/games', (req, res) => {
  res.set({
    'Cache-Control': 'public, max-age=180', // 3 minutes cache
    'ETag': '"games-v1"',
    'Last-Modified': new Date().toUTCString()
  });
  res.json({ success: true, data: { games: mockData.games } });
});

app.get('/api/players', (req, res) => {
  res.set({
    'Cache-Control': 'public, max-age=600', // 10 minutes cache
    'ETag': '"players-v1"',
    'Last-Modified': new Date().toUTCString()
  });
  res.json({ success: true, data: { players: mockData.players } });
});

app.get('/api/stats', (req, res) => {
  res.set({
    'Cache-Control': 'public, max-age=300', // 5 minutes cache
    'ETag': '"stats-v1"',
    'Last-Modified': new Date().toUTCString()
  });
  const stats = mockData.players.map(player => ({
    player: player.name,
    team: player.team,
    position: player.position,
    ...player.stats
  }));
  res.json({ success: true, data: { stats } });
});

app.get('/api/leaderboards', (req, res) => {
  res.set({
    'Cache-Control': 'public, max-age=300', // 5 minutes cache
    'ETag': '"leaderboards-v1"',
    'Last-Modified': new Date().toUTCString()
  });
  const leaderboards = {
    passing: mockData.players.filter(p => p.position === 'QB').sort((a, b) => b.stats.passingYards - a.stats.passingYards).slice(0, 10),
    rushing: mockData.players.filter(p => p.position === 'RB').sort((a, b) => b.stats.rushingYards - a.stats.rushingYards).slice(0, 10),
    receiving: mockData.players.filter(p => p.position === 'WR').sort((a, b) => b.stats.receivingYards - a.stats.receivingYards).slice(0, 10),
    defense: mockData.players.filter(p => p.position === 'LB').sort((a, b) => b.stats.sacks - a.stats.sacks).slice(0, 10)
  };
  res.json({ success: true, data: { leaderboards } });
});

app.get('/api/news', (req, res) => {
  res.set({
    'Cache-Control': 'public, max-age=600', // 10 minutes cache
    'ETag': '"news-v1"',
    'Last-Modified': new Date().toUTCString()
  });
  res.json({ success: true, data: { news: mockData.news } });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'NFL Aggregator API is running', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Serve static files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/footballdb', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/footballdb.html'));
});

// Catch all handler
app.get('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

module.exports = app;
