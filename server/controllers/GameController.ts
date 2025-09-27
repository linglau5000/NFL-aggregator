import { Request, Response } from 'express';
import prisma from '../database/client';
import { logger } from '../utils/logger';
import { createError } from '../middleware/errorHandler';
import { ApiResponse, GameWithTeams, GameWithStats, PaginationParams } from '../types';

export class GameController {
  async getGames(req: Request, res: Response): Promise<void> {
    try {
      const {
        page = 1,
        limit = 20,
        sortBy = 'date',
        sortOrder = 'desc',
        season,
        week,
        status,
        teamId
      } = req.query;

      const skip = (Number(page) - 1) * Number(limit);
      const take = Number(limit);

      // Build where clause
      const where: any = {};
      
      if (season) where.season = Number(season);
      if (week) where.week = Number(week);
      if (status) where.status = status;
      if (teamId) {
        where.OR = [
          { homeTeamId: teamId },
          { awayTeamId: teamId }
        ];
      }

      // Build orderBy clause
      const orderBy: any = {};
      orderBy[sortBy as string] = sortOrder;

      const [games, total] = await Promise.all([
        prisma.game.findMany({
          where,
          include: {
            homeTeam: true,
            awayTeam: true,
            gameStats: {
              include: {
                team: true
              }
            }
          },
          orderBy,
          skip,
          take
        }),
        prisma.game.count({ where })
      ]);

      const totalPages = Math.ceil(total / take);

      const response: ApiResponse<{
        games: GameWithTeams[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
          hasNext: boolean;
          hasPrev: boolean;
        };
      }> = {
        success: true,
        data: {
          games,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages,
            hasNext: Number(page) < totalPages,
            hasPrev: Number(page) > 1
          }
        }
      };

      res.json(response);
    } catch (error) {
      logger.error('Error fetching games:', error);
      throw createError('Failed to fetch games', 500);
    }
  }

  async getCurrentGames(req: Request, res: Response): Promise<void> {
    try {
      const currentDate = new Date();
      const currentSeason = currentDate.getFullYear();
      
      // Calculate current week (simplified - in real app, use NFL's official week calculation)
      const currentWeek = Math.min(18, Math.max(1, Math.ceil((currentDate.getTime() - new Date(`${currentSeason}-09-01`).getTime()) / (7 * 24 * 60 * 60 * 1000))));

      const games = await prisma.game.findMany({
        where: {
          season: currentSeason,
          week: currentWeek
        },
        include: {
          homeTeam: true,
          awayTeam: true,
          gameStats: {
            include: {
              team: true
            }
          }
        },
        orderBy: {
          date: 'asc'
        }
      });

      const response: ApiResponse<GameWithTeams[]> = {
        success: true,
        data: games
      };

      res.json(response);
    } catch (error) {
      logger.error('Error fetching current games:', error);
      throw createError('Failed to fetch current games', 500);
    }
  }

  async getGamesBySeason(req: Request, res: Response): Promise<void> {
    try {
      const { season } = req.params;
      const { week } = req.query;

      const where: any = {
        season: Number(season)
      };

      if (week) {
        where.week = Number(week);
      }

      const games = await prisma.game.findMany({
        where,
        include: {
          homeTeam: true,
          awayTeam: true,
          gameStats: {
            include: {
              team: true
            }
          }
        },
        orderBy: [
          { week: 'asc' },
          { date: 'asc' }
        ]
      });

      const response: ApiResponse<GameWithTeams[]> = {
        success: true,
        data: games
      };

      res.json(response);
    } catch (error) {
      logger.error('Error fetching games by season:', error);
      throw createError('Failed to fetch games by season', 500);
    }
  }

  async getGamesByWeek(req: Request, res: Response): Promise<void> {
    try {
      const { week } = req.params;
      const { season } = req.query;

      const currentSeason = season ? Number(season) : new Date().getFullYear();

      const games = await prisma.game.findMany({
        where: {
          season: currentSeason,
          week: Number(week)
        },
        include: {
          homeTeam: true,
          awayTeam: true,
          gameStats: {
            include: {
              team: true
            }
          }
        },
        orderBy: {
          date: 'asc'
        }
      });

      const response: ApiResponse<GameWithTeams[]> = {
        success: true,
        data: games
      };

      res.json(response);
    } catch (error) {
      logger.error('Error fetching games by week:', error);
      throw createError('Failed to fetch games by week', 500);
    }
  }

  async getGamesByTeam(req: Request, res: Response): Promise<void> {
    try {
      const { teamId } = req.params;
      const { page = 1, limit = 20 } = req.query;

      const skip = (Number(page) - 1) * Number(limit);
      const take = Number(limit);

      const [games, total] = await Promise.all([
        prisma.game.findMany({
          where: {
            OR: [
              { homeTeamId: teamId },
              { awayTeamId: teamId }
            ]
          },
          include: {
            homeTeam: true,
            awayTeam: true,
            gameStats: {
              include: {
                team: true
              }
            }
          },
          orderBy: {
            date: 'desc'
          },
          skip,
          take
        }),
        prisma.game.count({
          where: {
            OR: [
              { homeTeamId: teamId },
              { awayTeamId: teamId }
            ]
          }
        })
      ]);

      const totalPages = Math.ceil(total / take);

      const response: ApiResponse<{
        games: GameWithTeams[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
          hasNext: boolean;
          hasPrev: boolean;
        };
      }> = {
        success: true,
        data: {
          games,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages,
            hasNext: Number(page) < totalPages,
            hasPrev: Number(page) > 1
          }
        }
      };

      res.json(response);
    } catch (error) {
      logger.error('Error fetching games by team:', error);
      throw createError('Failed to fetch games by team', 500);
    }
  }

  async getGameById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const game = await prisma.game.findUnique({
        where: { id },
        include: {
          homeTeam: true,
          awayTeam: true,
          gameStats: {
            include: {
              team: true
            }
          },
          playerStats: {
            include: {
              player: true,
              team: true
            }
          }
        }
      });

      if (!game) {
        throw createError('Game not found', 404);
      }

      const response: ApiResponse<GameWithStats> = {
        success: true,
        data: game
      };

      res.json(response);
    } catch (error) {
      logger.error('Error fetching game by ID:', error);
      if (error.statusCode) throw error;
      throw createError('Failed to fetch game', 500);
    }
  }

  async getGameStats(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const game = await prisma.game.findUnique({
        where: { id },
        include: {
          gameStats: {
            include: {
              team: true
            }
          }
        }
      });

      if (!game) {
        throw createError('Game not found', 404);
      }

      const response: ApiResponse<any> = {
        success: true,
        data: game.gameStats
      };

      res.json(response);
    } catch (error) {
      logger.error('Error fetching game stats:', error);
      if (error.statusCode) throw error;
      throw createError('Failed to fetch game stats', 500);
    }
  }

  async getGamePlayerStats(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const game = await prisma.game.findUnique({
        where: { id },
        include: {
          playerStats: {
            include: {
              player: true,
              team: true
            }
          }
        }
      });

      if (!game) {
        throw createError('Game not found', 404);
      }

      const response: ApiResponse<any> = {
        success: true,
        data: game.playerStats
      };

      res.json(response);
    } catch (error) {
      logger.error('Error fetching game player stats:', error);
      if (error.statusCode) throw error;
      throw createError('Failed to fetch game player stats', 500);
    }
  }
}
