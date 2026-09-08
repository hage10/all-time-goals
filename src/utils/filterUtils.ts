import { Goal, FilterState } from '../types/archive';

export function filterGoals(goals: Goal[], filters: FilterState): Goal[] {
  const searchLower = filters.search.trim().toLowerCase();

  return goals.filter((goal) => {
    // 1. Search Query
    if (searchLower) {
      const matchSearch =
        goal.title.toLowerCase().includes(searchLower) ||
        (goal.opponent && goal.opponent.toLowerCase().includes(searchLower)) ||
        (goal.competition && goal.competition.toLowerCase().includes(searchLower)) ||
        (goal.assist && goal.assist.toLowerCase().includes(searchLower)) ||
        (goal.goalkeeper && goal.goalkeeper.toLowerCase().includes(searchLower)) ||
        (goal.stadium && goal.stadium.toLowerCase().includes(searchLower)) ||
        (goal.season && goal.season.toLowerCase().includes(searchLower)) ||
        (goal.date && goal.date.toLowerCase().includes(searchLower));

      if (!matchSearch) return false;
    }

    // 2. Team
    if (filters.team && filters.team !== 'all') {
      const teamLower = filters.team.toLowerCase();
      const goalHome = (goal.homeTeam || '').toLowerCase();
      const goalImage = (goal.image || '').toLowerCase();
      if (!goalHome.includes(teamLower) && !goalImage.includes(teamLower)) {
        return false;
      }
    }

    // 3. Competition
    if (filters.competition && filters.competition !== 'all') {
      if ((goal.competition || '').toLowerCase() !== filters.competition.toLowerCase()) {
        return false;
      }
    }

    // 4. Opponent
    if (filters.opponent && filters.opponent !== 'all') {
      if ((goal.opponent || '').toLowerCase() !== filters.opponent.toLowerCase()) {
        return false;
      }
    }

    // 5. Season
    if (filters.season && filters.season !== 'all') {
      if ((goal.season || '').toLowerCase() !== filters.season.toLowerCase()) {
        return false;
      }
    }

    // 6. Shot Type
    if (filters.shotType && filters.shotType !== 'all') {
      switch (filters.shotType) {
        case 'freekick':
          if (goal.freekick !== 'yes') return false;
          break;
        case 'penalty':
          if (goal.penalty !== 'yes') return false;
          break;
        case 'outsidebox':
          if (goal.outsidebox !== 'yes') return false;
          break;
        case 'insidebox':
          if (goal.insidebox !== 'yes') return false;
          break;
        case 'header':
          if (goal.header !== 'yes') return false;
          break;
        case 'openplay':
          if (goal.penalty === 'yes' || goal.freekick === 'yes') return false;
          break;
      }
    }

    // 7. Foot
    if (filters.foot && filters.foot !== 'all') {
      if (filters.foot === 'left' && goal.leftfoot !== 'yes') return false;
      if (filters.foot === 'right' && goal.rightfoot !== 'yes') return false;
      if (filters.foot === 'head' && goal.header !== 'yes') return false;
    }

    return true;
  }).sort((a, b) => {
    const numA = parseInt(a.title, 10) || 0;
    const numB = parseInt(b.title, 10) || 0;

    switch (filters.sort) {
      case 'asc':
        return numA - numB;
      case 'desc':
        return numB - numA;
      case 'xg_high':
        return (b.xg || 0) - (a.xg || 0);
      case 'minute_late':
        return (parseInt(b.minute || '0', 10) || 0) - (parseInt(a.minute || '0', 10) || 0);
      default:
        return numB - numA;
    }
  });
}
