const axios = require('axios');
const cheerio = require('cheerio');

class NFLService {
  constructor() {
    this.baseURL = 'https://www.nfl.com';
    this.espnURL = 'https://site.api.espn.com/apis/site/v2/sports/football/nfl';
  }

  async getScores(season = 'current', week = 'current') {
    try {
      const response = await axios.get(`${this.espnURL}/scoreboard`, {
        params: {
          dates: season === 'current' ? new Date().getFullYear() : season,
          week: week === 'current' ? this.getCurrentWeek() : week
        }
      });

      const games = response.data.events.map(event => ({
        id: event.id,
        date: event.date,
        week: event.week?.number,
        status: event.status?.type?.name,
        completed: event.status?.type?.completed,
        homeTeam: {
          id: event.competitions[0].competitors.find(c => c.homeAway === 'home').id,
          name: event.competitions[0].competitors.find(c => c.homeAway === 'home').team.displayName,
          abbreviation: event.competitions[0].competitors.find(c => c.homeAway === 'home').team.abbreviation,
          score: event.competitions[0].competitors.find(c => c.homeAway === 'home').score,
          record: event.competitions[0].competitors.find(c => c.homeAway === 'home').records?.[0]?.summary
        },
        awayTeam: {
          id: event.competitions[0].competitors.find(c => c.homeAway === 'away').id,
          name: event.competitions[0].competitors.find(c => c.homeAway === 'away').team.displayName,
          abbreviation: event.competitions[0].competitors.find(c => c.homeAway === 'away').team.abbreviation,
          score: event.competitions[0].competitors.find(c => c.homeAway === 'away').score,
          record: event.competitions[0].competitors.find(c => c.homeAway === 'away').records?.[0]?.summary
        },
        venue: event.competitions[0].venue?.fullName,
        weather: event.competitions[0].weather
      }));

      return {
        season: season,
        week: week,
        games: games,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching scores:', error);
      throw error;
    }
  }

  async getStandings(season = 'current') {
    try {
      const response = await axios.get(`${this.espnURL}/standings`, {
        params: {
          season: season === 'current' ? new Date().getFullYear() : season
        }
      });

      const standings = response.data.children.map(conference => ({
        conference: conference.displayName,
        divisions: conference.children.map(division => ({
          division: division.displayName,
          teams: division.standings.entries.map(team => ({
            id: team.team.id,
            name: team.team.displayName,
            abbreviation: team.team.abbreviation,
            wins: team.stats.find(s => s.name === 'wins')?.value || 0,
            losses: team.stats.find(s => s.name === 'losses')?.value || 0,
            ties: team.stats.find(s => s.name === 'ties')?.value || 0,
            winPercentage: team.stats.find(s => s.name === 'winPercent')?.value || 0,
            pointsFor: team.stats.find(s => s.name === 'pointsFor')?.value || 0,
            pointsAgainst: team.stats.find(s => s.name === 'pointsAgainst')?.value || 0,
            pointDifferential: team.stats.find(s => s.name === 'pointDifferential')?.value || 0
          }))
        }))
      }));

      return {
        season: season,
        standings: standings,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching standings:', error);
      throw error;
    }
  }

  async getStats(type = 'passing', season = 'current') {
    try {
      const statTypes = {
        passing: 'passing',
        rushing: 'rushing',
        receiving: 'receiving',
        defense: 'defense',
        kicking: 'kicking'
      };

      const response = await axios.get(`${this.espnURL}/leaders`, {
        params: {
          season: season === 'current' ? new Date().getFullYear() : season,
          category: statTypes[type] || 'passing'
        }
      });

      const stats = response.data.leaders.map(leader => ({
        rank: leader.rank,
        player: {
          id: leader.athlete.id,
          name: leader.athlete.displayName,
          position: leader.athlete.position?.abbreviation,
          team: leader.athlete.team?.displayName,
          teamAbbreviation: leader.athlete.team?.abbreviation
        },
        stats: leader.stats,
        value: leader.value
      }));

      return {
        type: type,
        season: season,
        leaders: stats,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  }

  async getNews() {
    try {
      // Using ESPN's news API
      const response = await axios.get(`${this.espnURL}/news`, {
        params: {
          limit: 20
        }
      });

      const news = response.data.articles.map(article => ({
        id: article.dataSourceIdentifier,
        headline: article.headline,
        description: article.description,
        publishedAt: article.published,
        author: article.author,
        image: article.images?.[0]?.url,
        url: article.links?.web?.href,
        category: article.categories?.[0]?.description
      }));

      return {
        articles: news,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
  }

  async updateAllData() {
    try {
      // This method can be called to refresh all cached data
      console.log('Updating all NFL data...');
      // The actual data fetching will happen when endpoints are called
      // due to cache expiration
    } catch (error) {
      console.error('Error updating data:', error);
      throw error;
    }
  }

  getCurrentWeek() {
    const now = new Date();
    const seasonStart = new Date(now.getFullYear(), 8, 1); // September 1st
    const weeksSinceStart = Math.floor((now - seasonStart) / (7 * 24 * 60 * 60 * 1000));
    return Math.min(Math.max(weeksSinceStart, 1), 18); // NFL regular season is 18 weeks
  }
}

module.exports = new NFLService();

