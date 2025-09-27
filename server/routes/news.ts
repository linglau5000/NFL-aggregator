import { Router } from 'express';
import { NewsController } from '../controllers/NewsController';
import { validatePagination } from '../middleware/validateRequest';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();
const newsController = new NewsController();

// GET /api/news - Get all news
router.get('/', validatePagination, asyncHandler(newsController.getNews.bind(newsController)));

// GET /api/news/category/:category - Get news by category
router.get('/category/:category', validatePagination, asyncHandler(newsController.getNewsByCategory.bind(newsController)));

// GET /api/news/latest - Get latest news
router.get('/latest', asyncHandler(newsController.getLatestNews.bind(newsController)));

export default router;
