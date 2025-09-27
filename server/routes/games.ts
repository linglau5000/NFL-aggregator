import { Router } from 'express';
import { GameController } from '../controllers/GameController';
import { validatePagination, validateGameId, validateSeason } from '../middleware/validateRequest';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();
const gameController = new GameController();

// GET /api/games - Get all games with optional filters
router.get('/', validatePagination, asyncHandler(gameController.getGames.bind(gameController)));

// GET /api/games/current - Get current week games
router.get('/current', asyncHandler(gameController.getCurrentGames.bind(gameController)));

// GET /api/games/season/:season - Get games for specific season
router.get('/season/:season', validateSeason, asyncHandler(gameController.getGamesBySeason.bind(gameController)));

// GET /api/games/week/:week - Get games for specific week
router.get('/week/:week', validateSeason, asyncHandler(gameController.getGamesByWeek.bind(gameController)));

// GET /api/games/team/:teamId - Get games for specific team
router.get('/team/:teamId', validatePagination, asyncHandler(gameController.getGamesByTeam.bind(gameController)));

// GET /api/games/:id - Get specific game
router.get('/:id', validateGameId, asyncHandler(gameController.getGameById.bind(gameController)));

// GET /api/games/:id/stats - Get game statistics
router.get('/:id/stats', validateGameId, asyncHandler(gameController.getGameStats.bind(gameController)));

// GET /api/games/:id/players - Get player stats for game
router.get('/:id/players', validateGameId, asyncHandler(gameController.getGamePlayerStats.bind(gameController)));

export default router;
