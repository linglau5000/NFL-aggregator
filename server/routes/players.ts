import { Router } from 'express';
import { PlayerController } from '../controllers/PlayerController';
import { validatePagination, validatePlayerId } from '../middleware/validateRequest';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();
const playerController = new PlayerController();

// GET /api/players - Get all players
router.get('/', validatePagination, asyncHandler(playerController.getPlayers.bind(playerController)));

// GET /api/players/:id - Get specific player
router.get('/:id', validatePlayerId, asyncHandler(playerController.getPlayerById.bind(playerController)));

// GET /api/players/:id/stats - Get player statistics
router.get('/:id/stats', validatePlayerId, asyncHandler(playerController.getPlayerStats.bind(playerController)));

// GET /api/players/position/:position - Get players by position
router.get('/position/:position', validatePagination, asyncHandler(playerController.getPlayersByPosition.bind(playerController)));

// GET /api/players/team/:teamId - Get players by team
router.get('/team/:teamId', validatePagination, asyncHandler(playerController.getPlayersByTeam.bind(playerController)));

export default router;
