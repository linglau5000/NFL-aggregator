import { Request, Response, NextFunction } from 'express';
import { errorHandler, createError, asyncHandler } from '../../middleware/errorHandler';

describe('Error Handler Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    
    mockRequest = {
      url: '/test',
      method: 'GET',
      ip: '127.0.0.1',
      get: jest.fn().mockReturnValue('test-agent')
    };
    
    mockResponse = {
      json: mockJson,
      status: mockStatus
    };
    
    mockNext = jest.fn();

    jest.clearAllMocks();
  });

  describe('errorHandler', () => {
    it('should handle operational errors correctly', () => {
      const error = createError('Test error', 400);
      
      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Test error',
          statusCode: 400,
          timestamp: expect.any(String)
        }
      });
    });

    it('should handle non-operational errors', () => {
      const error = new Error('Generic error');
      
      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Generic error',
          statusCode: 500,
          timestamp: expect.any(String)
        }
      });
    });

    it('should hide error details in production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      
      const error = createError('Test error', 500);
      
      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Internal server error',
          statusCode: 500,
          timestamp: expect.any(String)
        }
      });

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('createError', () => {
    it('should create error with status code', () => {
      const error = createError('Test error', 404);
      
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(404);
      expect(error.isOperational).toBe(true);
    });

    it('should create error with default status code', () => {
      const error = createError('Test error');
      
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(500);
      expect(error.isOperational).toBe(true);
    });
  });

  describe('asyncHandler', () => {
    it('should handle successful async functions', async () => {
      const mockFn = jest.fn().mockResolvedValue('success');
      const handler = asyncHandler(mockFn);
      
      await handler(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockFn).toHaveBeenCalledWith(mockRequest, mockResponse, mockNext);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle async function errors', async () => {
      const error = new Error('Async error');
      const mockFn = jest.fn().mockRejectedValue(error);
      const handler = asyncHandler(mockFn);
      
      await handler(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockFn).toHaveBeenCalledWith(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
