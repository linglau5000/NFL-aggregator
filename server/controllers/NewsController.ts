import { Request, Response } from 'express';
import prisma from '../database/client';
import { logger } from '../utils/logger';
import { createError } from '../middleware/errorHandler';
import { ApiResponse, News } from '../types';

export class NewsController {
  async getNews(req: Request, res: Response): Promise<void> {
    try {
      const {
        page = 1,
        limit = 20,
        sortBy = 'publishedAt',
        sortOrder = 'desc',
        category,
        tags
      } = req.query;

      const skip = (Number(page) - 1) * Number(limit);
      const take = Number(limit);

      // Build where clause
      const where: any = {};
      
      if (category) where.category = category;
      if (tags) {
        const tagArray = (tags as string).split(',');
        where.tags = {
          hasSome: tagArray
        };
      }

      // Build orderBy clause
      const orderBy: any = {};
      orderBy[sortBy as string] = sortOrder;

      const [news, total] = await Promise.all([
        prisma.news.findMany({
          where,
          orderBy,
          skip,
          take
        }),
        prisma.news.count({ where })
      ]);

      const totalPages = Math.ceil(total / take);

      const response: ApiResponse<{
        news: News[];
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
          news,
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
      logger.error('Error fetching news:', error);
      throw createError('Failed to fetch news', 500);
    }
  }

  async getNewsByCategory(req: Request, res: Response): Promise<void> {
    try {
      const { category } = req.params;
      const { page = 1, limit = 20 } = req.query;

      const skip = (Number(page) - 1) * Number(limit);
      const take = Number(limit);

      const [news, total] = await Promise.all([
        prisma.news.findMany({
          where: { category },
          orderBy: {
            publishedAt: 'desc'
          },
          skip,
          take
        }),
        prisma.news.count({ where: { category } })
      ]);

      const totalPages = Math.ceil(total / take);

      const response: ApiResponse<{
        news: News[];
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
          news,
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
      logger.error('Error fetching news by category:', error);
      throw createError('Failed to fetch news by category', 500);
    }
  }

  async getLatestNews(req: Request, res: Response): Promise<void> {
    try {
      const { limit = 10, category } = req.query;

      const where: any = {};
      if (category) where.category = category;

      const news = await prisma.news.findMany({
        where,
        orderBy: {
          publishedAt: 'desc'
        },
        take: Number(limit)
      });

      const response: ApiResponse<News[]> = {
        success: true,
        data: news
      };

      res.json(response);
    } catch (error) {
      logger.error('Error fetching latest news:', error);
      throw createError('Failed to fetch latest news', 500);
    }
  }
}
