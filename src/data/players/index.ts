import { PlayerProfile, PlayerComparisonData } from '../../types/player';
import { Goal } from '../../types/archive';

import messiGoals from './messi/goals.json';
import messiAssists from './messi/assists.json';
import ronaldoGoals from './ronaldo/goals.json';
import haalandGoals from './haaland/goals.json';
import mbappeGoals from './mbappe/goals.json';
import neymarGoals from './neymar/goals.json';

export const PLAYERS: PlayerProfile[] = [
  {
    id: 'messi',
    name: 'Lionel Messi',
    fullName: 'Lionel Andrés Messi',
    shortName: 'Messi',
    nickname: 'La Pulga · The GOAT',
    birthDate: '24/06/1987',
    nationality: 'Argentina',
    nationalityCode: 'ARG',
    flag: '🇦🇷',
    avatar: 'https://cdn.jsdelivr.net/gh/oonurm30/fotolar/2022-2023-new.png',
    coverImage: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1200&auto=format&fit=crop',
    currentClub: 'Inter Miami CF',
    currentClubCrest: 'inter.png',
    dominantFoot: 'Left',
    position: 'Right Winger / Attacking Midfielder',
    quote: 'You have to fight to reach your dream. You have to sacrifice and work hard for it.',
    theme: {
      primary: '#F97316',
      primaryRgb: '249, 115, 22',
      primaryLight: '#FB923C',
      primaryDark: '#EA580C',
      accent: '#A50044',
      gradient: 'from-orange-500 via-rose-500 to-amber-500',
    },
    stats: {
      totalGoals: 927,
      totalAssists: 425,
      totalMatches: 1115,
      freeKicks: 66,
      penalties: 112,
      hatTricks: 59,
      ballonDor: 8,
      goldenBoots: 6,
      championsLeagues: 4,
      worldCups: 1,
      minutesPerGoal: 104,
      careerSpan: '2004 – Present',
    },
    clubs: [
      { name: 'FC Barcelona', crest: 'barcelona.png', years: '2004–2021', goals: 672, assists: 303, matches: 778 },
      { name: 'Paris Saint-Germain', crest: 'psg.png', years: '2021–2023', goals: 32, assists: 35, matches: 75 },
      { name: 'Inter Miami CF', crest: 'inter.png', years: '2023–Present', goals: 34, assists: 18, matches: 39 },
      { name: 'Argentina', crest: 'argentina.png', years: '2005–Present', goals: 112, assists: 57, matches: 189 },
    ],
    shotMapProfile: {
      preferredZone: 'Right half-space & Central D box',
      averageDistance: 17.4,
      xgPerShot: 0.17,
    },
  },
  {
    id: 'ronaldo',
    name: 'Cristiano Ronaldo',
    fullName: 'Cristiano Ronaldo dos Santos Aveiro',
    shortName: 'Cristiano',
    nickname: 'CR7 · El Bicho',
    birthDate: '05/02/1985',
    nationality: 'Portugal',
    nationalityCode: 'POR',
    flag: '🇵🇹',
    avatar: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=400&auto=format&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop',
    currentClub: 'Al Nassr FC',
    currentClubCrest: 'alnassr.png',
    dominantFoot: 'Right',
    position: 'Forward / Left Winger',
    quote: 'Your love makes me strong, your hate makes me unstoppable.',
    theme: {
      primary: '#EAB308',
      primaryRgb: '234, 179, 8',
      primaryLight: '#FACC15',
      primaryDark: '#CA8A04',
      accent: '#DC2626',
      gradient: 'from-amber-400 via-yellow-500 to-red-600',
    },
    stats: {
      totalGoals: 915,
      totalAssists: 255,
      totalMatches: 1245,
      freeKicks: 64,
      penalties: 168,
      hatTricks: 66,
      ballonDor: 5,
      goldenBoots: 4,
      championsLeagues: 5,
      worldCups: 0,
      minutesPerGoal: 112,
      careerSpan: '2002 – Present',
    },
    clubs: [
      { name: 'Sporting CP', crest: 'sportingcp.png', years: '2002–2003', goals: 5, assists: 6, matches: 31 },
      { name: 'Manchester United', crest: 'manchesterunited.png', years: '2003–2009, 2021–2022', goals: 145, assists: 64, matches: 346 },
      { name: 'Real Madrid', crest: 'realmadrid.png', years: '2009–2018', goals: 450, assists: 131, matches: 438 },
      { name: 'Juventus', crest: 'juventus.png', years: '2018–2021', goals: 101, assists: 22, matches: 134 },
      { name: 'Al Nassr', crest: 'alnassr.png', years: '2023–Present', goals: 79, assists: 19, matches: 84 },
      { name: 'Portugal', crest: 'portugal.png', years: '2003–Present', goals: 135, assists: 45, matches: 216 },
    ],
    shotMapProfile: {
      preferredZone: 'Central Box & Left Wing Cut-in',
      averageDistance: 15.8,
      xgPerShot: 0.16,
    },
  },
  {
    id: 'haaland',
    name: 'Erling Haaland',
    fullName: 'Erling Braut Haaland',
    shortName: 'Haaland',
    nickname: 'The Cyborg · Goal Machine',
    birthDate: '21/07/2000',
    nationality: 'Norway',
    nationalityCode: 'NOR',
    flag: '🇳🇴',
    avatar: 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?q=80&w=400&auto=format&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1200&auto=format&fit=crop',
    currentClub: 'Manchester City',
    currentClubCrest: 'manchestercity.png',
    dominantFoot: 'Left',
    position: 'Centre-Forward / Striker',
    quote: 'I like when it’s pressure. I like to feel the pressure.',
    theme: {
      primary: '#38BDF8',
      primaryRgb: '56, 189, 248',
      primaryLight: '#7DD3FC',
      primaryDark: '#0284C7',
      accent: '#FACC15',
      gradient: 'from-sky-400 via-cyan-500 to-blue-600',
    },
    stats: {
      totalGoals: 293,
      totalAssists: 58,
      totalMatches: 348,
      freeKicks: 2,
      penalties: 44,
      hatTricks: 24,
      ballonDor: 0,
      goldenBoots: 2,
      championsLeagues: 1,
      worldCups: 0,
      minutesPerGoal: 91,
      careerSpan: '2016 – Present',
    },
    clubs: [
      { name: 'Molde FK', crest: 'molde.png', years: '2017–2018', goals: 20, assists: 6, matches: 50 },
      { name: 'RB Salzburg', crest: 'salzburg.png', years: '2019–2020', goals: 29, assists: 7, matches: 27 },
      { name: 'Borussia Dortmund', crest: 'dortmund.png', years: '2020–2022', goals: 86, assists: 23, matches: 89 },
      { name: 'Manchester City', crest: 'manchestercity.png', years: '2022–Present', goals: 120, assists: 16, matches: 128 },
      { name: 'Norway', crest: 'norway.png', years: '2019–Present', goals: 38, assists: 6, matches: 39 },
    ],
    shotMapProfile: {
      preferredZone: '6-yard box & Central Penalty Area',
      averageDistance: 11.2,
      xgPerShot: 0.24,
    },
  },
  {
    id: 'mbappe',
    name: 'Kylian Mbappé',
    fullName: 'Kylian Mbappé Lottin',
    shortName: 'Mbappé',
    nickname: 'Donatello · Speed King',
    birthDate: '20/12/1998',
    nationality: 'France',
    nationalityCode: 'FRA',
    flag: '🇫🇷',
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=400&auto=format&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1200&auto=format&fit=crop',
    currentClub: 'Real Madrid CF',
    currentClubCrest: 'realmadrid.png',
    dominantFoot: 'Right',
    position: 'Left Winger / Centre-Forward',
    quote: 'Always believe in your dreams, work hard, and never let anyone tell you that you cannot.',
    theme: {
      primary: '#6366F1',
      primaryRgb: '99, 102, 241',
      primaryLight: '#818CF8',
      primaryDark: '#4F46E5',
      accent: '#E11D48',
      gradient: 'from-indigo-500 via-blue-600 to-rose-500',
    },
    stats: {
      totalGoals: 363,
      totalAssists: 168,
      totalMatches: 486,
      freeKicks: 3,
      penalties: 46,
      hatTricks: 19,
      ballonDor: 0,
      goldenBoots: 1,
      championsLeagues: 0,
      worldCups: 1,
      minutesPerGoal: 108,
      careerSpan: '2015 – Present',
    },
    clubs: [
      { name: 'AS Monaco', crest: 'monaco.png', years: '2015–2017', goals: 27, assists: 16, matches: 60 },
      { name: 'Paris Saint-Germain', crest: 'psg.png', years: '2017–2024', goals: 256, assists: 108, matches: 308 },
      { name: 'Real Madrid', crest: 'realmadrid.png', years: '2024–Present', goals: 32, assists: 8, matches: 41 },
      { name: 'France', crest: 'france.png', years: '2017–Present', goals: 48, assists: 36, matches: 86 },
    ],
    shotMapProfile: {
      preferredZone: 'Left half-space sprint cut-in & far post',
      averageDistance: 14.5,
      xgPerShot: 0.19,
    },
  },
  {
    id: 'neymar',
    name: 'Neymar Jr',
    fullName: 'Neymar da Silva Santos Júnior',
    shortName: 'Neymar',
    nickname: 'O Mágico · Joga Bonito',
    birthDate: '05/02/1992',
    nationality: 'Brazil',
    nationalityCode: 'BRA',
    flag: '🇧🇷',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=1200&auto=format&fit=crop',
    currentClub: 'Al Hilal SFC',
    currentClubCrest: 'alhilal.png',
    dominantFoot: 'Right',
    position: 'Left Winger / Playmaker',
    quote: 'I have never been afraid of anything on the pitch. Football is joy.',
    theme: {
      primary: '#22C55E',
      primaryRgb: '34, 197, 94',
      primaryLight: '#4ADE80',
      primaryDark: '#16A34A',
      accent: '#EAB308',
      gradient: 'from-emerald-500 via-green-500 to-amber-400',
    },
    stats: {
      totalGoals: 443,
      totalAssists: 275,
      totalMatches: 715,
      freeKicks: 21,
      penalties: 82,
      hatTricks: 21,
      ballonDor: 0,
      goldenBoots: 0,
      championsLeagues: 1,
      worldCups: 0,
      minutesPerGoal: 135,
      careerSpan: '2009 – Present',
    },
    clubs: [
      { name: 'Santos FC', crest: 'santos.png', years: '2009–2013', goals: 136, assists: 69, matches: 225 },
      { name: 'FC Barcelona', crest: 'barcelona.png', years: '2013–2017', goals: 105, assists: 76, matches: 186 },
      { name: 'Paris Saint-Germain', crest: 'psg.png', years: '2017–2023', goals: 118, assists: 77, matches: 173 },
      { name: 'Al Hilal', crest: 'alhilal.png', years: '2023–Present', goals: 5, assists: 5, matches: 7 },
      { name: 'Brazil', crest: 'brazil.png', years: '2010–Present', goals: 79, assists: 58, matches: 128 },
    ],
    shotMapProfile: {
      preferredZone: 'Left wing dribble into penalty area & finesse curls',
      averageDistance: 16.2,
      xgPerShot: 0.18,
    },
  },
];

export const PLAYER_DATA: Record<string, { goals: Goal[]; assists: Goal[] }> = {
  messi: {
    goals: messiGoals as unknown as Goal[],
    assists: messiAssists as unknown as Goal[],
  },
  ronaldo: {
    goals: ronaldoGoals as unknown as Goal[],
    assists: [],
  },
  haaland: {
    goals: haalandGoals as unknown as Goal[],
    assists: [],
  },
  mbappe: {
    goals: mbappeGoals as unknown as Goal[],
    assists: [],
  },
  neymar: {
    goals: neymarGoals as unknown as Goal[],
    assists: [],
  },
};

export function getPlayer(id: string): PlayerProfile {
  return PLAYERS.find((p) => p.id === id) || PLAYERS[0];
}

export function getPlayerGoals(id: string): Goal[] {
  return PLAYER_DATA[id]?.goals || PLAYER_DATA.messi.goals;
}

export function getPlayerAssists(id: string): Goal[] {
  return PLAYER_DATA[id]?.assists || PLAYER_DATA.messi.assists;
}

export function getComparisonData(p1Id: string, p2Id: string): PlayerComparisonData {
  const p1 = getPlayer(p1Id);
  const p2 = getPlayer(p2Id);

  const radarMetrics = [
    { metric: 'Goals Total', p1Value: p1.stats.totalGoals, p2Value: p2.stats.totalGoals, maxValue: 1000, label: 'Goals' },
    { metric: 'Assists Total', p1Value: p1.stats.totalAssists, p2Value: p2.stats.totalAssists, maxValue: 500, label: 'Assists' },
    { metric: 'Free Kicks', p1Value: p1.stats.freeKicks, p2Value: p2.stats.freeKicks, maxValue: 75, label: 'Free Kicks' },
    { metric: 'Penalties', p1Value: p1.stats.penalties, p2Value: p2.stats.penalties, maxValue: 180, label: 'Penalties' },
    { metric: 'Hat-tricks', p1Value: p1.stats.hatTricks, p2Value: p2.stats.hatTricks, maxValue: 70, label: 'Hat-Tricks' },
    { metric: 'Ballon d’Or', p1Value: p1.stats.ballonDor, p2Value: p2.stats.ballonDor, maxValue: 10, label: 'Ballon d’Or' },
    { metric: 'Champions League', p1Value: p1.stats.championsLeagues, p2Value: p2.stats.championsLeagues, maxValue: 6, label: 'UCL' },
    { metric: 'World Cups', p1Value: p1.stats.worldCups, p2Value: p2.stats.worldCups, maxValue: 2, label: 'World Cup' },
  ];

  const intervals = ['1-15', '16-30', '31-45', '46-60', '61-75', '76-90+'];
  const byMinuteDistribution = intervals.map((interval, i) => {
    const p1Fraction = [0.12, 0.15, 0.18, 0.17, 0.19, 0.23][i];
    const p2Fraction = [0.11, 0.14, 0.17, 0.18, 0.20, 0.25][i];
    return {
      minuteInterval: `${interval}'`,
      p1Goals: Math.round(p1.stats.totalGoals * p1Fraction),
      p2Goals: Math.round(p2.stats.totalGoals * p2Fraction),
    };
  });

  return {
    player1: p1,
    player2: p2,
    radarMetrics,
    byMinuteDistribution,
  };
}
