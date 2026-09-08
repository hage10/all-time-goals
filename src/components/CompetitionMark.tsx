import React from 'react';

interface CompetitionMarkProps {
  competition?: string;
  year?: string;
  size?: number;
  className?: string;
}

export const CompetitionMark: React.FC<CompetitionMarkProps> = ({
  competition = '',
  year = '',
  size = 20,
  className = '',
}) => {
  const comp = competition.toLowerCase();
  const yr = parseInt(year, 10);

  let iconFile = '';

  if (comp.includes('world cup') && !comp.includes('qualifier') && !comp.includes('club')) {
    if (yr === 2022) iconFile = 'wc2022.png';
    else if (yr === 2018) iconFile = 'wc2018.png';
    else if (yr === 2014) iconFile = 'wc2014.png';
    else if (yr === 2010) iconFile = 'wc2010.png';
    else if (yr === 2006) iconFile = 'wc2006.png';
    else iconFile = 'wc2022.png';
  } else if (comp.includes('qualifier') || comp.includes('wcq')) {
    iconFile = 'wcq.png';
  } else if (comp.includes('champions league') || comp.includes('ucl')) {
    iconFile = 'ucl.png';
  } else if (comp.includes('club world cup') || comp.includes('cwc')) {
    iconFile = 'clubworldcup.png';
  } else if (comp.includes('copa america')) {
    if (yr === 2024) iconFile = 'copa2024.png';
    else if (yr === 2021) iconFile = 'copa2021.png';
    else if (yr === 2019) iconFile = 'copa2019.png';
    else if (yr === 2016) iconFile = 'copa2016.png';
    else if (yr === 2015) iconFile = 'copa2015.png';
    else if (yr === 2011) iconFile = 'copa2011.png';
    else if (yr === 2007) iconFile = 'copa2007.png';
    else iconFile = 'copaamerica.png';
  } else if (comp.includes('la liga') || comp.includes('primera')) {
    iconFile = 'laliga.png';
  } else if (comp.includes('copa del rey')) {
    iconFile = 'copadelrey.png';
  } else if (comp.includes('supercopa')) {
    iconFile = 'supercopadeespana.png';
  } else if (comp.includes('ligue 1')) {
    iconFile = 'ligue1.png';
  } else if (comp.includes('mls')) {
    iconFile = 'mls.png';
  } else if (comp.includes('leagues cup')) {
    iconFile = 'leaguescup.png';
  } else if (comp.includes('us open cup')) {
    iconFile = 'usopencup.png';
  } else if (comp.includes('finalissima')) {
    iconFile = 'finalissima.png';
  } else if (comp.includes('super cup')) {
    iconFile = 'uefasupercup.png';
  } else {
    iconFile = 'friendly.png';
  }

  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src={`/competitions/${iconFile}`}
        alt={competition}
        className="w-full h-full object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/competitions/laliga.png';
        }}
      />
    </span>
  );
};
