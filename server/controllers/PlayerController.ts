import { Request, Response } from 'express';
import prisma from '../database/client';
import { logger } from '../utils/logger';
import { createError } from '../middleware/errorHandler';
import { ApiResponse, Player, PlayerWithTeam } from '../types';

export class PlayerController {
  async getPlayers(req: Request, res: Response): Promise<void> {
    try {
      const {
        page = 1,
        limit = 50,
        sortBy = 'name',
        sortOrder = 'asc',
        position,
        teamId,
        status
      } = req.query;

      const skip = (Number(page) - 1) * Number(limit);
      const take = Number(limit);

      // Build where clause
      const where: any = {};
      
      if (position) where.position = position;
      if (teamId) where.teamId = teamId;
      if (status) where.status = status;

      // Build orderBy clause
      const orderBy: any = {};
      orderBy[sortBy as string] = sortOrder;

      const [players, total] = await Promise.all([
        prisma.player.findMany({
          where,
          include: {
            team: true
          },
          orderBy,
          skip,
          take
        }),
        prisma.player.count({ where })
      ]);

      const totalPages = Math.ceil(total / take);

      const response: ApiResponse<{
        players: PlayerWithTeam[];
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
          players,
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
      logger.error('Error fetching players:', error);
      throw createError('Failed to fetch players', 500);
    }
  }

  async getPlayerById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const player = await prisma.player.findUnique({
        where: { id },
        include: {
          team: true,
          playerStats: {
            include: {
              game: {
                include: {
                  homeTeam: true,
                  awayTeam: true
                }
              }
            },
            orderBy: {
              createdAt: 'desc'
            },
            take: 10
          }
        }
      });

      if (!player) {
        throw createError('Player not found', 404);
      }

      const response: ApiResponse<PlayerWithTeam> = {
        success: true,
        data: player
      };

      res.json(response);
    } catch (error) {
      logger.error('Error fetching player by ID:', error);
      if (error.statusCode) throw error;
      throw createError('Failed to fetch player', 500);
    }
  }

  async getPlayerStats(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { season, gameId } = req.query;

      const where: any = { playerId: id };
      
      if (season) {
        where.game = {
          season: Number(season)
        };
      }
      
      if (gameId) {
        where.gameId = gameId;
      }

      const stats = await prisma.playerStats.findMany({
        where,
        include: {
          game: {
            include: {
              homeTeam: true,
              awayTeam: true
            }
          },
          team: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      // Calculate season totals if season is specified
      let seasonTotals = null;
      if (season && stats.length > 0) {
        seasonTotals = {
          passAttempts: stats.reduce((sum, stat) => sum + stat.passAttempts, 0),
          passCompletions: stats.reduce((sum, stat) => sum + stat.passCompletions, 0),
          passYards: stats.reduce((sum, stat) => sum + stat.passYards, 0),
          passTDs: stats.reduce((sum, stat) => sum + stat.passTDs, 0),
          interceptions: stats.reduce((sum, stat) => sum + stat.interceptions, 0),
          rushAttempts: stats.reduce((sum, stat) => sum + stat.rushAttempts, 0),
          rushYards: stats.reduce((sum, stat) => sum + stat.rushYards, 0),
          rushTDs: stats.reduce((sum, stat) => sum + stat.rushTDs, 0),
          receptions: stats.reduce((sum, stat) => sum + stat.receptions, 0),
          receivingYards: stats.reduce((sum, stat) => sum + stat.receivingYards, 0),
          receivingTDs: stats.reduce((sum, stat) => sum + stat.receivingTDs, 0),
          tackles: stats.reduce((sum, stat) => sum + stat.tackles, 0),
          sacks: stats.reduce((sum, stat) => sum + stat.sacks, 0),
          fumbles: stats.reduce((sum, stat) => sum + stat.fumbles, 0)
        };
      }

      const response: ApiResponse<{
        stats: any[];
        seasonTotals?: any;
      }> = {
        success: true,
        data: {
          stats,
          ...(seasonTotals && { seasonTotals })
        }
      };

      res.json(response);
    } catch (error) {
      logger.error('Error fetching player stats:', error);
      throw createError('Failed to fetch player stats', 500);
    }
  }

  async getPlayersByPosition(req: Request, res: Response): Promise<void> {
    try {
      const { position } = req.params;
      const { page = 1, limit = 50, teamId } = req.query;

      const skip = (Number(page) - 1) * Number(limit);
      const take = Number(limit);

      const where: any = { position };
      if (teamId) where.teamId = teamId;

      const [players, total] = await Promise.all([
        prisma.player.findMany({
          where,
          include: {
            team: true
          },
          orderBy: [
            { team: { name: 'asc' } },
            { number: 'asc' }
          ],
          skip,
          take
        }),
        prisma.player.count({ where })
      ]);

      const totalPages = Math.ceil(total / take);

      const response: ApiResponse<{
        players: PlayerWithTeam[];
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
          players,
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
      logger.error('Error fetching players by position:', error);
      throw createError('Failed to fetch players by position', 500);
    }
  }

  async getPlayersByTeam(req: Request, res: Response): Promise<void> {
    try {
      const { teamId } = req.params;
      const { page = 1, limit = 100, position } = req.query;

      const skip = (Number(page) - 1) * Number(limit);
      const take = Number(limit);

      const where: any = { teamId };
      if (position) where.position = position;

      const [players, total] = await Promise.all([
        prisma.player.findMany({
          where,
          include: {
            team: true
          },
          orderBy: [
            { position: 'asc' },
            { number: 'asc' }
          ],
          skip,
          take
        }),
        prisma.player.count({ where })
      ]);

      const totalPages = Math.ceil(total / take);

      const response: ApiResponse<{
        players: PlayerWithTeam[];
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
          players,
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
      logger.error('Error fetching players by team:', error);
      throw createError('Failed to fetch players by team', 500);
    }
  }
}
