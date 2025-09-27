import { Request, Response } from 'express';
import { GameController } from '../../controllers/GameController';
import prisma from '../../database/client';

// Mock Prisma
jest.mock('../../database/client', () => ({
  game: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    count: jest.fn()
  }
}));

// Mock logger
jest.mock('../../utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn()
  }
}));

describe('GameController', () => {
  let gameController: GameController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    gameController = new GameController();
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    
    mockRequest = {};
    mockResponse = {
      json: mockJson,
      status: mockStatus
    };

    jest.clearAllMocks();
  });

  describe('getGames', () => {
    it('should return games with pagination', async () => {
      const mockGames = [
        {
          id: '1',
          season: 2024,
          week: 1,
          homeTeam: { id: 'team1', name: 'Team A' },
          awayTeam: { id: 'team2', name: 'Team B' }
        }
      ];

      (prisma.game.findMany as jest.Mock).mockResolvedValue(mockGames);
      (prisma.game.count as jest.Mock).mockResolvedValue(1);

      mockRequest.query = { page: '1', limit: '20' };

      await gameController.getGames(mockRequest as Request, mockResponse as Response);

      expect(prisma.game.findMany).toHaveBeenCalled();
      expect(prisma.game.count).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: {
          games: mockGames,
          pagination: expect.objectContaining({
            page: 1,
            limit: 20,
            total: 1,
            totalPages: 1,
            hasNext: false,
            hasPrev: false
          })
        }
      });
    });

    it('should handle filters correctly', async () => {
      (prisma.game.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.game.count as jest.Mock).mockResolvedValue(0);

      mockRequest.query = { 
        season: '2024', 
        week: '1', 
        status: 'completed',
        teamId: 'team1'
      };

      await gameController.getGames(mockRequest as Request, mockResponse as Response);

      expect(prisma.game.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            season: 2024,
            week: 1,
            status: 'completed',
            OR: [
              { homeTeamId: 'team1' },
              { awayTeamId: 'team1' }
            ]
          })
        })
      );
    });
  });

  describe('getCurrentGames', () => {
    it('should return current week games', async () => {
      const mockGames = [
        {
          id: '1',
          season: 2024,
          week: 1,
          homeTeam: { id: 'team1', name: 'Team A' },
          awayTeam: { id: 'team2', name: 'Team B' }
        }
      ];

      (prisma.game.findMany as jest.Mock).mockResolvedValue(mockGames);

      await gameController.getCurrentGames(mockRequest as Request, mockResponse as Response);

      expect(prisma.game.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            season: expect.any(Number),
            week: expect.any(Number)
          })
        })
      );
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: mockGames
      });
    });
  });

  describe('getGameById', () => {
    it('should return game by ID', async () => {
      const mockGame = {
        id: '1',
        season: 2024,
        week: 1,
        homeTeam: { id: 'team1', name: 'Team A' },
        awayTeam: { id: 'team2', name: 'Team B' },
        gameStats: [],
        playerStats: []
      };

      (prisma.game.findUnique as jest.Mock).mockResolvedValue(mockGame);
      mockRequest.params = { id: '1' };

      await gameController.getGameById(mockRequest as Request, mockResponse as Response);

      expect(prisma.game.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: expect.any(Object)
      });
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: mockGame
      });
    });

    it('should return 404 when game not found', async () => {
      (prisma.game.findUnique as jest.Mock).mockResolvedValue(null);
      mockRequest.params = { id: 'nonexistent' };

      await expect(
        gameController.getGameById(mockRequest as Request, mockResponse as Response)
      ).rejects.toThrow('Game not found');
    });
  });
});
