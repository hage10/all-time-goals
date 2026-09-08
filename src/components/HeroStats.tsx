import React from 'react';
import { Goal } from '../types/archive';
import { getCrestUrl } from '../utils/crestUtils';

interface HeroStatsProps {
  goals: Goal[];
  totalAssists: number;
}

export const HeroStats: React.FC<HeroStatsProps> = ({ goals, totalAssists }) => {
  const totalGoals = goals.length;
  const barcaGoals = goals.filter(g => (g.homeTeam || '').toLowerCase().includes('barcelona') || (g.image || '').includes('barcelona')).length;
  const argGoals = goals.filter(g => (g.homeTeam || '').toLowerCase().includes('argentina') || (g.image || '').includes('argentina')).length;
  const miamiGoals = goals.filter(g => (g.homeTeam || '').toLowerCase().includes('inter') || (g.image || '').includes('inter')).length;
  const psgGoals = goals.filter(g => (g.homeTeam || '').toLowerCase().includes('psg') || (g.image || '').includes('psg')).length;

  const freeKicks = goals.filter(g => g.freekick === 'yes').length;
  const penalties = goals.filter(g => g.penalty === 'yes').length;
  const outsideBox = goals.filter(g => g.outsidebox === 'yes').length;
  const leftFoot = goals.filter(g => g.leftfoot === 'yes').length;
  const rightFoot = goals.filter(g => g.rightfoot === 'yes').length;
  const headers = goals.filter(g => g.header === 'yes').length;

  const totalXg = goals.reduce((sum, g) => sum + (g.xg || 0), 0).toFixed(1);

  return (
    <div className="w-full bg-gradient-to-b from-[#11131a] to-[#090a0f] border-b border-[#232736] pt-6 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {/* Total Goals Hero Card */}
          <div className="col-span-2 bg-gradient-to-br from-cyan-950/40 via-[#161923] to-[#11131a] p-4 sm:p-5 rounded-2xl border border-cyan-500/30 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all"></div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Total Career Goals</span>
                <div className="text-4xl sm:text-5xl font-display font-black text-white tracking-tight mt-1">
                  {totalGoals}
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">Total Assists</span>
                <div className="text-2xl sm:text-3xl font-display font-bold text-amber-300 mt-1">
                  {totalAssists}
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-cyan-500/20 flex items-center justify-between text-xs text-slate-300">
              <span>Accumulated xG: <strong className="text-cyan-300 font-mono">{totalXg}</strong></span>
              <span className="text-emerald-400 font-medium">Outperformance +{(totalGoals - parseFloat(totalXg)).toFixed(1)}</span>
            </div>
          </div>

          {/* Club Breakdown Cards */}
          <div className="bg-[#161923]/80 p-3 sm:p-4 rounded-xl border border-red-500/20 flex flex-col justify-between hover:border-red-500/40 transition-colors">
            <div className="flex items-center gap-2">
              <img src={getCrestUrl('barcelona.png')} alt="FC Barcelona" className="w-6 h-6 object-contain" />
              <span className="text-xs font-semibold text-slate-300 truncate">Barcelona</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl sm:text-3xl font-display font-black text-red-400">{barcaGoals}</div>
              <span className="text-[11px] text-slate-400">2004–2021 (778 apps)</span>
            </div>
          </div>

          <div className="bg-[#161923]/80 p-3 sm:p-4 rounded-xl border border-sky-500/20 flex flex-col justify-between hover:border-sky-500/40 transition-colors">
            <div className="flex items-center gap-2">
              <img src={getCrestUrl('argentina.png')} alt="Argentina" className="w-6 h-6 object-contain" />
              <span className="text-xs font-semibold text-slate-300 truncate">Argentina</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl sm:text-3xl font-display font-black text-sky-400">{argGoals}</div>
              <span className="text-[11px] text-slate-400">2005–2026 (World Champ)</span>
            </div>
          </div>

          <div className="bg-[#161923]/80 p-3 sm:p-4 rounded-xl border border-pink-500/20 flex flex-col justify-between hover:border-pink-500/40 transition-colors">
            <div className="flex items-center gap-2">
              <img src={getCrestUrl('inter.png')} alt="Inter Miami" className="w-6 h-6 object-contain" />
              <span className="text-xs font-semibold text-slate-300 truncate">Inter Miami</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl sm:text-3xl font-display font-black text-pink-400">{miamiGoals}</div>
              <span className="text-[11px] text-slate-400">2023–2026 (Supporters' Shield)</span>
            </div>
          </div>

          <div className="bg-[#161923]/80 p-3 sm:p-4 rounded-xl border border-indigo-500/20 flex flex-col justify-between hover:border-indigo-500/40 transition-colors">
            <div className="flex items-center gap-2">
              <img src={getCrestUrl('psg.png')} alt="PSG" className="w-6 h-6 object-contain" />
              <span className="text-xs font-semibold text-slate-300 truncate">Paris SG</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl sm:text-3xl font-display font-black text-indigo-400">{psgGoals}</div>
              <span className="text-[11px] text-slate-400">2021–2023 (2x Ligue 1)</span>
            </div>
          </div>
        </div>

        {/* Detailed Breakdown Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="bg-[#161923] border border-[#232736] px-3 py-1.5 rounded-lg flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-400"></span>
            <span className="text-slate-400">Free Kicks:</span>
            <strong className="text-white font-mono">{freeKicks}</strong>
          </div>
          <div className="bg-[#161923] border border-[#232736] px-3 py-1.5 rounded-lg flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span className="text-slate-400">Penalties:</span>
            <strong className="text-white font-mono">{penalties}</strong>
          </div>
          <div className="bg-[#161923] border border-[#232736] px-3 py-1.5 rounded-lg flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-400"></span>
            <span className="text-slate-400">Outside Box:</span>
            <strong className="text-white font-mono">{outsideBox}</strong>
          </div>
          <div className="bg-[#161923] border border-[#232736] px-3 py-1.5 rounded-lg flex items-center gap-2">
            <span className="text-slate-400">Left Foot:</span>
            <strong className="text-white font-mono">{leftFoot}</strong>
          </div>
          <div className="bg-[#161923] border border-[#232736] px-3 py-1.5 rounded-lg flex items-center gap-2">
            <span className="text-slate-400">Right Foot:</span>
            <strong className="text-white font-mono">{rightFoot}</strong>
          </div>
          <div className="bg-[#161923] border border-[#232736] px-3 py-1.5 rounded-lg flex items-center gap-2">
            <span className="text-slate-400">Headers:</span>
            <strong className="text-white font-mono">{headers}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
