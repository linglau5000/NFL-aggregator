import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { validateRequest, validatePagination, validateGameId } from '../../middleware/validateRequest';

// Mock express-validator
jest.mock('express-validator', () => ({
  validationResult: jest.fn()
}));

describe('Validate Request Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn();

    jest.clearAllMocks();
  });

  describe('validateRequest', () => {
    it('should call next when no validation errors', () => {
      (validationResult as jest.Mock).mockReturnValue({
        isEmpty: () => true,
        array: () => []
      });

      validateRequest(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should throw error when validation fails', () => {
      const mockErrors = [
        { field: 'email', message: 'Invalid email', value: 'invalid' }
      ];

      (validationResult as jest.Mock).mockReturnValue({
        isEmpty: () => false,
        array: () => mockErrors
      });

      expect(() => {
        validateRequest(mockRequest as Request, mockResponse as Response, mockNext);
      }).toThrow('Validation failed');
    });
  });

  describe('validatePagination', () => {
    it('should validate pagination parameters', () => {
      const middleware = validatePagination;
      expect(Array.isArray(middleware)).toBe(true);
      expect(middleware.length).toBeGreaterThan(0);
    });
  });

  describe('validateGameId', () => {
    it('should validate game ID parameter', () => {
      const middleware = validateGameId;
      expect(Array.isArray(middleware)).toBe(true);
      expect(middleware.length).toBeGreaterThan(0);
    });
  });
});
