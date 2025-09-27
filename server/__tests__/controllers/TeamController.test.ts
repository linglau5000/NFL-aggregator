import { Request, Response } from 'express';
import { TeamController } from '../../controllers/TeamController';
import prisma from '../../database/client';

// Mock Prisma
jest.mock('../../database/client', () => ({
  team: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    count: jest.fn()
  },
  player: {
    findMany: jest.fn(),
    count: jest.fn()
  },
  game: {
    findMany: jest.fn(),
    count: jest.fn()
  },
  teamStats: {
    findMany: jest.fn()
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

describe('TeamController', () => {
  let teamController: TeamController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    teamController = new TeamController();
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    
    mockRequest = {};
    mockResponse = {
      json: mockJson,
      status: mockStatus
    };

    jest.clearAllMocks();
  });

  describe('getTeams', () => {
    it('should return teams with pagination', async () => {
      const mockTeams = [
        {
          id: '1',
          name: 'Team A',
          abbreviation: 'TA',
          city: 'City A',
          conference: 'AFC',
          division: 'East'
        }
      ];

      (prisma.team.findMany as jest.Mock).mockResolvedValue(mockTeams);
      (prisma.team.count as jest.Mock).mockResolvedValue(1);

      mockRequest.query = { page: '1', limit: '32' };

      await teamController.getTeams(mockRequest as Request, mockResponse as Response);

      expect(prisma.team.findMany).toHaveBeenCalled();
      expect(prisma.team.count).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: {
          teams: mockTeams,
          pagination: expect.objectContaining({
            page: 1,
            limit: 32,
            total: 1,
            totalPages: 1,
            hasNext: false,
            hasPrev: false
          })
        }
      });
    });

    it('should handle conference and division filters', async () => {
      (prisma.team.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.team.count as jest.Mock).mockResolvedValue(0);

      mockRequest.query = { 
        conference: 'AFC',
        division: 'East'
      };

      await teamController.getTeams(mockRequest as Request, mockResponse as Response);

      expect(prisma.team.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            conference: 'AFC',
            division: 'East'
          })
        })
      );
    });
  });

  describe('getTeamById', () => {
    it('should return team by ID', async () => {
      const mockTeam = {
        id: '1',
        name: 'Team A',
        abbreviation: 'TA',
        city: 'City A',
        conference: 'AFC',
        division: 'East',
        players: [],
        teamStats: []
      };

      (prisma.team.findUnique as jest.Mock).mockResolvedValue(mockTeam);
      mockRequest.params = { id: '1' };

      await teamController.getTeamById(mockRequest as Request, mockResponse as Response);

      expect(prisma.team.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: expect.any(Object)
      });
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: mockTeam
      });
    });

    it('should return 404 when team not found', async () => {
      (prisma.team.findUnique as jest.Mock).mockResolvedValue(null);
      mockRequest.params = { id: 'nonexistent' };

      await expect(
        teamController.getTeamById(mockRequest as Request, mockResponse as Response)
      ).rejects.toThrow('Team not found');
    });
  });

  describe('getTeamPlayers', () => {
    it('should return team players', async () => {
      const mockPlayers = [
        {
          id: '1',
          name: 'Player A',
          position: 'QB',
          number: 1,
          teamId: 'team1',
          team: { id: 'team1', name: 'Team A' }
        }
      ];

      (prisma.player.findMany as jest.Mock).mockResolvedValue(mockPlayers);
      mockRequest.params = { id: 'team1' };

      await teamController.getTeamPlayers(mockRequest as Request, mockResponse as Response);

      expect(prisma.player.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { teamId: 'team1' }
        })
      );
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: mockPlayers
      });
    });

    it('should filter players by position', async () => {
      (prisma.player.findMany as jest.Mock).mockResolvedValue([]);
      mockRequest.params = { id: 'team1' };
      mockRequest.query = { position: 'QB' };

      await teamController.getTeamPlayers(mockRequest as Request, mockResponse as Response);

      expect(prisma.player.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            teamId: 'team1',
            position: 'QB'
          }
        })
      );
    });
  });
});
