import React, { useState } from 'react';
import { Assist } from '../types/archive';
import { getGoalPhotoUrl } from '../utils/photoUtils';
import { getCrestUrl } from '../utils/crestUtils';
import { Award, Search, Calendar, Star, Eye, Heart } from 'lucide-react';

interface AssistsViewProps {
  assists: Assist[];
}

export const AssistsView: React.FC<AssistsViewProps> = ({ assists }) => {
  const [search, setSearch] = useState('');

  const filteredAssists = assists.filter((a) => {
    const s = search.toLowerCase();
    return (
      (a.opponent && a.opponent.toLowerCase().includes(s)) ||
      (a.competition && a.competition.toLowerCase().includes(s)) ||
      (a.date && a.date.toLowerCase().includes(s)) ||
      (a.info && a.info.toLowerCase().includes(s)) ||
      (a.homeTeam && a.homeTeam.toLowerCase().includes(s))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#111115] p-5 rounded-2xl border border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#F97316]/10 border border-[#F97316]/30 flex items-center justify-center">
            <Award className="w-5 h-5 text-[#F97316]" />
          </div>
          <div>
            <h2 className="font-display font-extrabold text-lg text-white">
              Every Assist ({assists.length})
            </h2>
            <p className="text-xs text-white/40">
              Explore all 332+ playmaking masterclasses from 2004 to 2026
            </p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search assists by opponent, competition..."
            className="w-full bg-[#16161b] text-xs text-white placeholder-white/25 pl-10 pr-4 py-2.5 rounded-xl border border-white/[0.08] focus:outline-none focus:border-[#F97316]"
          />
        </div>
      </div>

      {/* Grid of Assist Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
        {filteredAssists.map((assist, idx) => {
          const assistNum = parseInt(assist.matchNumber?.replace(/\D/g, '') || String(idx + 1), 10);
          const photoUrl = getGoalPhotoUrl({
            homeTeam: assist.homeTeam,
            awayTeam: assist.awayTeam,
            date: assist.date,
          });

          const ratingVal = parseFloat(assist.rating || '0');
          const ratingBand = ratingVal >= 8 ? 'high' : ratingVal >= 7 ? 'mid' : 'low';

          return (
            <article
              key={`assist-${idx}-${assist.date}`}
              className="group relative w-full max-w-[300px] mx-auto aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-black cursor-pointer outline-none transition-all duration-300 hover:-translate-y-1 border border-white/[0.07] hover:border-white/[0.18] hover:shadow-[0_24px_56px_-22px_rgba(0,0,0,0.95)] select-none flex flex-col justify-between"
            >
              {/* Photo Background */}
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={photoUrl}
                  alt={`Messi vs ${assist.opponent}`}
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

              {/* Top Bar on Card */}
              <div className="relative z-20 px-3.5 pt-3.5 flex items-center justify-between gap-2">
                <span className="min-w-0 font-display text-[8px] font-black uppercase tracking-[0.18em] text-white/75 truncate [text-shadow:0_1px_4px_rgba(0,0,0,0.95)]">
                  {assist.competition}
                </span>
                <span className="font-mono text-[9px] font-bold text-amber-400 bg-amber-500/15 px-1.5 py-0.5 rounded border border-amber-500/30">
                  {assist.messiAssists || '1'} A
                </span>
              </div>

              {/* Bottom Information Section */}
              <div className="relative z-20 px-3.5 pb-3.5 pt-3">
                <div className="flex items-start gap-3">
                  {/* Goal Number & GOAL Badge */}
                  <div className="shrink-0">
                    <p className="font-display text-[25px] font-black italic leading-[0.85] tracking-[-0.045em] text-white">
                      #{assistNum}
                    </p>
                    <p className="font-display text-[8px] font-black uppercase tracking-[0.2em] text-amber-400 mt-1.5">
                      ASSIST
                    </p>
                  </div>

                  {/* Vertical Divider */}
                  <span className="w-px self-stretch bg-white/[0.12]" />

                  {/* Opponent & Match Subtitle */}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-[13px] font-bold leading-[1.12] tracking-[-0.015em] text-white line-clamp-2">
                      vs {assist.opponent || assist.awayTeam}
                    </h3>
                    <p className="font-display text-[8px] font-bold uppercase tracking-[0.14em] text-white/35 mt-1.5 truncate">
                      {assist.date}
                    </p>
                  </div>
                </div>

                {/* Bottom Scores, Crests, Badges */}
                <div className="flex items-center justify-between gap-2 mt-2.5 pt-2.5 border-t border-white/[0.09]">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="num text-[11.5px] text-white/80 leading-none tabular-nums font-display font-black">
                      {assist.homeScore ?? '-'}:{assist.awayScore ?? '-'}
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

                  <div className="flex items-center gap-2 shrink-0 text-white/35">
                    <span className="flex items-center gap-1 text-[10.5px]">
                      <Eye className="w-[10px] h-[10px]" />
                      <span>{Math.floor(80 + (assistNum * 13) % 400)}k</span>
                    </span>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
