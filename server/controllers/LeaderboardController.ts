import { Request, Response } from 'express';
import prisma from '../database/client';
import { logger } from '../utils/logger';
import { createError } from '../middleware/errorHandler';
import { ApiResponse, Leaderboard } from '../types';

export class LeaderboardController {
  async getLeaderboards(req: Request, res: Response): Promise<void> {
    try {
      const {
        page = 1,
        limit = 20,
        sortBy = 'rank',
        sortOrder = 'asc',
        season,
        week,
        category
      } = req.query;

      const skip = (Number(page) - 1) * Number(limit);
      const take = Number(limit);

      // Build where clause
      const where: any = {};
      
      if (season) where.season = Number(season);
      if (week) where.week = Number(week);
      if (category) where.category = category;

      // Build orderBy clause
      const orderBy: any = {};
      orderBy[sortBy as string] = sortOrder;

      const [leaderboards, total] = await Promise.all([
        prisma.leaderboard.findMany({
          where,
          include: {
            player: {
              include: {
                team: true
              }
            },
            team: true
          },
          orderBy,
          skip,
          take
        }),
        prisma.leaderboard.count({ where })
      ]);

      const totalPages = Math.ceil(total / take);

      const response: ApiResponse<{
        leaderboards: Leaderboard[];
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
          leaderboards,
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
      logger.error('Error fetching leaderboards:', error);
      throw createError('Failed to fetch leaderboards', 500);
    }
  }

  async getLeaderboardByCategory(req: Request, res: Response): Promise<void> {
    try {
      const { category } = req.params;
      const { season, week, limit = 20 } = req.query;

      const where: any = { category };
      
      if (season) where.season = Number(season);
      if (week) where.week = Number(week);

      const leaderboards = await prisma.leaderboard.findMany({
        where,
        include: {
          player: {
            include: {
              team: true
            }
          },
          team: true
        },
        orderBy: {
          rank: 'asc'
        },
        take: Number(limit)
      });

      const response: ApiResponse<Leaderboard[]> = {
        success: true,
        data: leaderboards
      };

      res.json(response);
    } catch (error) {
      logger.error('Error fetching leaderboard by category:', error);
      throw createError('Failed to fetch leaderboard by category', 500);
    }
  }

  async getLeaderboardsBySeason(req: Request, res: Response): Promise<void> {
    try {
      const { season } = req.params;
      const { week, category } = req.query;

      const where: any = { season: Number(season) };
      
      if (week) where.week = Number(week);
      if (category) where.category = category;

      const leaderboards = await prisma.leaderboard.findMany({
        where,
        include: {
          player: {
            include: {
              team: true
            }
          },
          team: true
        },
        orderBy: [
          { category: 'asc' },
          { rank: 'asc' }
        ]
      });

      // Group by category
      const groupedLeaderboards = leaderboards.reduce((acc, leaderboard) => {
        const category = leaderboard.category;
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(leaderboard);
        return acc;
      }, {} as Record<string, Leaderboard[]>);

      const response: ApiResponse<Record<string, Leaderboard[]>> = {
        success: true,
        data: groupedLeaderboards
      };

      res.json(response);
    } catch (error) {
      logger.error('Error fetching leaderboards by season:', error);
      throw createError('Failed to fetch leaderboards by season', 500);
    }
  }

  async getLeaderboardsByWeek(req: Request, res: Response): Promise<void> {
    try {
      const { week } = req.params;
      const { season, category } = req.query;

      const currentSeason = season ? Number(season) : new Date().getFullYear();
      const where: any = { 
        season: currentSeason,
        week: Number(week)
      };
      
      if (category) where.category = category;

      const leaderboards = await prisma.leaderboard.findMany({
        where,
        include: {
          player: {
            include: {
              team: true
            }
          },
          team: true
        },
        orderBy: [
          { category: 'asc' },
          { rank: 'asc' }
        ]
      });

      // Group by category
      const groupedLeaderboards = leaderboards.reduce((acc, leaderboard) => {
        const category = leaderboard.category;
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(leaderboard);
        return acc;
      }, {} as Record<string, Leaderboard[]>);

      const response: ApiResponse<Record<string, Leaderboard[]>> = {
        success: true,
        data: groupedLeaderboards
      };

      res.json(response);
    } catch (error) {
      logger.error('Error fetching leaderboards by week:', error);
      throw createError('Failed to fetch leaderboards by week', 500);
    }
  }
}
