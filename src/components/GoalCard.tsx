import React from 'react';
import { Goal } from '../types/archive';
import { getGoalPhotoUrl } from '../utils/photoUtils';
import { getCrestUrl } from '../utils/crestUtils';
import { CompetitionMark } from './CompetitionMark';
import { Play, Eye, Heart } from 'lucide-react';

interface GoalCardProps {
  goal: Goal;
  onClick: () => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, onClick }) => {
  const photoUrl = getGoalPhotoUrl(goal);
  const homeScore = parseInt(goal.homeScore || '0', 10);
  const awayScore = parseInt(goal.awayScore || '0', 10);

  // Determine outcome
  let outcome: 'W' | 'D' | 'L' = 'W';
  if (homeScore > awayScore) {
    outcome = (goal.homeTeam || '').toLowerCase().includes('barcelona') ||
              (goal.homeTeam || '').toLowerCase().includes('argentina') ||
              (goal.homeTeam || '').toLowerCase().includes('inter') ||
              (goal.homeTeam || '').toLowerCase().includes('psg')
      ? 'W'
      : 'L';
  } else if (homeScore < awayScore) {
    outcome = (goal.homeTeam || '').toLowerCase().includes('barcelona') ||
              (goal.homeTeam || '').toLowerCase().includes('argentina') ||
              (goal.homeTeam || '').toLowerCase().includes('inter') ||
              (goal.homeTeam || '').toLowerCase().includes('psg')
      ? 'L'
      : 'W';
  } else {
    outcome = 'D';
  }

  // Determine shot type label
  let shotTag = '';
  if (goal.freekick === 'yes') shotTag = 'Free kick';
  else if (goal.penalty === 'yes') shotTag = 'Penalty';
  else if (goal.outsidebox === 'yes') shotTag = 'Outside box';
  else if (goal.header === 'yes') shotTag = 'Header';
  else if (goal.rightfoot === 'yes') shotTag = 'Right foot';
  else if (goal.leftfoot === 'yes') shotTag = 'Left foot';

  const ratingVal = parseFloat(goal.rating || '0');
  const ratingBand = ratingVal >= 8 ? 'high' : ratingVal >= 7 ? 'mid' : 'low';

  const goalNum = parseInt(goal.title.replace(/\D/g, ''), 10) || 1;
  const pct = Math.min(100, (goalNum / 927) * 100);

  const year = goal.date ? goal.date.split('/')[2] : '2022';

  return (
    <article
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className="group relative w-full max-w-[300px] mx-auto aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-black cursor-pointer outline-none transition-all duration-300 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-[#F97316]/60 border border-white/[0.07] hover:border-white/[0.18] hover:shadow-[0_24px_56px_-22px_rgba(0,0,0,0.95)] select-none"
    >
      {/* Photo Background */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={photoUrl}
          alt={`Messi vs ${goal.opponent}`}
          loading="lazy"
          className="w-full h-full object-cover object-top transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://cdn.jsdelivr.net/gh/oonurm30/fotolar/2011-2012-new.png';
          }}
        />
      </div>

      {/* Dark Multi-stop Gradient Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.05) 26%, rgba(0,0,0,0.5) 55%, rgba(0,0,0,0.96) 84%)',
        }}
      />

      {/* Top Bar on Card with Competition Mark */}
      <div className="absolute top-0 inset-x-0 z-20 px-3.5 pt-3.5 flex items-center gap-2">
        <CompetitionMark
          competition={goal.competition}
          year={year}
          size={20}
          className="drop-shadow-[0_2px_5px_rgba(0,0,0,0.85)]"
        />
        <span className="min-w-0 shrink font-display text-[8px] font-black uppercase tracking-[0.18em] text-white/75 truncate [text-shadow:0_1px_4px_rgba(0,0,0,0.95)]">
          {goal.competition} {goal.minute ? `· ${goal.minute}'` : ''}
        </span>
        <span
          className="flex-1 h-px min-w-[10px] opacity-70"
          style={{ background: 'linear-gradient(90deg, #F97316, transparent)' }}
        />
        {goal.xg !== undefined && (
          <span className="shrink-0 font-display text-[7.5px] font-black uppercase tracking-[0.2em] text-[#FB923C] [text-shadow:0_1px_4px_rgba(0,0,0,0.95)]">
            xG {goal.xg.toFixed(2)}
          </span>
        )}
      </div>

      {/* Center Hover Play Button */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <span className="w-11 h-11 rounded-full bg-black/50 ring-1 ring-white/25 backdrop-blur-md flex items-center justify-center opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
          <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
        </span>
      </div>

      {/* Bottom Information Section */}
      <div className="absolute inset-x-0 bottom-0 z-20 px-3.5 pb-3.5 pt-3">
        <div className="flex items-start gap-3">
          {/* Goal Number & GOAL Badge */}
          <div className="shrink-0">
            <p className="font-display text-[27px] font-black italic leading-[0.85] tracking-[-0.045em] text-white">
              {goal.title}
            </p>
            <p className="font-display text-[8px] font-black uppercase tracking-[0.2em] text-[#F97316] mt-1.5">
              GOAL
            </p>
          </div>

          {/* Vertical Divider */}
          <span className="w-px self-stretch bg-white/[0.12]" />

          {/* Opponent & Match Subtitle */}
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-[14px] font-bold leading-[1.12] tracking-[-0.015em] text-white line-clamp-2">
              vs {goal.opponent || goal.awayTeam}
            </h3>
            <p className="font-display text-[8px] font-bold uppercase tracking-[0.14em] text-white/35 mt-1.5 truncate">
              {goal.date}
              {shotTag && <span className="text-[#F97316]/80"> · {shotTag}</span>}
            </p>
          </div>
        </div>

        {/* Bottom Scores, Crests, Badges */}
        <div className="flex items-center justify-between gap-2 mt-2.5 pt-2.5 border-t border-white/[0.09]">
          <div className="flex items-center gap-1.5 min-w-0">
            {/* Home Crest */}
            <span className="w-[15px] h-[15px] shrink-0 flex items-center justify-center">
              <img
                src={getCrestUrl(goal.image)}
                alt=""
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </span>

            {/* Score */}
            <span className="num text-[11.5px] text-white/80 leading-none tabular-nums font-display font-black">
              {goal.homeScore ?? '-'}:{goal.awayScore ?? '-'}
            </span>

            {/* Away / Opponent Crest */}
            <span className="w-[15px] h-[15px] shrink-0 flex items-center justify-center">
              <img
                src={getCrestUrl(goal.oppoimage)}
                alt=""
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </span>

            {/* Outcome Badge */}
            <span
              className={`result !w-[17px] !h-4 !text-[9px] !rounded ml-0.5 result-${outcome}`}
            >
              {outcome}
            </span>

            {/* Rating Badge */}
            {ratingVal > 0 && (
              <span
                className={`rating !min-w-[25px] !h-4 !text-[9px] !rounded rating-${ratingBand}`}
              >
                {ratingVal.toFixed(1)}
              </span>
            )}
          </div>

          {/* Social Stats: Views & Likes */}
          <div className="flex items-center gap-2 shrink-0 text-white/35">
            <span className="flex items-center gap-1 text-[10.5px]">
              <Eye className="w-[10px] h-[10px]" />
              <span>{Math.floor(100 + (goalNum * 17) % 890)}k</span>
            </span>
            <span className="flex items-center gap-1 text-[10.5px] text-white/40">
              <Heart className="w-[10px] h-[10px]" />
              <span>{Math.floor(10 + (goalNum * 3) % 95)}k</span>
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Career Total Milestone Progress Line */}
      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/[0.07] z-30">
        <span
          className="block h-full bg-[#F97316]/70 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </span>
    </article>
  );
};
