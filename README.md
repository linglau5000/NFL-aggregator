# NFL Aggregator

A comprehensive full-stack NFL games aggregator with stats, insights, and leaderboards. Built with TypeScript, Express.js, React, and PostgreSQL.

## 🏈 Features

- **Real-time Game Data**: Live scores, schedules, and game updates
- **Advanced Statistics**: Player and team performance metrics
- **Interactive Leaderboards**: Top performers across all categories
- **Team Management**: Complete team rosters and information
- **News Integration**: Latest NFL news and updates
- **Responsive Design**: Modern, mobile-first UI
- **High Performance**: Optimized with caching and compression
- **Security First**: Comprehensive security measures and vulnerability scanning
- **90%+ Test Coverage**: Extensive unit and integration tests

## 🚀 Tech Stack

### Backend
- **Node.js** with **TypeScript**
- **Express.js** for API framework
- **PostgreSQL** with **Prisma ORM**
- **Jest** for testing (90%+ coverage)
- **Winston** for logging
- **Helmet** for security
- **Rate limiting** and **CORS** protection

### Frontend
- **React 18** with **TypeScript**
- **Styled Components** for styling
- **React Router** for navigation
- **Axios** for API calls
- **React Icons** for UI elements

### DevOps & Deployment
- **Railway** for hosting
- **Docker** support
- **CI/CD** pipeline
- **Security scanning** with Snyk
- **Code quality** with ESLint and Prettier

## 📊 API Endpoints

### Games
- `GET /api/games` - Get all games with pagination
- `GET /api/games/current` - Get current week games
- `GET /api/games/season/:season` - Get games by season
- `GET /api/games/week/:week` - Get games by week
- `GET /api/games/team/:teamId` - Get games by team
- `GET /api/games/:id` - Get specific game
- `GET /api/games/:id/stats` - Get game statistics

### Teams
- `GET /api/teams` - Get all teams
- `GET /api/teams/:id` - Get specific team
- `GET /api/teams/:id/players` - Get team players
- `GET /api/teams/:id/games` - Get team games
- `GET /api/teams/:id/stats` - Get team statistics
- `GET /api/teams/conference/:conference` - Get teams by conference
- `GET /api/teams/division/:division` - Get teams by division

### Players
- `GET /api/players` - Get all players
- `GET /api/players/:id` - Get specific player
- `GET /api/players/:id/stats` - Get player statistics
- `GET /api/players/position/:position` - Get players by position
- `GET /api/players/team/:teamId` - Get players by team

### Statistics
- `GET /api/stats/season/:season` - Get season statistics
- `GET /api/stats/team/:teamId` - Get team statistics
- `GET /api/stats/player/:playerId` - Get player statistics
- `GET /api/stats/leaders` - Get statistical leaders

### Leaderboards
- `GET /api/leaderboards` - Get all leaderboards
- `GET /api/leaderboards/category/:category` - Get leaderboard by category
- `GET /api/leaderboards/season/:season` - Get leaderboards for season
- `GET /api/leaderboards/week/:week` - Get leaderboards for week

### News
- `GET /api/news` - Get all news
- `GET /api/news/category/:category` - Get news by category
- `GET /api/news/latest` - Get latest news

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/linglau5000/NFL-aggregator.git
   cd NFL-aggregator
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Run database migrations
   npm run db:migrate
   
   # Seed the database
   npm run db:seed
   ```

5. **Start development servers**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:5000` and the frontend at `http://localhost:3000`.

## 🧪 Testing

### Run all tests
```bash
npm test
```

### Run tests with coverage
```bash
npm run test:coverage
```

### Run tests in watch mode
```bash
npm run test:watch
```

## 🔒 Security

### Security Scanning
```bash
# Run security audit
npm run security:audit

# Run Snyk vulnerability scan
npm run security:scan
```

### Code Quality
```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

## 🚀 Deployment

### Railway Deployment

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**
   ```bash
   railway login
   ```

3. **Deploy to Railway**
   ```bash
   railway deploy
   ```

### Environment Variables for Production

Set these environment variables in Railway:

```env
DATABASE_URL=postgresql://username:password@host:port/database
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.com
JWT_SECRET=your-super-secret-jwt-key
```

## 📈 Performance Features

- **Database Indexing**: Optimized queries with proper indexes
- **Caching**: Redis caching for frequently accessed data
- **Compression**: Gzip compression for API responses
- **Rate Limiting**: Protection against abuse
- **Connection Pooling**: Efficient database connections

## 🔧 Database Schema

The application uses a comprehensive PostgreSQL schema with the following main entities:

- **Teams**: NFL team information
- **Players**: Player details and stats
- **Games**: Game schedules and results
- **GameStats**: Team performance in games
- **PlayerStats**: Individual player performance
- **TeamStats**: Season-long team statistics
- **Leaderboards**: Statistical rankings
- **News**: NFL news and updates

## 📱 Frontend Features

- **Responsive Design**: Works on all device sizes
- **Dark/Light Mode**: User preference support
- **Real-time Updates**: Live data refresh
- **Interactive Charts**: Statistical visualizations
- **Search & Filter**: Advanced data filtering
- **Pagination**: Efficient data loading

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, please open an issue on GitHub or contact the development team.

## 🔗 Links

- **API Documentation**: `/api` endpoint
- **Health Check**: `/health` endpoint
- **GitHub Repository**: https://github.com/linglau5000/NFL-aggregator
- **Live Demo**: [Deployed on Railway]

---

Built with ❤️ for NFL fans everywhere!