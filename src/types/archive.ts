export interface PitchCoord {
  x: number;
  y: number;
}

export interface Goal {
  title: string;
  opponent: string;
  competition: string;
  date: string;
  minute?: string;
  stadium?: string;
  homeTeam?: string;
  awayTeam?: string;
  homeScore?: string;
  awayScore?: string;
  info?: string;
  image?: string;
  oppoimage?: string;
  type?: 'goal' | 'assist';
  insidebox?: string;
  outsidebox?: string;
  leftfoot?: string;
  rightfoot?: string;
  header?: string;
  penalty?: string;
  freekick?: string;
  coord?: PitchCoord;
  xg?: number;
  xgSource?: string;
  assist?: string;
  season?: string;
  matchNumber?: string;
  minutesPlayed?: string;
  rating?: string;
  path?: PitchCoord[];
  videoUrl?: string;
  goalkeeper?: string;
  isIconic?: boolean;
}

export interface Assist {
  date: string;
  matchNumber?: string;
  info?: string;
  homeTeam?: string;
  homeScore?: string;
  awayTeam?: string;
  awayScore?: string;
  opponent?: string;
  competition?: string;
  rating?: string;
  minutesPlayed?: string;
  messiGoals?: string;
  messiAssists?: string;
}

export interface FilterState {
  search: string;
  team: string;
  competition: string;
  opponent: string;
  season: string;
  shotType: string;
  foot: string;
  sort: 'desc' | 'asc' | 'xg_high' | 'minute_late';
}

export type ViewMode = 'goals' | 'shotmapper' | 'assists' | 'iconic';
