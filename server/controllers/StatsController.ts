import { Request, Response } from 'express';
import prisma from '../database/client';
import { logger } from '../utils/logger';
import { createError } from '../middleware/errorHandler';
import { ApiResponse } from '../types';

export class StatsController {
  async getSeasonStats(req: Request, res: Response): Promise<void> {
    try {
      const { season } = req.params;
      const { week } = req.query;

      const where: any = { season: Number(season) };
      if (week) where.week = Number(week);

      const teamStats = await prisma.teamStats.findMany({
        where,
        include: {
          team: true
        },
        orderBy: [
          { wins: 'desc' },
          { pointsFor: 'desc' }
        ]
      });

      const playerStats = await prisma.playerStats.findMany({
        where: {
          game: {
            season: Number(season),
            ...(week && { week: Number(week) })
          }
        },
        include: {
          player: true,
          team: true
        }
      });

      // Calculate league leaders
      const leaders = {
        passing: this.calculateLeaders(playerStats, 'passYards'),
        rushing: this.calculateLeaders(playerStats, 'rushYards'),
        receiving: this.calculateLeaders(playerStats, 'receivingYards'),
        tackles: this.calculateLeaders(playerStats, 'tackles'),
        sacks: this.calculateLeaders(playerStats, 'sacks')
      };

      const response: ApiResponse<{
        teamStats: any[];
        playerStats: any[];
        leaders: any;
      }> = {
        success: true,
        data: {
          teamStats,
          playerStats,
          leaders
        }
      };

      res.json(response);
    } catch (error) {
      logger.error('Error fetching season stats:', error);
      throw createError('Failed to fetch season stats', 500);
    }
  }

  async getTeamStats(req: Request, res: Response): Promise<void> {
    try {
      const { teamId } = req.params;
      const { season, week } = req.query;

      const where: any = { teamId };
      if (season) where.season = Number(season);
      if (week) where.week = Number(week);

      const teamStats = await prisma.teamStats.findMany({
        where,
        include: {
          team: true
        },
        orderBy: {
          season: 'desc'
        }
      });

      const gameStats = await prisma.gameStats.findMany({
        where: {
          teamId,
          game: {
            ...(season && { season: Number(season) }),
            ...(week && { week: Number(week) })
          }
        },
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
        }
      });

      const response: ApiResponse<{
        teamStats: any[];
        gameStats: any[];
      }> = {
        success: true,
        data: {
          teamStats,
          gameStats
        }
      };

      res.json(response);
    } catch (error) {
      logger.error('Error fetching team stats:', error);
      throw createError('Failed to fetch team stats', 500);
    }
  }

  async getPlayerStats(req: Request, res: Response): Promise<void> {
    try {
      const { playerId } = req.params;
      const { season, week } = req.query;

      const where: any = { playerId };
      if (season) {
        where.game = {
          season: Number(season)
        };
      }
      if (week) {
        where.game = {
          ...where.game,
          week: Number(week)
        };
      }

      const playerStats = await prisma.playerStats.findMany({
        where,
        include: {
          player: true,
          team: true,
          game: {
            include: {
              homeTeam: true,
              awayTeam: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      // Calculate season totals
      const seasonTotals = playerStats.reduce((totals, stat) => {
        return {
          passAttempts: totals.passAttempts + stat.passAttempts,
          passCompletions: totals.passCompletions + stat.passCompletions,
          passYards: totals.passYards + stat.passYards,
          passTDs: totals.passTDs + stat.passTDs,
          interceptions: totals.interceptions + stat.interceptions,
          rushAttempts: totals.rushAttempts + stat.rushAttempts,
          rushYards: totals.rushYards + stat.rushYards,
          rushTDs: totals.rushTDs + stat.rushTDs,
          receptions: totals.receptions + stat.receptions,
          receivingYards: totals.receivingYards + stat.receivingYards,
          receivingTDs: totals.receivingTDs + stat.receivingTDs,
          tackles: totals.tackles + stat.tackles,
          sacks: totals.sacks + stat.sacks,
          fumbles: totals.fumbles + stat.fumbles
        };
      }, {
        passAttempts: 0,
        passCompletions: 0,
        passYards: 0,
        passTDs: 0,
        interceptions: 0,
        rushAttempts: 0,
        rushYards: 0,
        rushTDs: 0,
        receptions: 0,
        receivingYards: 0,
        receivingTDs: 0,
        tackles: 0,
        sacks: 0,
        fumbles: 0
      });

      const response: ApiResponse<{
        stats: any[];
        seasonTotals: any;
      }> = {
        success: true,
        data: {
          stats: playerStats,
          seasonTotals
        }
      };

      res.json(response);
    } catch (error) {
      logger.error('Error fetching player stats:', error);
      throw createError('Failed to fetch player stats', 500);
    }
  }

  async getStatisticalLeaders(req: Request, res: Response): Promise<void> {
    try {
      const { category, season, week, limit = 10 } = req.query;

      const where: any = {};
      if (season) {
        where.game = {
          season: Number(season),
          ...(week && { week: Number(week) })
        };
      }

      const playerStats = await prisma.playerStats.findMany({
        where,
        include: {
          player: true,
          team: true
        }
      });

      const leaders = this.calculateLeaders(playerStats, category as string, Number(limit));

      const response: ApiResponse<any[]> = {
        success: true,
        data: leaders
      };

      res.json(response);
    } catch (error) {
      logger.error('Error fetching statistical leaders:', error);
      throw createError('Failed to fetch statistical leaders', 500);
    }
  }

  private calculateLeaders(stats: any[], category: string, limit: number = 10): any[] {
    const statMap = new Map();

    stats.forEach(stat => {
      const key = `${stat.playerId}-${stat.player.name}`;
      const currentValue = statMap.get(key) || 0;
      statMap.set(key, currentValue + (stat[category] || 0));
    });

    return Array.from(statMap.entries())
      .map(([key, value]) => {
        const [playerId, playerName] = key.split('-');
        const stat = stats.find(s => s.playerId === playerId);
        return {
          playerId,
          playerName,
          team: stat?.team,
          value,
          [category]: value
        };
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, limit);
  }
}
