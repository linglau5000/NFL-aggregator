import prisma from './client';
import { logger } from '../utils/logger';

const teams = [
  // AFC East
  { name: 'Buffalo Bills', abbreviation: 'BUF', city: 'Buffalo', conference: 'AFC', division: 'East' },
  { name: 'Miami Dolphins', abbreviation: 'MIA', city: 'Miami', conference: 'AFC', division: 'East' },
  { name: 'New England Patriots', abbreviation: 'NE', city: 'New England', conference: 'AFC', division: 'East' },
  { name: 'New York Jets', abbreviation: 'NYJ', city: 'New York', conference: 'AFC', division: 'East' },
  
  // AFC North
  { name: 'Baltimore Ravens', abbreviation: 'BAL', city: 'Baltimore', conference: 'AFC', division: 'North' },
  { name: 'Cincinnati Bengals', abbreviation: 'CIN', city: 'Cincinnati', conference: 'AFC', division: 'North' },
  { name: 'Cleveland Browns', abbreviation: 'CLE', city: 'Cleveland', conference: 'AFC', division: 'North' },
  { name: 'Pittsburgh Steelers', abbreviation: 'PIT', city: 'Pittsburgh', conference: 'AFC', division: 'North' },
  
  // AFC South
  { name: 'Houston Texans', abbreviation: 'HOU', city: 'Houston', conference: 'AFC', division: 'South' },
  { name: 'Indianapolis Colts', abbreviation: 'IND', city: 'Indianapolis', conference: 'AFC', division: 'South' },
  { name: 'Jacksonville Jaguars', abbreviation: 'JAX', city: 'Jacksonville', conference: 'AFC', division: 'South' },
  { name: 'Tennessee Titans', abbreviation: 'TEN', city: 'Tennessee', conference: 'AFC', division: 'South' },
  
  // AFC West
  { name: 'Denver Broncos', abbreviation: 'DEN', city: 'Denver', conference: 'AFC', division: 'West' },
  { name: 'Kansas City Chiefs', abbreviation: 'KC', city: 'Kansas City', conference: 'AFC', division: 'West' },
  { name: 'Las Vegas Raiders', abbreviation: 'LV', city: 'Las Vegas', conference: 'AFC', division: 'West' },
  { name: 'Los Angeles Chargers', abbreviation: 'LAC', city: 'Los Angeles', conference: 'AFC', division: 'West' },
  
  // NFC East
  { name: 'Dallas Cowboys', abbreviation: 'DAL', city: 'Dallas', conference: 'NFC', division: 'East' },
  { name: 'New York Giants', abbreviation: 'NYG', city: 'New York', conference: 'NFC', division: 'East' },
  { name: 'Philadelphia Eagles', abbreviation: 'PHI', city: 'Philadelphia', conference: 'NFC', division: 'East' },
  { name: 'Washington Commanders', abbreviation: 'WAS', city: 'Washington', conference: 'NFC', division: 'East' },
  
  // NFC North
  { name: 'Chicago Bears', abbreviation: 'CHI', city: 'Chicago', conference: 'NFC', division: 'North' },
  { name: 'Detroit Lions', abbreviation: 'DET', city: 'Detroit', conference: 'NFC', division: 'North' },
  { name: 'Green Bay Packers', abbreviation: 'GB', city: 'Green Bay', conference: 'NFC', division: 'North' },
  { name: 'Minnesota Vikings', abbreviation: 'MIN', city: 'Minnesota', conference: 'NFC', division: 'North' },
  
  // NFC South
  { name: 'Atlanta Falcons', abbreviation: 'ATL', city: 'Atlanta', conference: 'NFC', division: 'South' },
  { name: 'Carolina Panthers', abbreviation: 'CAR', city: 'Carolina', conference: 'NFC', division: 'South' },
  { name: 'New Orleans Saints', abbreviation: 'NO', city: 'New Orleans', conference: 'NFC', division: 'South' },
  { name: 'Tampa Bay Buccaneers', abbreviation: 'TB', city: 'Tampa Bay', conference: 'NFC', division: 'South' },
  
  // NFC West
  { name: 'Arizona Cardinals', abbreviation: 'ARI', city: 'Arizona', conference: 'NFC', division: 'West' },
  { name: 'Los Angeles Rams', abbreviation: 'LAR', city: 'Los Angeles', conference: 'NFC', division: 'West' },
  { name: 'San Francisco 49ers', abbreviation: 'SF', city: 'San Francisco', conference: 'NFC', division: 'West' },
  { name: 'Seattle Seahawks', abbreviation: 'SEA', city: 'Seattle', conference: 'NFC', division: 'West' },
];

async function seedDatabase() {
  try {
    logger.info('Starting database seeding...');

    // Clear existing data
    await prisma.news.deleteMany();
    await prisma.leaderboard.deleteMany();
    await prisma.playerStats.deleteMany();
    await prisma.gameStats.deleteMany();
    await prisma.game.deleteMany();
    await prisma.teamStats.deleteMany();
    await prisma.player.deleteMany();
    await prisma.team.deleteMany();

    logger.info('Cleared existing data');

    // Seed teams
    for (const teamData of teams) {
      await prisma.team.create({
        data: {
          ...teamData,
          colors: {
            primary: '#000000',
            secondary: '#FFFFFF'
          }
        }
      });
    }

    logger.info(`Seeded ${teams.length} teams`);

    // Create some sample news
    const sampleNews = [
      {
        title: 'NFL Season 2024 Kicks Off',
        content: 'The 2024 NFL season is set to begin with exciting matchups and new talent.',
        author: 'NFL Reporter',
        source: 'NFL.com',
        publishedAt: new Date(),
        category: 'general',
        tags: ['season', '2024', 'kickoff']
      },
      {
        title: 'Key Players to Watch This Season',
        content: 'Several star players are expected to make a significant impact this season.',
        author: 'Sports Analyst',
        source: 'ESPN',
        publishedAt: new Date(),
        category: 'players',
        tags: ['players', 'stars', 'season']
      }
    ];

    for (const newsData of sampleNews) {
      await prisma.news.create({
        data: newsData
      });
    }

    logger.info(`Seeded ${sampleNews.length} news articles`);

    logger.info('Database seeding completed successfully!');
  } catch (error) {
    logger.error('Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  seedDatabase()
    .then(() => {
      logger.info('Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Seeding failed:', error);
      process.exit(1);
    });
}

export default seedDatabase;
