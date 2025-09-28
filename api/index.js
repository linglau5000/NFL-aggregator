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
    { id: 1, homeTeam: 'Buffalo Bills', awayTeam: 'Miami Dolphins', homeScore: 24, awayScore: 17, status: 'completed', date: '2025-01-05', time: '20:00' },
    { id: 2, homeTeam: 'Kansas City Chiefs', awayTeam: 'Las Vegas Raiders', homeScore: 31, awayScore: 13, status: 'completed', date: '2025-01-05', time: '16:25' },
    { id: 3, homeTeam: 'Dallas Cowboys', awayTeam: 'Philadelphia Eagles', homeScore: 0, awayScore: 0, status: 'scheduled', date: '2025-01-12', time: '16:25' },
    { id: 4, homeTeam: 'San Francisco 49ers', awayTeam: 'Green Bay Packers', homeScore: 0, awayScore: 0, status: 'scheduled', date: '2025-01-12', time: '16:30' },
    { id: 5, homeTeam: 'Baltimore Ravens', awayTeam: 'Houston Texans', homeScore: 0, awayScore: 0, status: 'scheduled', date: '2025-01-12', time: '13:00' },
    { id: 6, homeTeam: 'Detroit Lions', awayTeam: 'Los Angeles Rams', homeScore: 0, awayScore: 0, status: 'scheduled', date: '2025-01-12', time: '20:00' },
    { id: 7, homeTeam: 'Tampa Bay Buccaneers', awayTeam: 'Philadelphia Eagles', homeScore: 0, awayScore: 0, status: 'scheduled', date: '2025-01-12', time: '13:00' },
    { id: 8, homeTeam: 'Pittsburgh Steelers', awayTeam: 'Buffalo Bills', homeScore: 0, awayScore: 0, status: 'scheduled', date: '2025-01-12', time: '13:00' },
    { id: 9, homeTeam: 'Cleveland Browns', awayTeam: 'Houston Texans', homeScore: 0, awayScore: 0, status: 'scheduled', date: '2025-01-12', time: '13:00' },
    { id: 10, homeTeam: 'Miami Dolphins', awayTeam: 'Kansas City Chiefs', homeScore: 0, awayScore: 0, status: 'scheduled', date: '2025-01-12', time: '20:00' },
    { id: 11, homeTeam: 'Green Bay Packers', awayTeam: 'San Francisco 49ers', homeScore: 0, awayScore: 0, status: 'scheduled', date: '2025-01-12', time: '16:30' },
    { id: 12, homeTeam: 'Los Angeles Rams', awayTeam: 'Detroit Lions', homeScore: 0, awayScore: 0, status: 'scheduled', date: '2025-01-12', time: '20:00' },
    { id: 13, homeTeam: 'Houston Texans', awayTeam: 'Cleveland Browns', homeScore: 0, awayScore: 0, status: 'scheduled', date: '2025-01-12', time: '13:00' },
    { id: 14, homeTeam: 'Philadelphia Eagles', awayTeam: 'Tampa Bay Buccaneers', homeScore: 0, awayScore: 0, status: 'scheduled', date: '2025-01-12', time: '13:00' },
    { id: 15, homeTeam: 'Buffalo Bills', awayTeam: 'Pittsburgh Steelers', homeScore: 0, awayScore: 0, status: 'scheduled', date: '2025-01-12', time: '13:00' },
    { id: 16, homeTeam: 'Kansas City Chiefs', awayTeam: 'Miami Dolphins', homeScore: 0, awayScore: 0, status: 'scheduled', date: '2025-01-12', time: '20:00' }
  ],
  players: [
    { id: 1, name: 'Tua Tagovailoa', team: 'MIA', position: 'QB', jersey: 1, stats: { passingYards: 4891, passingTDs: 32, interceptions: 12 } },
    { id: 2, name: 'Christian McCaffrey', team: 'SF', position: 'RB', jersey: 23, stats: { rushingYards: 1587, rushingTDs: 16, receptions: 72 } },
    { id: 3, name: 'Tyreek Hill', team: 'MIA', position: 'WR', jersey: 10, stats: { receivingYards: 1923, receivingTDs: 15, receptions: 127 } },
    { id: 4, name: 'T.J. Watt', team: 'PIT', position: 'LB', jersey: 90, stats: { sacks: 22, tackles: 74, forcedFumbles: 5 } },
    { id: 5, name: 'Josh Allen', team: 'BUF', position: 'QB', jersey: 17, stats: { passingYards: 4567, passingTDs: 31, interceptions: 15 } },
    { id: 6, name: 'Lamar Jackson', team: 'BAL', position: 'QB', jersey: 8, stats: { passingYards: 3891, passingTDs: 28, interceptions: 6 } },
    { id: 7, name: 'Dak Prescott', team: 'DAL', position: 'QB', jersey: 4, stats: { passingYards: 4723, passingTDs: 38, interceptions: 8 } },
    { id: 8, name: 'Brock Purdy', team: 'SF', position: 'QB', jersey: 13, stats: { passingYards: 4456, passingTDs: 33, interceptions: 9 } },
    { id: 9, name: 'CeeDee Lamb', team: 'DAL', position: 'WR', jersey: 88, stats: { receivingYards: 1847, receivingTDs: 14, receptions: 135 } },
    { id: 10, name: 'Derrick Henry', team: 'BAL', position: 'RB', jersey: 22, stats: { rushingYards: 1234, rushingTDs: 12, receptions: 28 } },
    { id: 11, name: 'Myles Garrett', team: 'CLE', position: 'DE', jersey: 95, stats: { sacks: 18, tackles: 45, forcedFumbles: 3 } },
    { id: 12, name: 'Cooper Kupp', team: 'LAR', position: 'WR', jersey: 10, stats: { receivingYards: 1456, receivingTDs: 11, receptions: 98 } }
  ],
  news: [
    { id: 1, title: 'Ravens Clinch AFC Top Seed for 2025', content: 'Baltimore Ravens secured the #1 seed in the AFC with their dominant regular season performance.', source: 'NFL.com', date: '2025-01-05' },
    { id: 2, title: 'Cowboys Dominate NFC East in 2025', content: 'Dallas Cowboys captured the NFC East division title with an impressive 12-5 record.', source: 'ESPN', date: '2025-01-05' },
    { id: 3, title: '2025 Playoff Bracket Set', content: 'The 2025 NFL playoff picture is complete with all 14 teams determined for the postseason.', source: 'CBS Sports', date: '2025-01-05' },
    { id: 4, title: 'Wild Card Weekend 2025 Schedule', content: 'Wild Card Weekend 2025 games have been announced with thrilling matchups ahead.', source: 'NFL.com', date: '2025-01-05' },
    { id: 5, title: '2025 MVP Race Down to Finalists', content: 'Lamar Jackson, Josh Allen, and Dak Prescott lead the 2025 MVP conversation heading into playoffs.', source: 'NFL.com', date: '2025-01-04' },
    { id: 6, title: '49ers Look to Repeat as Champions', content: 'San Francisco 49ers aim to defend their Super Bowl title in the 2025 playoffs.', source: 'NFL.com', date: '2025-01-04' },
    { id: 7, title: 'Rookie Sensations Shine in 2025', content: 'Several rookie players have made immediate impact in their first NFL season.', source: 'ESPN', date: '2025-01-03' }
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
