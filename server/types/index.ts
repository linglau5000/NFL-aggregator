export interface Team {
  id: string;
  name: string;
  abbreviation: string;
  city: string;
  conference: 'AFC' | 'NFC';
  division: 'North' | 'South' | 'East' | 'West';
  logo?: string;
  colors?: {
    primary: string;
    secondary: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Player {
  id: string;
  name: string;
  position: string;
  number: number;
  teamId: string;
  height?: string;
  weight?: number;
  age?: number;
  college?: string;
  experience?: number;
  status: 'active' | 'injured' | 'suspended';
  createdAt: Date;
  updatedAt: Date;
}

export interface Game {
  id: string;
  season: number;
  week: number;
  gameType: 'regular' | 'playoff' | 'superbowl';
  status: 'scheduled' | 'in_progress' | 'completed' | 'postponed' | 'cancelled';
  date: Date;
  homeTeamId: string;
  awayTeamId: string;
  homeScore?: number;
  awayScore?: number;
  quarter?: number;
  timeRemaining?: string;
  venue?: string;
  weather?: any;
  attendance?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface GameStats {
  id: string;
  gameId: string;
  teamId: string;
  totalYards: number;
  passingYards: number;
  rushingYards: number;
  turnovers: number;
  penalties: number;
  timeOfPossession?: string;
  firstDowns: number;
  thirdDownConversions: number;
  thirdDownAttempts: number;
  redZoneAttempts: number;
  redZoneConversions: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlayerStats {
  id: string;
  gameId: string;
  playerId: string;
  teamId: string;
  position: string;
  passAttempts: number;
  passCompletions: number;
  passYards: number;
  passTDs: number;
  interceptions: number;
  passRating?: number;
  rushAttempts: number;
  rushYards: number;
  rushTDs: number;
  fumbles: number;
  receptions: number;
  receivingYards: number;
  receivingTDs: number;
  tackles: number;
  sacks: number;
  fumbleRecoveries: number;
  passesDefended: number;
  fieldGoals: number;
  fieldGoalAttempts: number;
  extraPoints: number;
  extraPointAttempts: number;
  punts: number;
  puntYards: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamStats {
  id: string;
  teamId: string;
  season: number;
  week?: number;
  wins: number;
  losses: number;
  ties: number;
  pointsFor: number;
  pointsAgainst: number;
  totalYards: number;
  totalYardsAllowed: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Leaderboard {
  id: string;
  season: number;
  week?: number;
  category: string;
  playerId?: string;
  teamId?: string;
  value: number;
  rank: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface News {
  id: string;
  title: string;
  content: string;
  author?: string;
  source: string;
  url?: string;
  imageUrl?: string;
  publishedAt: Date;
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface GameWithTeams extends Game {
  homeTeam: Team;
  awayTeam: Team;
}

export interface PlayerWithTeam extends Player {
  team: Team;
}

export interface GameWithStats extends Game {
  homeTeam: Team;
  awayTeam: Team;
  gameStats: GameStats[];
  playerStats: PlayerStats[];
}
