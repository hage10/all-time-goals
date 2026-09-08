const PHOTO_CDN = 'https://cdn.jsdelivr.net/gh/oonurm30/fotolar';

export function getGoalPhotoUrl(goal: {
  season?: string;
  homeTeam?: string;
  awayTeam?: string;
  image?: string;
  date?: string;
  title?: string;
}): string {
  const isArgentina =
    (goal.homeTeam || '').toLowerCase().includes('argentina') ||
    (goal.awayTeam || '').toLowerCase().includes('argentina') ||
    (goal.image || '').toLowerCase().includes('argentina');

  let season = goal.season || '';

  // Extract year from date if season not provided e.g. "01/05/2005"
  if (!season && goal.date) {
    const parts = goal.date.split('/');
    if (parts.length === 3) {
      const year = parseInt(parts[2], 10);
      const month = parseInt(parts[1], 10);
      if (month >= 8) {
        season = `${year}-${year + 1}`;
      } else {
        season = `${year - 1}-${year}`;
      }
    }
  }

  // Format 4-digit seasons if standard e.g. "2023", "2024", "2025", "2026"
  if (season.length === 4) {
    const y = parseInt(season, 10);
    season = `${y}-${y + 1}`;
  }

  // Handle Argentina national team photos
  if (isArgentina) {
    if (season.includes('2022') || season.includes('2023')) {
      return `${PHOTO_CDN}/2022-2023-arg-new.png`;
    }
    if (season.includes('2021') || season.includes('2022')) {
      return `${PHOTO_CDN}/2021-2022-arg.png`;
    }
    if (season.includes('2018') || season.includes('2019')) {
      return `${PHOTO_CDN}/2018-2019-arg.png`;
    }
    if (season.includes('2014') || season.includes('2015')) {
      return `${PHOTO_CDN}/2014-2015-arg.png`;
    }
    if (season.includes('2011') || season.includes('2012')) {
      return `${PHOTO_CDN}/2011-2012-arg-new.png`;
    }
    if (season.includes('2010') || season.includes('2011')) {
      return `${PHOTO_CDN}/2010-2011-arg-new.png`;
    }
    if (season.includes('2008') || season.includes('2009')) {
      return `${PHOTO_CDN}/2008-2009-arg-new.png`;
    }
    if (season.includes('2006') || season.includes('2007')) {
      return `${PHOTO_CDN}/2006-2007-arg-new.png`;
    }
    if (season.includes('2025') || season.includes('2026')) {
      return `${PHOTO_CDN}/2025-2026-arg-new.png`;
    }
    return `${PHOTO_CDN}/2022-2023-arg-new.png`;
  }

  // Club matches
  if (season.includes('2026') || season.includes('2027')) {
    return `${PHOTO_CDN}/2026-new.png`;
  }
  if (season.includes('2025')) {
    return `${PHOTO_CDN}/2025-new.png`;
  }
  if (season.includes('2024')) {
    return `${PHOTO_CDN}/2024-new.png`;
  }
  if (season.includes('2023')) {
    return `${PHOTO_CDN}/2023-new.png`;
  }
  if (season.includes('2022') || season.includes('2023')) {
    return `${PHOTO_CDN}/2022-2023-new.png`;
  }
  if (season.includes('2021') || season.includes('2022')) {
    return `${PHOTO_CDN}/2021-2022-new.png`;
  }
  if (season.includes('2020') || season.includes('2021')) {
    return `${PHOTO_CDN}/2020-2021-new.png`;
  }
  if (season.includes('2019') || season.includes('2020')) {
    return `${PHOTO_CDN}/2019-2020-new.png`;
  }
  if (season.includes('2018') || season.includes('2019')) {
    return `${PHOTO_CDN}/2018-2019-new.png`;
  }
  if (season.includes('2017') || season.includes('2018')) {
    return `${PHOTO_CDN}/2017-2018-new.png`;
  }
  if (season.includes('2016') || season.includes('2017')) {
    return `${PHOTO_CDN}/2016-2017-new.png`;
  }
  if (season.includes('2015') || season.includes('2016')) {
    return `${PHOTO_CDN}/2015-2016-new.png`;
  }
  if (season.includes('2014') || season.includes('2015')) {
    return `${PHOTO_CDN}/2014-2015-new.png`;
  }
  if (season.includes('2013') || season.includes('2014')) {
    return `${PHOTO_CDN}/2013-2014-new.png`;
  }
  if (season.includes('2012') || season.includes('2013')) {
    return `${PHOTO_CDN}/2012-2013-new.png`;
  }
  if (season.includes('2011') || season.includes('2012')) {
    return `${PHOTO_CDN}/2011-2012-new.png`;
  }
  if (season.includes('2010') || season.includes('2011')) {
    return `${PHOTO_CDN}/2010-2011-new.png`;
  }
  if (season.includes('2009') || season.includes('2010')) {
    return `${PHOTO_CDN}/2009-2010-new.png`;
  }
  if (season.includes('2008') || season.includes('2009')) {
    return `${PHOTO_CDN}/2008-2009-new.png`;
  }
  if (season.includes('2007') || season.includes('2008')) {
    return `${PHOTO_CDN}/2007-2008-new.png`;
  }
  if (season.includes('2006') || season.includes('2007')) {
    return `${PHOTO_CDN}/2006-2007-new.png`;
  }
  if (season.includes('2005') || season.includes('2006')) {
    return `${PHOTO_CDN}/2005-2006-new.png`;
  }
  if (season.includes('2004') || season.includes('2005')) {
    return `${PHOTO_CDN}/2004-2005-new.png`;
  }

  return `${PHOTO_CDN}/2011-2012-new.png`;
}
