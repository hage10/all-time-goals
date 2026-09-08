import { Goal } from './archive';

export interface PlayerStats {
  totalGoals: number;
  totalAssists: number;
  totalMatches: number;
  freeKicks: number;
  penalties: number;
  hatTricks: number;
  ballonDor: number;
  goldenBoots: number;
  championsLeagues: number;
  worldCups: number;
  minutesPerGoal: number;
  careerSpan: string;
}

export interface PlayerTheme {
  primary: string;
  primaryRgb: string;
  primaryLight: string;
  primaryDark: string;
  accent: string;
  gradient: string;
}

export interface PlayerProfile {
  id: string; // 'messi' | 'ronaldo' | 'haaland' | 'mbappe' | 'neymar'
  name: string;
  fullName: string;
  shortName: string;
  nickname: string;
  birthDate: string;
  nationality: string;
  nationalityCode: string;
  flag: string;
  avatar: string;
  coverImage: string;
  currentClub: string;
  currentClubCrest: string;
  dominantFoot: 'Left' | 'Right';
  position: string;
  quote: string;
  theme: PlayerTheme;
  stats: PlayerStats;
  clubs: Array<{
    name: string;
    crest: string;
    years: string;
    goals: number;
    assists: number;
    matches: number;
  }>;
  shotMapProfile: {
    preferredZone: string;
    averageDistance: number;
    xgPerShot: number;
  };
}

export interface PlayerComparisonData {
  player1: PlayerProfile;
  player2: PlayerProfile;
  radarMetrics: Array<{
    metric: string;
    p1Value: number;
    p2Value: number;
    maxValue: number;
    label: string;
  }>;
  byMinuteDistribution: Array<{
    minuteInterval: string;
    p1Goals: number;
    p2Goals: number;
  }>;
}
