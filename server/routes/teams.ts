import { Router } from 'express';
import { TeamController } from '../controllers/TeamController';
import { validatePagination, validateTeamId } from '../middleware/validateRequest';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();
const teamController = new TeamController();

// GET /api/teams - Get all teams
router.get('/', validatePagination, asyncHandler(teamController.getTeams.bind(teamController)));

// GET /api/teams/:id - Get specific team
router.get('/:id', validateTeamId, asyncHandler(teamController.getTeamById.bind(teamController)));

// GET /api/teams/:id/players - Get team players
router.get('/:id/players', validateTeamId, asyncHandler(teamController.getTeamPlayers.bind(teamController)));

// GET /api/teams/:id/games - Get team games
router.get('/:id/games', validateTeamId, validatePagination, asyncHandler(teamController.getTeamGames.bind(teamController)));

// GET /api/teams/:id/stats - Get team statistics
router.get('/:id/stats', validateTeamId, asyncHandler(teamController.getTeamStats.bind(teamController)));

// GET /api/teams/conference/:conference - Get teams by conference
router.get('/conference/:conference', validatePagination, asyncHandler(teamController.getTeamsByConference.bind(teamController)));

// GET /api/teams/division/:division - Get teams by division
router.get('/division/:division', validatePagination, asyncHandler(teamController.getTeamsByDivision.bind(teamController)));

export default router;
