// NFL Aggregator - ESPN Style Frontend JavaScript

class NFLAggregator {
    constructor() {
        this.apiBaseUrl = 'http://localhost:5000';
        this.currentSection = 'home';
        this.cache = new Map();
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupEventListeners();
        this.loadHealthCheck();
        console.log('🏈 NFL Aggregator initialized');
    }

    setupNavigation() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionId = e.target.getAttribute('data-section');
                this.showSection(sectionId);
            });
        });
    }

    setupEventListeners() {
        // Add any global event listeners here
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.showSection('home');
            }
        });
    }

    showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Show selected section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionId;
        }
        
        // Add active class to clicked nav link
        const activeLink = document.querySelector(`[data-section="${sectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
        
        // Load data for the section
        this.loadSectionData(sectionId);
    }

    async loadSectionData(sectionId) {
        const dataElement = document.getElementById(sectionId + 'Data');
        if (!dataElement) return;

        // Check cache first
        if (this.cache.has(sectionId)) {
            this.displayData(sectionId, this.cache.get(sectionId));
            return;
        }

        // Show loading state
        this.showLoading(dataElement);

        try {
            const endpoint = this.getEndpointForSection(sectionId);
            if (!endpoint) return;

            const response = await fetch(`${this.apiBaseUrl}${endpoint}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Cache the data
            this.cache.set(sectionId, data);
            
            // Display the data
            this.displayData(sectionId, data);
            
        } catch (error) {
            console.error(`Error loading ${sectionId} data:`, error);
            this.showError(dataElement, error.message);
        }
    }

    getEndpointForSection(sectionId) {
        const endpoints = {
            'teams': '/api/teams',
            'games': '/api/games',
            'players': '/api/players',
            'stats': '/api/stats',
            'leaderboards': '/api/leaderboards',
            'news': '/api/news'
        };
        return endpoints[sectionId];
    }

    displayData(sectionId, data) {
        const dataElement = document.getElementById(sectionId + 'Data');
        if (!dataElement) return;

        const formattedData = this.formatDataForSection(sectionId, data);
        dataElement.innerHTML = formattedData;
    }

    formatDataForSection(sectionId, data) {
        if (!data.success || !data.data) {
            return `<div class="error">No data available</div>`;
        }

        switch(sectionId) {
            case 'teams':
                return this.formatTeamsData(data.data.teams);
            case 'games':
                return this.formatGamesData(data.data.games);
            case 'players':
                return this.formatPlayersData(data.data.players);
            case 'stats':
                return this.formatStatsData(data.data);
            case 'leaderboards':
                return this.formatLeaderboardsData(data.data);
            case 'news':
                return this.formatNewsData(data.data.news);
            default:
                return `<pre>${JSON.stringify(data, null, 2)}</pre>`;
        }
    }

    formatTeamsData(teams) {
        if (!teams || !Array.isArray(teams)) {
            return '<div class="error">No teams data available</div>';
        }

        const conferences = {
            'AFC': { name: 'American Football Conference', color: '#1e3c72' },
            'NFC': { name: 'National Football Conference', color: '#2a5298' }
        };

        let html = '<div class="teams-container">';
        
        // Group teams by conference
        const groupedTeams = teams.reduce((acc, team) => {
            if (!acc[team.conference]) {
                acc[team.conference] = [];
            }
            acc[team.conference].push(team);
            return acc;
        }, {});

        // Display each conference
        Object.keys(groupedTeams).forEach(conference => {
            const conf = conferences[conference] || { name: conference, color: '#666' };
            html += `
                <div class="conference-section" style="margin-bottom: 30px;">
                    <h3 style="color: ${conf.color}; margin-bottom: 15px; padding: 10px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid ${conf.color};">
                        <i class="fas fa-trophy"></i> ${conf.name}
                    </h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
            `;
            
            groupedTeams[conference].forEach(team => {
                html += `
                    <div class="team-card">
                        <h4 style="color: #1e3c72; margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between;">
                            ${team.name}
                            <span class="team-abbr">${team.abbreviation}</span>
                        </h4>
                        <p><strong>Division:</strong> ${team.division}</p>
                        <p><strong>Conference:</strong> ${team.conference}</p>
                    </div>
                `;
            });
            
            html += '</div></div>';
        });

        html += '</div>';
        return html;
    }

    formatGamesData(games) {
        if (!games || !Array.isArray(games)) {
            return '<div class="error">No games data available</div>';
        }

        let html = '<div class="games-container">';
        
        games.forEach(game => {
            const homeTeam = game.homeTeam || {};
            const awayTeam = game.awayTeam || {};
            const homeScore = game.homeScore || 0;
            const awayScore = game.awayScore || 0;
            const status = game.status || 'TBD';
            
            // Determine winner
            let winnerClass = '';
            if (status === 'completed') {
                if (homeScore > awayScore) {
                    winnerClass = 'home-winner';
                } else if (awayScore > homeScore) {
                    winnerClass = 'away-winner';
                }
            }

            html += `
                <div class="game-card">
                    <div class="game-header">
                        <h4 class="game-title">${awayTeam.name || 'Away Team'} @ ${homeTeam.name || 'Home Team'}</h4>
                        <span class="game-status">${status.toUpperCase()}</span>
                    </div>
                    <div class="game-scores">
                        <div class="score ${winnerClass === 'away-winner' ? 'winner' : ''}">
                            <strong>${awayTeam.abbreviation || 'AWAY'}:</strong> ${awayScore}
                        </div>
                        <div class="vs">VS</div>
                        <div class="score ${winnerClass === 'home-winner' ? 'winner' : ''}">
                            <strong>${homeTeam.abbreviation || 'HOME'}:</strong> ${homeScore}
                        </div>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        return html;
    }

    formatPlayersData(players) {
        if (!players || !Array.isArray(players)) {
            return '<div class="error">No players data available</div>';
        }

        let html = '<div class="players-container" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">';
        
        players.forEach(player => {
            html += `
                <div class="player-card">
                    <h4 style="color: #1e3c72; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between;">
                        ${player.name}
                        <span class="player-position">${player.position}</span>
                    </h4>
                    <p><strong>Team:</strong> ${player.team}</p>
                </div>
            `;
        });

        html += '</div>';
        return html;
    }

    formatStatsData(data) {
        if (!data) {
            return '<div class="error">No statistics available</div>';
        }

        // If it's an array of stats
        if (Array.isArray(data)) {
            let html = '<div class="stats-container" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">';
            
            data.forEach(stat => {
                html += `
                    <div class="stat-item" style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #ffd700;">
                        <h4 style="color: #1e3c72; margin-bottom: 8px;">${stat.category || 'Stat'}</h4>
                        <p><strong>Player:</strong> ${stat.player || 'N/A'}</p>
                        <p><strong>Value:</strong> ${stat.value || 'N/A'}</p>
                    </div>
                `;
            });
            
            html += '</div>';
            return html;
        }

        // Fallback to JSON display
        return `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    }

    formatLeaderboardsData(data) {
        if (!data) {
            return '<div class="error">No leaderboards available</div>';
        }

        // If it's an array of leaderboards
        if (Array.isArray(data)) {
            let html = '<div class="leaderboards-container">';
            
            data.forEach(leaderboard => {
                html += `
                    <div class="leaderboard-item" style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #ffd700; margin-bottom: 15px;">
                        <h4 style="color: #1e3c72; margin-bottom: 10px;">${leaderboard.category || 'Category'}</h4>
                        <p><strong>Leader:</strong> ${leaderboard.leader || 'N/A'}</p>
                        <p><strong>Value:</strong> ${leaderboard.value || 'N/A'}</p>
                    </div>
                `;
            });
            
            html += '</div>';
            return html;
        }

        // Fallback to JSON display
        return `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    }

    formatNewsData(news) {
        if (!news || !Array.isArray(news)) {
            return '<div class="error">No news available</div>';
        }

        let html = '<div class="news-container">';
        
        news.forEach(article => {
            html += `
                <div class="news-item" style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #ffd700; margin-bottom: 15px;">
                    <h4 style="color: #1e3c72; margin-bottom: 10px;">${article.title || 'News Title'}</h4>
                    <p style="color: #666; margin-bottom: 8px;">${article.content || 'No content available'}</p>
                    <p style="font-size: 0.9rem; color: #999;"><strong>Source:</strong> ${article.source || 'N/A'}</p>
                </div>
            `;
        });

        html += '</div>';
        return html;
    }

    showLoading(element) {
        element.innerHTML = '<div class="loading">Loading data...</div>';
    }

    showError(element, message) {
        element.innerHTML = `<div class="error">Error loading data: ${message}</div>`;
    }

    async loadHealthCheck() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/health`);
            const data = await response.json();
            console.log('✅ API Health Check:', data);
        } catch (error) {
            console.error('❌ API Health Check Failed:', error);
        }
    }

    handleResize() {
        // Handle responsive adjustments if needed
        console.log('Window resized');
    }

    // Utility methods
    clearCache() {
        this.cache.clear();
        console.log('Cache cleared');
    }

    refreshCurrentSection() {
        this.clearCache();
        this.loadSectionData(this.currentSection);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.nflApp = new NFLAggregator();
});

// Global functions for backward compatibility
function showSection(sectionId) {
    if (window.nflApp) {
        window.nflApp.showSection(sectionId);
    }
}

// Add some CSS for the new elements
const additionalStyles = `
<style>
.winner {
    color: #4caf50 !important;
    font-weight: bold;
}

.vs {
    font-weight: bold;
    color: #666;
    margin: 0 10px;
}

.conference-section {
    margin-bottom: 30px;
}

.teams-container, .games-container, .players-container, .stats-container, .leaderboards-container, .news-container {
    margin-top: 20px;
}

.stat-item, .leaderboard-item, .news-item {
    transition: all 0.3s ease;
}

.stat-item:hover, .leaderboard-item:hover, .news-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

@media (max-width: 768px) {
    .game-scores {
        flex-direction: column;
        gap: 10px;
        align-items: flex-start;
    }
    
    .vs {
        margin: 10px 0;
    }
}
</style>
`;

// Inject additional styles
document.head.insertAdjacentHTML('beforeend', additionalStyles);
