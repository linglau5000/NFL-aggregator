import { Router } from 'express';
import { StatsController } from '../controllers/StatsController';
import { validatePagination, validateSeason } from '../middleware/validateRequest';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();
const statsController = new StatsController();

// GET /api/stats/season/:season - Get season statistics
router.get('/season/:season', validateSeason, asyncHandler(statsController.getSeasonStats.bind(statsController)));

// GET /api/stats/team/:teamId - Get team statistics
router.get('/team/:teamId', validatePagination, asyncHandler(statsController.getTeamStats.bind(statsController)));

// GET /api/stats/player/:playerId - Get player statistics
router.get('/player/:playerId', validatePagination, asyncHandler(statsController.getPlayerStats.bind(statsController)));

// GET /api/stats/leaders - Get statistical leaders
router.get('/leaders', validatePagination, asyncHandler(statsController.getStatisticalLeaders.bind(statsController)));

export default router;
