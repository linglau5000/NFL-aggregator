// FootballDB.com Style JavaScript

class FootballDB {
    constructor() {
        // Use Vercel URL for production, localhost for development
        this.apiBaseUrl = window.location.hostname === 'localhost' 
            ? 'http://localhost:5000' 
            : 'https://nfl-aggregator.vercel.app';
        this.currentSection = 'home';
        this.cache = new Map();
        this.refreshInterval = null;
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupEventListeners();
        this.loadInitialData();
        this.startAutoRefresh();
        console.log('🏈 FootballDB initialized');
    }

    setupNavigation() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.currentTarget.getAttribute('data-section');
                this.showSection(section);
            });
        });
    }

    setupEventListeners() {
        // Standings controls
        document.querySelectorAll('.standings-controls .btn-tab').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.standings-controls .btn-tab').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.loadStandings(e.target.getAttribute('data-conference'));
            });
        });

        // Scores controls
        document.querySelectorAll('.scores-controls .btn-tab').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.scores-controls .btn-tab').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.loadScores(e.target.getAttribute('data-period'));
            });
        });

        // Draft controls
        document.getElementById('draftYear')?.addEventListener('change', () => this.loadDraft());
        document.getElementById('draftRound')?.addEventListener('change', () => this.loadDraft());

        // Teams controls
        document.getElementById('teamSearch')?.addEventListener('input', (e) => this.filterTeams(e.target.value));
        document.getElementById('conferenceFilter')?.addEventListener('change', (e) => this.filterTeamsByConference(e.target.value));

        // Players controls
        document.getElementById('playerSearch')?.addEventListener('input', (e) => this.filterPlayers(e.target.value));
        document.getElementById('positionFilter')?.addEventListener('change', (e) => this.filterPlayersByPosition(e.target.value));

        // Stats controls
        document.getElementById('statCategory')?.addEventListener('change', (e) => this.loadStats(e.target.value));
    }

    showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Remove active class from all nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Show selected section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionId;
        }
        
        // Add active class to clicked nav item
        const activeItem = document.querySelector(`[data-section="${sectionId}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
        
        // Load data for the section
        this.loadSectionData(sectionId);
    }

    loadSectionData(sectionId) {
        switch(sectionId) {
            case 'home':
                this.loadDashboard();
                break;
            case 'standings':
                this.loadStandings('all');
                break;
            case 'scores':
                this.loadScores('live');
                break;
            case 'draft':
                this.loadDraft();
                break;
            case 'teams':
                this.loadTeams();
                break;
            case 'players':
                this.loadPlayers();
                break;
            case 'stats':
                this.loadStats('passing');
                break;
        }
    }

    async loadInitialData() {
        this.updateLastUpdated();
        // Display top performers immediately (they don't need API data)
        this.displayTopPerformers();
        await this.loadDashboard();
    }

    async loadDashboard() {
        try {
            const [gamesData, newsData] = await Promise.all([
                this.fetchData('/api/games'),
                this.fetchData('/api/news')
            ]);

            this.displayRecentGames(gamesData.data?.games || []);
            this.displayUpcomingGames(gamesData.data?.games || []);
            this.displayLatestNews(newsData.data?.news || []);
        } catch (error) {
            console.error('Error loading dashboard:', error);
        }
    }

    displayRecentGames(games) {
        const container = document.getElementById('recentGames');
        const recentGames = games.filter(game => game.status === 'completed').slice(0, 3);
        
        if (recentGames.length === 0) {
            container.innerHTML = '<p class="text-center text-gray-500">No recent games</p>';
            return;
        }

        container.innerHTML = recentGames.map(game => `
            <div class="score-card">
                <div class="score-header">
                    <span class="game-status completed">Final</span>
                </div>
                <div class="score-teams">
                    <div class="team-score away">
                        <span class="team-name-score">${game.awayTeam.name}</span>
                        <span class="team-score-value">${game.awayScore}</span>
                    </div>
                    <span class="score-vs">@</span>
                    <div class="team-score home">
                        <span class="team-score-value">${game.homeScore}</span>
                        <span class="team-name-score">${game.homeTeam.name}</span>
                    </div>
                </div>
                <div class="game-details">
                    <span>${game.date || 'Recent'}</span>
                </div>
            </div>
        `).join('');
    }

    displayUpcomingGames(games) {
        const container = document.getElementById('upcomingGames');
        const upcomingGames = games.filter(game => game.status === 'scheduled').slice(0, 3);
        
        if (upcomingGames.length === 0) {
            container.innerHTML = '<p class="text-center text-gray-500">No upcoming games</p>';
            return;
        }

        container.innerHTML = upcomingGames.map(game => `
            <div class="score-card">
                <div class="score-header">
                    <span class="game-status scheduled">${game.time || 'TBD'}</span>
                </div>
                <div class="score-teams">
                    <div class="team-score away">
                        <span class="team-name-score">${game.awayTeam.name}</span>
                    </div>
                    <span class="score-vs">@</span>
                    <div class="team-score home">
                        <span class="team-name-score">${game.homeTeam.name}</span>
                    </div>
                </div>
                <div class="game-details">
                    <span>${game.date || 'Upcoming'}</span>
                </div>
            </div>
        `).join('');
    }

    displayTopPerformers() {
        const container = document.getElementById('topPerformers');
        const topPerformers = [
            { 
                name: 'Tua Tagovailoa', 
                stat: '4,624 Passing Yards', 
                team: 'MIA',
                position: 'QB',
                photo: 'https://a.espncdn.com/i/headshots/nfl/players/full/4362627.png'
            },
            { 
                name: 'Christian McCaffrey', 
                stat: '1,459 Rushing Yards', 
                team: 'SF',
                position: 'RB',
                photo: 'https://a.espncdn.com/i/headshots/nfl/players/full/3123077.png'
            },
            { 
                name: 'Tyreek Hill', 
                stat: '1,799 Receiving Yards', 
                team: 'MIA',
                position: 'WR',
                photo: 'https://a.espncdn.com/i/headshots/nfl/players/full/2330501.png'
            },
            { 
                name: 'T.J. Watt', 
                stat: '19 Sacks', 
                team: 'PIT',
                position: 'LB',
                photo: 'https://a.espncdn.com/i/headshots/nfl/players/full/3123078.png'
            }
        ];

        container.innerHTML = topPerformers.map(player => `
            <div class="top-performer-card">
                <div class="player-photo-container">
                    <img src="${player.photo}" 
                         alt="${player.name}" 
                         class="player-photo"
                         onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNmM2Y0ZjYiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaIiBmaWxsPSIjOTk5Ii8+CjxwYXRoIGQ9Ik0xMiAxNEM5LjM5NTQzIDE0IDcuMjA5MTQgMTUuNDA5MSA2IDE3LjQwOTFWMjBIMThWMTcuNDA5MUMxNi43OTA5IDE1LjQwOTEgMTQuNjA0NiAxNCAxMiAxNFoiIGZpbGw9IiM5OTkiLz4KPC9zdmc+Cjwvc3ZnPg=='">
                </div>
                <div class="player-info">
                    <div class="player-name">${player.name}</div>
                    <div class="player-position">${player.position}</div>
                    <div class="player-stat">${player.stat}</div>
                </div>
                <div class="team-badge">${player.team}</div>
            </div>
        `).join('');
    }

    displayLatestNews(news) {
        const container = document.getElementById('latestNews');
        const latestNews = news.slice(0, 3);
        
        if (latestNews.length === 0) {
            container.innerHTML = '<p class="text-center text-gray-500">No news available</p>';
            return;
        }

        container.innerHTML = latestNews.map(article => `
            <div class="border-b border-gray-200 pb-3 mb-3 last:border-b-0">
                <h4 class="font-semibold text-sm mb-1">${article.title}</h4>
                <p class="text-xs text-gray-600 mb-1">${article.content}</p>
                <div class="text-xs text-gray-500">${article.source} • ${article.date}</div>
            </div>
        `).join('');
    }

    async loadStandings(conference) {
        const container = document.getElementById('standingsData');
        container.innerHTML = '<div class="loading">Loading standings...</div>';

        try {
            const data = await this.fetchData('/api/teams');
            const teams = data.data?.teams || [];
            
            let filteredTeams = teams;
            if (conference !== 'all') {
                filteredTeams = teams.filter(team => team.conference === conference);
            }

            this.displayStandings(filteredTeams, conference);
        } catch (error) {
            container.innerHTML = `<div class="error">Error loading standings: ${error.message}</div>`;
        }
    }

    displayStandings(teams, conference) {
        const container = document.getElementById('standingsData');
        
        if (conference === 'all') {
            // Group by conference
            const afcTeams = teams.filter(team => team.conference === 'AFC');
            const nfcTeams = teams.filter(team => team.conference === 'NFC');
            
            container.innerHTML = `
                <div class="conference-header">AFC</div>
                ${this.createStandingsTable(afcTeams)}
                <div class="conference-header">NFC</div>
                ${this.createStandingsTable(nfcTeams)}
            `;
        } else {
            container.innerHTML = this.createStandingsTable(teams);
        }
    }

    createStandingsTable(teams) {
        // Group by division
        const divisions = teams.reduce((acc, team) => {
            if (!acc[team.division]) {
                acc[team.division] = [];
            }
            acc[team.division].push(team);
            return acc;
        }, {});

        return Object.keys(divisions).map(division => `
            <div class="p-4">
                <h3 class="font-semibold text-lg mb-3 text-gray-700">${division}</h3>
                <table class="standings-table">
                    <thead>
                        <tr>
                            <th>Team</th>
                            <th>W</th>
                            <th>L</th>
                            <th>T</th>
                            <th>PCT</th>
                            <th>PF</th>
                            <th>PA</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${divisions[division].map(team => `
                            <tr>
                                <td>
                                    <div class="team-info">
                                        <div class="team-logo">${team.abbreviation}</div>
                                        <div>
                                            <div class="team-name">${team.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="team-record">${Math.floor(Math.random() * 12) + 1}</td>
                                <td class="team-record">${Math.floor(Math.random() * 12) + 1}</td>
                                <td class="team-record">0</td>
                                <td class="team-record">0.${Math.floor(Math.random() * 100).toString().padStart(2, '0')}</td>
                                <td>${Math.floor(Math.random() * 500) + 200}</td>
                                <td>${Math.floor(Math.random() * 500) + 200}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `).join('');
    }

    async loadScores(period) {
        const container = document.getElementById('scoresData');
        container.innerHTML = '<div class="loading">Loading scores...</div>';

        try {
            const data = await this.fetchData('/api/games');
            const games = data.data?.games || [];
            
            let filteredGames = games;
            if (period === 'live') {
                filteredGames = games.filter(game => game.status === 'completed');
            } else if (period === 'today') {
                filteredGames = games.filter(game => game.date === new Date().toISOString().split('T')[0]);
            }

            this.displayScores(filteredGames);
        } catch (error) {
            container.innerHTML = `<div class="error">Error loading scores: ${error.message}</div>`;
        }
    }

    displayScores(games) {
        const container = document.getElementById('scoresData');
        
        if (games.length === 0) {
            container.innerHTML = '<p class="text-center text-gray-500">No games found</p>';
            return;
        }

        container.innerHTML = games.map(game => `
            <div class="score-card">
                <div class="score-header">
                    <span class="game-status ${game.status}">${game.status.toUpperCase()}</span>
                </div>
                <div class="score-teams">
                    <div class="team-score away">
                        <span class="team-name-score">${game.awayTeam.name}</span>
                        <span class="team-score-value">${game.awayScore || 0}</span>
                    </div>
                    <span class="score-vs">@</span>
                    <div class="team-score home">
                        <span class="team-score-value">${game.homeScore || 0}</span>
                        <span class="team-name-score">${game.homeTeam.name}</span>
                    </div>
                </div>
                <div class="game-details">
                    <span>${game.date || 'TBD'}</span>
                    <span>${game.time || ''}</span>
                </div>
            </div>
        `).join('');
    }

    async loadDraft() {
        const container = document.getElementById('draftData');
        container.innerHTML = '<div class="loading">Loading draft data...</div>';

        try {
            // Mock draft data
            const draftData = this.generateMockDraftData();
            this.displayDraft(draftData);
        } catch (error) {
            container.innerHTML = `<div class="error">Error loading draft data: ${error.message}</div>`;
        }
    }

    generateMockDraftData() {
        const players = [
            { name: 'Caleb Williams', position: 'QB', college: 'USC', team: 'CHI' },
            { name: 'Jayden Daniels', position: 'QB', college: 'LSU', team: 'WAS' },
            { name: 'Drake Maye', position: 'QB', college: 'UNC', team: 'NE' },
            { name: 'Marvin Harrison Jr.', position: 'WR', college: 'Ohio State', team: 'ARI' },
            { name: 'Malik Nabers', position: 'WR', college: 'LSU', team: 'NYG' },
            { name: 'Rome Odunze', position: 'WR', college: 'Washington', team: 'CHI' },
            { name: 'Joe Alt', position: 'OT', college: 'Notre Dame', team: 'LAC' },
            { name: 'Dallas Turner', position: 'EDGE', college: 'Alabama', team: 'ATL' },
            { name: 'Laiatu Latu', position: 'EDGE', college: 'UCLA', team: 'IND' },
            { name: 'Brock Bowers', position: 'TE', college: 'Georgia', team: 'LV' }
        ];

        return players.map((player, index) => ({
            ...player,
            pick: index + 1,
            round: Math.floor(index / 32) + 1
        }));
    }

    displayDraft(draftData) {
        const container = document.getElementById('draftData');
        const selectedRound = document.getElementById('draftRound')?.value || 'all';
        
        let filteredData = draftData;
        if (selectedRound !== 'all') {
            filteredData = draftData.filter(player => player.round === parseInt(selectedRound));
        }

        container.innerHTML = `
            <table class="draft-table">
                <thead>
                    <tr>
                        <th>Pick</th>
                        <th>Player</th>
                        <th>Position</th>
                        <th>College</th>
                        <th>Team</th>
                    </tr>
                </thead>
                <tbody>
                    ${filteredData.map(player => `
                        <tr>
                            <td class="draft-pick">${player.pick}</td>
                            <td>
                                <div class="player-info">
                                    <span class="player-position">${player.position}</span>
                                    <span class="font-semibold">${player.name}</span>
                                </div>
                            </td>
                            <td>${player.position}</td>
                            <td>${player.college}</td>
                            <td>
                                <span class="font-semibold text-blue-600">${player.team}</span>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    async loadTeams() {
        const container = document.getElementById('teamsData');
        container.innerHTML = '<div class="loading">Loading teams...</div>';

        try {
            const data = await this.fetchData('/api/teams');
            const teams = data.data?.teams || [];
            this.displayTeams(teams);
        } catch (error) {
            container.innerHTML = `<div class="error">Error loading teams: ${error.message}</div>`;
        }
    }

    displayTeams(teams) {
        const container = document.getElementById('teamsData');
        
        container.innerHTML = teams.map(team => `
            <div class="team-card">
                <div class="team-logo-large">${team.abbreviation}</div>
                <div class="team-name-large">${team.name}</div>
                <div class="team-conference">${team.conference} ${team.division}</div>
            </div>
        `).join('');
    }

    async loadPlayers() {
        const container = document.getElementById('playersData');
        container.innerHTML = '<div class="loading">Loading players...</div>';

        try {
            const data = await this.fetchData('/api/players');
            const players = data.data?.players || [];
            this.displayPlayers(players);
        } catch (error) {
            container.innerHTML = `<div class="error">Error loading players: ${error.message}</div>`;
        }
    }

    displayPlayers(players) {
        const container = document.getElementById('playersData');
        
        // Add photo URLs to players
        const playersWithPhotos = players.map(player => ({
            ...player,
            photo: this.getPlayerPhotoUrl(player.name, player.position)
        }));
        
        container.innerHTML = `
            <table class="players-table">
                <thead>
                    <tr>
                        <th>Player</th>
                        <th>Position</th>
                        <th>Team</th>
                        <th>Jersey</th>
                    </tr>
                </thead>
                <tbody>
                    ${playersWithPhotos.map(player => `
                        <tr>
                            <td>
                                <div class="player-info-table">
                                    <img src="${player.photo}" 
                                         alt="${player.name}" 
                                         class="player-photo-small"
                                         onerror="this.style.display='none'">
                                    <div class="player-details">
                                        <span class="player-jersey">${player.jersey || '--'}</span>
                                        <span class="font-semibold">${player.name}</span>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="player-position">${player.position}</span>
                            </td>
                            <td>
                                <span class="font-semibold text-blue-600">${player.team}</span>
                            </td>
                            <td>${player.jersey || '--'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    getPlayerPhotoUrl(playerName, position) {
        // Map of player names to ESPN photo IDs
        const playerPhotos = {
            'Josh Allen': 'https://a.espncdn.com/i/headshots/nfl/players/full/3123077.png',
            'Tua Tagovailoa': 'https://a.espncdn.com/i/headshots/nfl/players/full/4362627.png',
            'Patrick Mahomes': 'https://a.espncdn.com/i/headshots/nfl/players/full/3139477.png',
            'Lamar Jackson': 'https://a.espncdn.com/i/headshots/nfl/players/full/3918295.png',
            'Dak Prescott': 'https://a.espncdn.com/i/headshots/nfl/players/full/2577417.png',
            'Derrick Henry': 'https://a.espncdn.com/i/headshots/nfl/players/full/2577417.png',
            'Christian McCaffrey': 'https://a.espncdn.com/i/headshots/nfl/players/full/3123077.png',
            'Saquon Barkley': 'https://a.espncdn.com/i/headshots/nfl/players/full/3123077.png',
            'Nick Chubb': 'https://a.espncdn.com/i/headshots/nfl/players/full/3123077.png',
            'Stefon Diggs': 'https://a.espncdn.com/i/headshots/nfl/players/full/2577417.png',
            'Tyreek Hill': 'https://a.espncdn.com/i/headshots/nfl/players/full/2330501.png',
            'Cooper Kupp': 'https://a.espncdn.com/i/headshots/nfl/players/full/3123077.png',
            'Davante Adams': 'https://a.espncdn.com/i/headshots/nfl/players/full/2330501.png',
            'A.J. Brown': 'https://a.espncdn.com/i/headshots/nfl/players/full/3123077.png',
            'Travis Kelce': 'https://a.espncdn.com/i/headshots/nfl/players/full/2330501.png',
            'Mark Andrews': 'https://a.espncdn.com/i/headshots/nfl/players/full/3123077.png',
            'George Kittle': 'https://a.espncdn.com/i/headshots/nfl/players/full/3123077.png',
            'Aaron Donald': 'https://a.espncdn.com/i/headshots/nfl/players/full/2330501.png',
            'T.J. Watt': 'https://a.espncdn.com/i/headshots/nfl/players/full/3123078.png',
            'Myles Garrett': 'https://a.espncdn.com/i/headshots/nfl/players/full/3123077.png'
        };
        
        return playerPhotos[playerName] || this.getDefaultPlayerPhoto(position);
    }

    getDefaultPlayerPhoto(position) {
        // Return a default photo based on position
        const positionColors = {
            'QB': '#3182ce',
            'RB': '#38a169',
            'WR': '#d69e2e',
            'TE': '#e53e3e',
            'DEF': '#805ad5',
            'LB': '#d69e2e',
            'DT': '#e53e3e',
            'DE': '#e53e3e'
        };
        
        const color = positionColors[position] || '#718096';
        
        return `data:image/svg+xml;base64,${btoa(`
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="20" fill="${color}"/>
                <circle cx="20" cy="16" r="6" fill="white"/>
                <path d="M8 28c0-6.627 5.373-12 12-12s12 5.373 12 12" fill="white"/>
                <text x="20" y="25" text-anchor="middle" fill="white" font-size="8" font-weight="bold">${position}</text>
            </svg>
        `)}`;
    }

    async loadStats(category) {
        const container = document.getElementById('statsData');
        container.innerHTML = '<div class="loading">Loading statistics...</div>';

        try {
            const data = await this.fetchData('/api/stats');
            const stats = data.data?.stats || [];
            this.displayStats(stats, category);
        } catch (error) {
            container.innerHTML = `<div class="error">Error loading statistics: ${error.message}</div>`;
        }
    }

    displayStats(stats, category) {
        const container = document.getElementById('statsData');
        
        // Filter stats by category
        const categoryMap = {
            'passing': 'Passing',
            'rushing': 'Rushing',
            'receiving': 'Receiving',
            'defense': 'Defense'
        };
        
        const filteredStats = stats.filter(stat => 
            stat.category.toLowerCase().includes(categoryMap[category].toLowerCase())
        );

        // Add photos to stats
        const statsWithPhotos = filteredStats.map(stat => ({
            ...stat,
            photo: this.getPlayerPhotoUrl(stat.player, this.getPositionFromCategory(stat.category))
        }));

        container.innerHTML = `
            <table class="stats-table">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Player</th>
                        <th>Team</th>
                        <th>Category</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    ${statsWithPhotos.map((stat, index) => `
                        <tr>
                            <td class="stat-value">${index + 1}</td>
                            <td>
                                <div class="player-info-table">
                                    <img src="${stat.photo}" 
                                         alt="${stat.player}" 
                                         class="player-photo-small"
                                         onerror="this.style.display='none'">
                                    <span class="font-semibold">${stat.player}</span>
                                </div>
                            </td>
                            <td>
                                <span class="font-semibold text-blue-600">${stat.team}</span>
                            </td>
                            <td>${stat.category}</td>
                            <td class="stat-value">${stat.value}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    getPositionFromCategory(category) {
        const categoryToPosition = {
            'Passing Yards': 'QB',
            'Passing TDs': 'QB',
            'Rushing Yards': 'RB',
            'Rushing TDs': 'RB',
            'Receiving Yards': 'WR',
            'Receiving TDs': 'WR',
            'Sacks': 'LB',
            'Interceptions': 'DEF',
            'Tackles': 'LB'
        };
        
        return categoryToPosition[category] || 'QB';
    }

    // Filter functions
    filterTeams(searchTerm) {
        // Implementation for team search
        console.log('Filtering teams by:', searchTerm);
    }

    filterTeamsByConference(conference) {
        // Implementation for conference filter
        console.log('Filtering teams by conference:', conference);
    }

    filterPlayers(searchTerm) {
        // Implementation for player search
        console.log('Filtering players by:', searchTerm);
    }

    filterPlayersByPosition(position) {
        // Implementation for position filter
        console.log('Filtering players by position:', position);
    }

    // Utility functions
    async fetchData(endpoint) {
        if (this.cache.has(endpoint)) {
            return this.cache.get(endpoint);
        }

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
            
            const response = await fetch(`${this.apiBaseUrl}${endpoint}`, {
                signal: controller.signal,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            this.cache.set(endpoint, data);
            return data;
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error);
            // Return fallback data for better UX
            return this.getFallbackData(endpoint);
        }
    }

    getFallbackData(endpoint) {
        const fallbackData = {
            '/api/teams': { success: true, data: { teams: [] } },
            '/api/games': { success: true, data: { games: [] } },
            '/api/players': { success: true, data: { players: [] } },
            '/api/stats': { success: true, data: { stats: [] } },
            '/api/leaderboards': { success: true, data: { leaderboards: {} } },
            '/api/news': { success: true, data: { news: [] } }
        };
        return fallbackData[endpoint] || { success: false, error: 'Data not available' };
    }

    updateLastUpdated() {
        const element = document.getElementById('lastUpdated');
        if (element) {
            element.textContent = new Date().toLocaleString();
        }
    }

    startAutoRefresh() {
        // Refresh data every 5 minutes
        this.refreshInterval = setInterval(() => {
            this.refreshData();
        }, 5 * 60 * 1000);
    }

    refreshData() {
        this.cache.clear();
        this.updateLastUpdated();
        this.loadSectionData(this.currentSection);
    }

    destroy() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
    }
}

// Global functions
function refreshData() {
    if (window.footballDB) {
        window.footballDB.refreshData();
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🏈 DOM Content Loaded - Initializing FootballDB');
    window.footballDB = new FootballDB();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.footballDB) {
        window.footballDB.destroy();
    }
});
