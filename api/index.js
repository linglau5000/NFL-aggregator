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
    // Week 1 - September 7-8, 2025 (Completed)
    { id: 1, homeTeam: 'Buffalo Bills', awayTeam: 'New England Patriots', homeScore: 28, awayScore: 14, status: 'completed', date: '2025-09-07', time: '13:00' },
    { id: 2, homeTeam: 'Kansas City Chiefs', awayTeam: 'Houston Texans', homeScore: 31, awayScore: 17, status: 'completed', date: '2025-09-07', time: '16:25' },
    { id: 3, homeTeam: 'Dallas Cowboys', awayTeam: 'Cleveland Browns', homeScore: 24, awayScore: 21, status: 'completed', date: '2025-09-07', time: '20:20' },
    { id: 4, homeTeam: 'San Francisco 49ers', awayTeam: 'New York Jets', homeScore: 35, awayScore: 7, status: 'completed', date: '2025-09-08', time: '16:25' },
    
    // Week 2 - September 14-15, 2025 (Completed)
    { id: 5, homeTeam: 'Miami Dolphins', awayTeam: 'Jacksonville Jaguars', homeScore: 27, awayScore: 20, status: 'completed', date: '2025-09-14', time: '13:00' },
    { id: 6, homeTeam: 'Baltimore Ravens', awayTeam: 'Las Vegas Raiders', homeScore: 30, awayScore: 13, status: 'completed', date: '2025-09-14', time: '16:25' },
    { id: 7, homeTeam: 'Detroit Lions', awayTeam: 'Tampa Bay Buccaneers', homeScore: 28, awayScore: 24, status: 'completed', date: '2025-09-14', time: '13:00' },
    { id: 8, homeTeam: 'Philadelphia Eagles', awayTeam: 'Atlanta Falcons', homeScore: 31, awayScore: 17, status: 'completed', date: '2025-09-15', time: '20:15' },
    
    // Week 3 - September 21-22, 2025 (Completed)
    { id: 9, homeTeam: 'Buffalo Bills', awayTeam: 'Miami Dolphins', homeScore: 31, awayScore: 24, status: 'completed', date: '2025-09-21', time: '13:00' },
    { id: 10, homeTeam: 'Kansas City Chiefs', awayTeam: 'Denver Broncos', homeScore: 28, awayScore: 17, status: 'completed', date: '2025-09-21', time: '16:25' },
    { id: 11, homeTeam: 'Dallas Cowboys', awayTeam: 'New York Giants', homeScore: 24, awayScore: 21, status: 'completed', date: '2025-09-21', time: '20:20' },
    { id: 12, homeTeam: 'San Francisco 49ers', awayTeam: 'Los Angeles Rams', homeScore: 35, awayScore: 14, status: 'completed', date: '2025-09-22', time: '16:25' },
    
    // Week 4 - September 28-29, 2025 (This Week - Mix of completed and upcoming)
    { id: 13, homeTeam: 'Baltimore Ravens', awayTeam: 'Cincinnati Bengals', homeScore: 27, awayScore: 20, status: 'completed', date: '2025-09-28', time: '13:00' },
    { id: 14, homeTeam: 'Detroit Lions', awayTeam: 'Chicago Bears', homeScore: 30, awayScore: 23, status: 'completed', date: '2025-09-28', time: '13:00' },
    { id: 15, homeTeam: 'Tampa Bay Buccaneers', awayTeam: 'New Orleans Saints', homeScore: 0, awayScore: 0, status: 'scheduled', date: '2025-09-29', time: '13:00' },
    { id: 16, homeTeam: 'Pittsburgh Steelers', awayTeam: 'Indianapolis Colts', homeScore: 0, awayScore: 0, status: 'scheduled', date: '2025-09-29', time: '16:25' },
    { id: 17, homeTeam: 'Miami Dolphins', awayTeam: 'New York Jets', homeScore: 0, awayScore: 0, status: 'scheduled', date: '2025-09-29', time: '20:20' },
    
    // Week 5 - October 5-6, 2025 (Upcoming)
    { id: 18, homeTeam: 'Buffalo Bills', awayTeam: 'Houston Texans', homeScore: 0, awayScore: 0, status: 'scheduled', date: '2025-10-05', time: '13:00' },
    { id: 19, homeTeam: 'Kansas City Chiefs', awayTeam: 'Las Vegas Raiders', homeScore: 0, awayScore: 0, status: 'scheduled', date: '2025-10-05', time: '16:25' },
    { id: 20, homeTeam: 'Dallas Cowboys', awayTeam: 'Washington Commanders', homeScore: 0, awayScore: 0, status: 'scheduled', date: '2025-10-05', time: '20:20' },
    { id: 21, homeTeam: 'San Francisco 49ers', awayTeam: 'Arizona Cardinals', homeScore: 0, awayScore: 0, status: 'scheduled', date: '2025-10-06', time: '16:25' },
    
    // Week 6 - October 12-13, 2025 (Upcoming)
    { id: 22, homeTeam: 'Baltimore Ravens', awayTeam: 'Cleveland Browns', homeScore: 0, awayScore: 0, status: 'scheduled', date: '2025-10-12', time: '13:00' },
    { id: 23, homeTeam: 'Detroit Lions', awayTeam: 'Green Bay Packers', homeScore: 0, awayScore: 0, status: 'scheduled', date: '2025-10-12', time: '16:25' },
    { id: 24, homeTeam: 'Philadelphia Eagles', awayTeam: 'New Orleans Saints', homeScore: 0, awayScore: 0, status: 'scheduled', date: '2025-10-12', time: '20:20' },
    { id: 25, homeTeam: 'Miami Dolphins', awayTeam: 'Denver Broncos', homeScore: 0, awayScore: 0, status: 'scheduled', date: '2025-10-13', time: '16:25' },
    
    // Week 7 - October 19-20, 2025 (Upcoming)
    { id: 26, homeTeam: 'Buffalo Bills', awayTeam: 'New York Jets', homeScore: 0, awayScore: 0, status: 'scheduled', date: '2025-10-19', time: '13:00' },
    { id: 27, homeTeam: 'Kansas City Chiefs', awayTeam: 'Los Angeles Chargers', homeScore: 0, awayScore: 0, status: 'scheduled', date: '2025-10-19', time: '16:25' },
    { id: 28, homeTeam: 'Dallas Cowboys', awayTeam: 'Philadelphia Eagles', homeScore: 0, awayScore: 0, status: 'scheduled', date: '2025-10-19', time: '20:20' },
    { id: 29, homeTeam: 'San Francisco 49ers', awayTeam: 'Seattle Seahawks', homeScore: 0, awayScore: 0, status: 'scheduled', date: '2025-10-20', time: '16:25' }
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
    { id: 1, title: 'Ravens and Lions Secure Week 4 Victories', content: 'Baltimore Ravens defeated Cincinnati Bengals 27-20 while Detroit Lions beat Chicago Bears 30-23 in Sunday action.', source: 'NFL.com', date: '2025-09-28' },
    { id: 2, title: 'Week 4 Sunday Night Football: Dolphins vs Jets', content: 'Miami Dolphins face New York Jets in a crucial AFC East matchup on Sunday Night Football.', source: 'ESPN', date: '2025-09-28' },
    { id: 3, title: 'Bills Continue Strong Start with 3-1 Record', content: 'Buffalo Bills have won three of their first four games, including a 31-24 victory over Miami Dolphins in Week 3.', source: 'CBS Sports', date: '2025-09-25' },
    { id: 4, title: '49ers Look Unstoppable in Early Season', content: 'San Francisco 49ers are 4-0 after dominating the Los Angeles Rams 35-14, showing they\'re the team to beat.', source: 'NFL.com', date: '2025-09-25' },
    { id: 5, title: 'Chiefs Maintain AFC West Lead', content: 'Kansas City Chiefs improved to 3-1 with a 28-17 victory over Denver Broncos, maintaining their division lead.', source: 'NFL.com', date: '2025-09-25' },
    { id: 6, title: 'Cowboys Edge Giants in NFC East Battle', content: 'Dallas Cowboys secured a 24-21 win over New York Giants in a hard-fought divisional matchup.', source: 'ESPN', date: '2025-09-25' },
    { id: 7, title: 'Week 5 Preview: Key Matchups Ahead', content: 'Next week features Bills vs Texans, Chiefs vs Raiders, and Cowboys vs Commanders in exciting matchups.', source: 'NFL.com', date: '2025-09-28' },
    { id: 8, title: 'Injury Updates: Key Players Status for Week 5', content: 'Several star players are dealing with injuries as teams prepare for Week 5 action.', source: 'ESPN', date: '2025-09-28' },
    { id: 9, title: 'Rookie Quarterbacks Making Early Impact', content: 'Several rookie QBs have shown promise in the first month of the 2025 NFL season.', source: 'NFL.com', date: '2025-09-27' },
    { id: 10, title: 'Defensive Standouts Through Week 4', content: 'T.J. Watt and other defensive stars are putting up impressive numbers early in the season.', source: 'ESPN', date: '2025-09-27' }
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
