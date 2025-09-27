const axios = require('axios');
const nflService = require('../services/nflService');

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

describe('NFLService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getScores', () => {
    it('should fetch scores successfully', async () => {
      const mockResponse = {
        data: {
          events: [
            {
              id: '1',
              date: '2023-12-01T20:00:00Z',
              week: { number: 13 },
              status: { type: { name: 'STATUS_FINAL', completed: true } },
              competitions: [{
                competitors: [
                  {
                    homeAway: 'home',
                    id: '1',
                    team: { displayName: 'Chiefs', abbreviation: 'KC' },
                    score: '24',
                    records: [{ summary: '8-4' }]
                  },
                  {
                    homeAway: 'away',
                    id: '2',
                    team: { displayName: 'Bills', abbreviation: 'BUF' },
                    score: '21',
                    records: [{ summary: '7-5' }]
                  }
                ],
                venue: { fullName: 'Arrowhead Stadium' },
                weather: { temperature: 45 }
              }]
            }
          ]
        }
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await nflService.getScores('2023', '13');

      expect(result).toHaveProperty('season', '2023');
      expect(result).toHaveProperty('week', '13');
      expect(result).toHaveProperty('games');
      expect(result.games).toHaveLength(1);
      expect(result.games[0]).toHaveProperty('homeTeam');
      expect(result.games[0]).toHaveProperty('awayTeam');
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard',
        { params: { dates: 2023, week: 13 } }
      );
    });

    it('should handle API errors', async () => {
      mockedAxios.get.mockRejectedValue(new Error('API Error'));

      await expect(nflService.getScores()).rejects.toThrow('API Error');
    });

    it('should use current year and week when not provided', async () => {
      const mockResponse = { data: { events: [] } };
      mockedAxios.get.mockResolvedValue(mockResponse);

      await nflService.getScores();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('scoreboard'),
        expect.objectContaining({
          params: expect.objectContaining({
            dates: expect.any(Number),
            week: expect.any(Number)
          })
        })
      );
    });
  });

  describe('getStandings', () => {
    it('should fetch standings successfully', async () => {
      const mockResponse = {
        data: {
          children: [
            {
              displayName: 'AFC',
              children: [
                {
                  displayName: 'AFC East',
                  standings: {
                    entries: [
                      {
                        team: {
                          id: '1',
                          displayName: 'Bills',
                          abbreviation: 'BUF'
                        },
                        stats: [
                          { name: 'wins', value: 8 },
                          { name: 'losses', value: 4 },
                          { name: 'ties', value: 0 },
                          { name: 'winPercent', value: 0.667 },
                          { name: 'pointsFor', value: 320 },
                          { name: 'pointsAgainst', value: 280 },
                          { name: 'pointDifferential', value: 40 }
                        ]
                      }
                    ]
                  }
                }
              ]
            }
          ]
        }
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await nflService.getStandings('2023');

      expect(result).toHaveProperty('season', '2023');
      expect(result).toHaveProperty('standings');
      expect(result.standings).toHaveLength(1);
      expect(result.standings[0]).toHaveProperty('conference', 'AFC');
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://site.api.espn.com/apis/site/v2/sports/football/nfl/standings',
        { params: { season: 2023 } }
      );
    });

    it('should handle API errors', async () => {
      mockedAxios.get.mockRejectedValue(new Error('API Error'));

      await expect(nflService.getStandings()).rejects.toThrow('API Error');
    });
  });

  describe('getStats', () => {
    it('should fetch stats successfully', async () => {
      const mockResponse = {
        data: {
          leaders: [
            {
              rank: 1,
              athlete: {
                id: '1',
                displayName: 'Josh Allen',
                position: { abbreviation: 'QB' },
                team: { displayName: 'Bills', abbreviation: 'BUF' }
              },
              stats: [{ name: 'passingYards', value: 3500 }],
              value: 3500
            }
          ]
        }
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await nflService.getStats('passing', '2023');

      expect(result).toHaveProperty('type', 'passing');
      expect(result).toHaveProperty('season', '2023');
      expect(result).toHaveProperty('leaders');
      expect(result.leaders).toHaveLength(1);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://site.api.espn.com/apis/site/v2/sports/football/nfl/leaders',
        { params: { season: 2023, category: 'passing' } }
      );
    });

    it('should handle API errors', async () => {
      mockedAxios.get.mockRejectedValue(new Error('API Error'));

      await expect(nflService.getStats()).rejects.toThrow('API Error');
    });

    it('should use default type when not provided', async () => {
      const mockResponse = { data: { leaders: [] } };
      mockedAxios.get.mockResolvedValue(mockResponse);

      await nflService.getStats();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('leaders'),
        expect.objectContaining({
          params: expect.objectContaining({
            category: 'passing'
          })
        })
      );
    });
  });

  describe('getNews', () => {
    it('should fetch news successfully', async () => {
      const mockResponse = {
        data: {
          articles: [
            {
              dataSourceIdentifier: '1',
              headline: 'Test News',
              description: 'Test Description',
              published: '2023-12-01T10:00:00Z',
              author: 'Test Author',
              images: [{ url: 'https://example.com/image.jpg' }],
              links: { web: { href: 'https://example.com/article' } },
              categories: [{ description: 'News' }]
            }
          ]
        }
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await nflService.getNews();

      expect(result).toHaveProperty('articles');
      expect(result.articles).toHaveLength(1);
      expect(result.articles[0]).toHaveProperty('headline', 'Test News');
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://site.api.espn.com/apis/site/v2/sports/football/nfl/news',
        { params: { limit: 20 } }
      );
    });

    it('should handle API errors', async () => {
      mockedAxios.get.mockRejectedValue(new Error('API Error'));

      await expect(nflService.getNews()).rejects.toThrow('API Error');
    });
  });

  describe('getCurrentWeek', () => {
    it('should return a valid week number', () => {
      const week = nflService.getCurrentWeek();
      expect(week).toBeGreaterThanOrEqual(1);
      expect(week).toBeLessThanOrEqual(18);
    });
  });

  describe('updateAllData', () => {
    it('should complete without errors', async () => {
      await expect(nflService.updateAllData()).resolves.toBeUndefined();
    });
  });
});

