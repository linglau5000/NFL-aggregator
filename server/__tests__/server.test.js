const request = require('supertest');
const app = require('../index');

describe('Server', () => {
  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('GET /api/scores', () => {
    it('should return scores with valid parameters', async () => {
      const response = await request(app)
        .get('/api/scores?season=2023&week=13')
        .expect(200);

      expect(response.body).toHaveProperty('season');
      expect(response.body).toHaveProperty('week');
      expect(response.body).toHaveProperty('games');
      expect(response.body).toHaveProperty('lastUpdated');
    });

    it('should return scores with default parameters', async () => {
      const response = await request(app)
        .get('/api/scores')
        .expect(200);

      expect(response.body).toHaveProperty('season');
      expect(response.body).toHaveProperty('week');
      expect(response.body).toHaveProperty('games');
    });

    it('should return 400 for invalid season', async () => {
      const response = await request(app)
        .get('/api/scores?season=1999')
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });

    it('should return 400 for invalid week', async () => {
      const response = await request(app)
        .get('/api/scores?week=25')
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('GET /api/standings', () => {
    it('should return standings with valid season', async () => {
      const response = await request(app)
        .get('/api/standings?season=2023')
        .expect(200);

      expect(response.body).toHaveProperty('season');
      expect(response.body).toHaveProperty('standings');
      expect(response.body).toHaveProperty('lastUpdated');
    });

    it('should return standings with default season', async () => {
      const response = await request(app)
        .get('/api/standings')
        .expect(200);

      expect(response.body).toHaveProperty('season');
      expect(response.body).toHaveProperty('standings');
    });

    it('should return 400 for invalid season', async () => {
      const response = await request(app)
        .get('/api/standings?season=1999')
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('GET /api/stats', () => {
    it('should return stats with valid parameters', async () => {
      const response = await request(app)
        .get('/api/stats?type=passing&season=2023')
        .expect(200);

      expect(response.body).toHaveProperty('type');
      expect(response.body).toHaveProperty('season');
      expect(response.body).toHaveProperty('leaders');
      expect(response.body).toHaveProperty('lastUpdated');
    });

    it('should return stats with default parameters', async () => {
      const response = await request(app)
        .get('/api/stats')
        .expect(200);

      expect(response.body).toHaveProperty('type');
      expect(response.body).toHaveProperty('season');
      expect(response.body).toHaveProperty('leaders');
    });

    it('should return 400 for invalid type', async () => {
      const response = await request(app)
        .get('/api/stats?type=invalid')
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });

    it('should return 400 for invalid season', async () => {
      const response = await request(app)
        .get('/api/stats?season=1999')
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('GET /api/news', () => {
    it('should return news', async () => {
      const response = await request(app)
        .get('/api/news')
        .expect(200);

      expect(response.body).toHaveProperty('articles');
      expect(response.body).toHaveProperty('lastUpdated');
    });
  });

  describe('404 handler', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/api/unknown')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Route not found');
    });
  });

  describe('Rate limiting', () => {
    it('should apply rate limiting', async () => {
      // Make multiple requests quickly
      const promises = Array(101).fill().map(() => 
        request(app).get('/api/health')
      );

      const responses = await Promise.allSettled(promises);
      const rateLimitedResponses = responses.filter(
        response => response.status === 'fulfilled' && response.value.status === 429
      );

      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });
  });
});

