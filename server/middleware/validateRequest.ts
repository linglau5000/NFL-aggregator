import { Request, Response, NextFunction } from 'express';
import { body, query, param, validationResult } from 'express-validator';
import { createError } from './errorHandler';

export const validateRequest = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.type === 'field' ? (error as any).path : 'unknown',
      message: error.msg,
      value: error.type === 'field' ? (error as any).value : undefined
    }));

    throw createError('Validation failed', 400);
  }
  
  next();
};

// Common validation rules
export const validatePagination = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('sortBy').optional().isString().withMessage('SortBy must be a string'),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('SortOrder must be asc or desc'),
  validateRequest
];

export const validateGameId = [
  param('id').isString().notEmpty().withMessage('Game ID is required'),
  validateRequest
];

export const validateTeamId = [
  param('id').isString().notEmpty().withMessage('Team ID is required'),
  validateRequest
];

export const validatePlayerId = [
  param('id').isString().notEmpty().withMessage('Player ID is required'),
  validateRequest
];

export const validateSeason = [
  query('season').optional().isInt({ min: 2020, max: 2030 }).withMessage('Season must be between 2020 and 2030'),
  query('week').optional().isInt({ min: 1, max: 22 }).withMessage('Week must be between 1 and 22'),
  validateRequest
];
