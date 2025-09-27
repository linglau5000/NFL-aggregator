import { Request, Response } from 'express';
import prisma from '../database/client';
import { logger } from '../utils/logger';
import { createError } from '../middleware/errorHandler';
import { ApiResponse, Team, PlayerWithTeam } from '../types';

export class TeamController {
  async getTeams(req: Request, res: Response): Promise<void> {
    try {
      const {
        page = 1,
        limit = 32,
        sortBy = 'name',
        sortOrder = 'asc',
        conference,
        division
      } = req.query;

      const skip = (Number(page) - 1) * Number(limit);
      const take = Number(limit);

      // Build where clause
      const where: any = {};
      
      if (conference) where.conference = conference;
      if (division) where.division = division;

      // Build orderBy clause
      const orderBy: any = {};
      orderBy[sortBy as string] = sortOrder;

      const [teams, total] = await Promise.all([
        prisma.team.findMany({
          where,
          orderBy,
          skip,
          take
        }),
        prisma.team.count({ where })
      ]);

      const totalPages = Math.ceil(total / take);

      const response: ApiResponse<{
        teams: Team[];
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
          teams,
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
      logger.error('Error fetching teams:', error);
      throw createError('Failed to fetch teams', 500);
    }
  }

  async getTeamById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const team = await prisma.team.findUnique({
        where: { id },
        include: {
          players: true,
          teamStats: {
            orderBy: {
              season: 'desc'
            }
          }
        }
      });

      if (!team) {
        throw createError('Team not found', 404);
      }

      const response: ApiResponse<Team> = {
        success: true,
        data: team
      };

      res.json(response);
    } catch (error) {
      logger.error('Error fetching team by ID:', error);
      if (error.statusCode) throw error;
      throw createError('Failed to fetch team', 500);
    }
  }

  async getTeamPlayers(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { position } = req.query;

      const where: any = { teamId: id };
      if (position) where.position = position;

      const players = await prisma.player.findMany({
        where,
        include: {
          team: true
        },
        orderBy: [
          { position: 'asc' },
          { number: 'asc' }
        ]
      });

      const response: ApiResponse<PlayerWithTeam[]> = {
        success: true,
        data: players
      };

      res.json(response);
    } catch (error) {
      logger.error('Error fetching team players:', error);
      throw createError('Failed to fetch team players', 500);
    }
  }

  async getTeamGames(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { page = 1, limit = 20, season } = req.query;

      const skip = (Number(page) - 1) * Number(limit);
      const take = Number(limit);

      const where: any = {
        OR: [
          { homeTeamId: id },
          { awayTeamId: id }
        ]
      };

      if (season) where.season = Number(season);

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
          orderBy: {
            date: 'desc'
          },
          skip,
          take
        }),
        prisma.game.count({ where })
      ]);

      const totalPages = Math.ceil(total / take);

      const response: ApiResponse<{
        games: any[];
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
      logger.error('Error fetching team games:', error);
      throw createError('Failed to fetch team games', 500);
    }
  }

  async getTeamStats(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { season } = req.query;

      const where: any = { teamId: id };
      if (season) where.season = Number(season);

      const stats = await prisma.teamStats.findMany({
        where,
        include: {
          team: true
        },
        orderBy: {
          season: 'desc'
        }
      });

      const response: ApiResponse<any[]> = {
        success: true,
        data: stats
      };

      res.json(response);
    } catch (error) {
      logger.error('Error fetching team stats:', error);
      throw createError('Failed to fetch team stats', 500);
    }
  }

  async getTeamsByConference(req: Request, res: Response): Promise<void> {
    try {
      const { conference } = req.params;
      const { page = 1, limit = 16 } = req.query;

      const skip = (Number(page) - 1) * Number(limit);
      const take = Number(limit);

      const [teams, total] = await Promise.all([
        prisma.team.findMany({
          where: { conference },
          orderBy: [
            { division: 'asc' },
            { name: 'asc' }
          ],
          skip,
          take
        }),
        prisma.team.count({ where: { conference } })
      ]);

      const totalPages = Math.ceil(total / take);

      const response: ApiResponse<{
        teams: Team[];
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
          teams,
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
      logger.error('Error fetching teams by conference:', error);
      throw createError('Failed to fetch teams by conference', 500);
    }
  }

  async getTeamsByDivision(req: Request, res: Response): Promise<void> {
    try {
      const { division } = req.params;
      const { page = 1, limit = 4 } = req.query;

      const skip = (Number(page) - 1) * Number(limit);
      const take = Number(limit);

      const [teams, total] = await Promise.all([
        prisma.team.findMany({
          where: { division },
          orderBy: { name: 'asc' },
          skip,
          take
        }),
        prisma.team.count({ where: { division } })
      ]);

      const totalPages = Math.ceil(total / take);

      const response: ApiResponse<{
        teams: Team[];
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
          teams,
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
      logger.error('Error fetching teams by division:', error);
      throw createError('Failed to fetch teams by division', 500);
    }
  }
}
