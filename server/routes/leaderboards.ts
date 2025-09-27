import { Router } from 'express';
import { LeaderboardController } from '../controllers/LeaderboardController';
import { validatePagination, validateSeason } from '../middleware/validateRequest';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();
const leaderboardController = new LeaderboardController();

// GET /api/leaderboards - Get all leaderboards
router.get('/', validatePagination, asyncHandler(leaderboardController.getLeaderboards.bind(leaderboardController)));

// GET /api/leaderboards/category/:category - Get leaderboard by category
router.get('/category/:category', validatePagination, asyncHandler(leaderboardController.getLeaderboardByCategory.bind(leaderboardController)));

// GET /api/leaderboards/season/:season - Get leaderboards for season
router.get('/season/:season', validateSeason, asyncHandler(leaderboardController.getLeaderboardsBySeason.bind(leaderboardController)));

// GET /api/leaderboards/week/:week - Get leaderboards for week
router.get('/week/:week', validateSeason, asyncHandler(leaderboardController.getLeaderboardsByWeek.bind(leaderboardController)));

export default router;
