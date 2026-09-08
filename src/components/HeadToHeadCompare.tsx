import React, { useState } from 'react';
import { PlayerProfile } from '../types/player';
import { PLAYERS, getComparisonData } from '../data/players';
import { getCrestUrl } from '../utils/crestUtils';
import {
  Trophy,
  Flame,
  Award,
  Zap,
  Target,
  ArrowRightLeft,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

interface HeadToHeadCompareProps {
  initialPlayer1?: string;
  initialPlayer2?: string;
}

export const HeadToHeadCompare: React.FC<HeadToHeadCompareProps> = ({
  initialPlayer1 = 'messi',
  initialPlayer2 = 'ronaldo',
}) => {
  const [p1Id, setP1Id] = useState(initialPlayer1);
  const [p2Id, setP2Id] = useState(initialPlayer2);

  const compData = getComparisonData(p1Id, p2Id);
  const { player1, player2, radarMetrics, byMinuteDistribution } = compData;

  const handleSwap = () => {
    setP1Id(p2Id);
    setP2Id(p1Id);
  };

  return (
    <div className="w-full space-y-8 animate-fade-in max-w-7xl mx-auto py-6">
      {/* Title & Selector Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-black uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          <span>All-Star Head to Head</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-display font-black uppercase tracking-tight text-white">
          THE <span className="text-primary italic">GOAT</span> DEBATE
        </h2>
        <p className="text-white/40 text-xs sm:text-sm max-w-xl mx-auto">
          Compare verified career metrics, goal distributions, clutch moments, and trophies between any two legends.
        </p>
      </div>

      {/* Versus Player Matchup Banner */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center bg-[#0b0b0f] border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Player 1 Card */}
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden ring-2 ring-primary/40 shadow-xl bg-black shrink-0">
            <img
              src={player1.avatar}
              alt={player1.name}
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="text-xl">{player1.flag}</span>
              <select
                value={p1Id}
                onChange={(e) => setP1Id(e.target.value)}
                className="bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] rounded-xl px-3 py-1 text-sm font-black text-white focus:outline-none focus:border-primary transition-colors cursor-pointer"
              >
                {PLAYERS.map((p) => (
                  <option key={p.id} value={p.id} className="bg-[#121216] text-white">
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {player1.name}
            </h3>
            <p className="text-xs text-white/40 font-medium italic truncate">
              "{player1.nickname}"
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-3 pt-1">
              <span className="text-2xl sm:text-3xl font-mono font-black text-primary">
                {player1.stats.totalGoals}
              </span>
              <span className="text-xs uppercase font-bold text-white/30">Goals</span>
              <span className="text-white/20">/</span>
              <span className="text-lg font-mono font-bold text-white/80">
                {player1.stats.totalAssists}
              </span>
              <span className="text-xs uppercase font-bold text-white/30">Assists</span>
            </div>
          </div>
        </div>

        {/* Center VS Swap Badge */}
        <div className="flex items-center justify-center py-2 md:py-0">
          <button
            onClick={handleSwap}
            className="w-12 h-12 rounded-full bg-white/[0.05] hover:bg-white/[0.12] border border-white/[0.12] flex items-center justify-center text-white/70 hover:text-white transition-all group"
            title="Swap Players"
          >
            <ArrowRightLeft className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
          </button>
        </div>

        {/* Player 2 Card */}
        <div className="flex flex-col-reverse sm:flex-row items-center gap-5 text-center sm:text-right">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center justify-center sm:justify-end gap-2">
              <select
                value={p2Id}
                onChange={(e) => setP2Id(e.target.value)}
                className="bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] rounded-xl px-3 py-1 text-sm font-black text-white focus:outline-none focus:border-amber-400 transition-colors cursor-pointer"
              >
                {PLAYERS.map((p) => (
                  <option key={p.id} value={p.id} className="bg-[#121216] text-white">
                    {p.name}
                  </option>
                ))}
              </select>
              <span className="text-xl">{player2.flag}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {player2.name}
            </h3>
            <p className="text-xs text-white/40 font-medium italic truncate">
              "{player2.nickname}"
            </p>
            <div className="flex items-center justify-center sm:justify-end gap-3 pt-1">
              <span className="text-lg font-mono font-bold text-white/80">
                {player2.stats.totalAssists}
              </span>
              <span className="text-xs uppercase font-bold text-white/30">Assists</span>
              <span className="text-white/20">/</span>
              <span className="text-2xl sm:text-3xl font-mono font-black text-amber-400">
                {player2.stats.totalGoals}
              </span>
              <span className="text-xs uppercase font-bold text-white/30">Goals</span>
            </div>
          </div>
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden ring-2 ring-amber-400/40 shadow-xl bg-black shrink-0">
            <img
              src={player2.avatar}
              alt={player2.name}
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>
      </div>

      {/* Metrics Comparison Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Core Career Attributes */}
        <div className="bg-[#0b0b0f] border border-white/[0.08] rounded-3xl p-6 sm:p-7 space-y-6">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div className="flex items-center gap-2 text-white font-display font-black text-sm uppercase tracking-wider">
              <Target className="w-4 h-4 text-primary" />
              <span>Direct Goal & Efficiency Breakdown</span>
            </div>
          </div>

          <div className="space-y-4">
            {radarMetrics.map((m) => {
              const p1Pct = Math.min(100, (m.p1Value / m.maxValue) * 100);
              const p2Pct = Math.min(100, (m.p2Value / m.maxValue) * 100);
              const isP1Higher = m.p1Value > m.p2Value;
              const isP2Higher = m.p2Value > m.p1Value;

              return (
                <div key={m.metric} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-mono font-black ${isP1Higher ? 'text-primary' : 'text-white/60'}`}>
                      {m.p1Value}
                    </span>
                    <span className="font-display font-bold uppercase tracking-wider text-white/40 text-[10px]">
                      {m.label}
                    </span>
                    <span className={`font-mono font-black ${isP2Higher ? 'text-amber-400' : 'text-white/60'}`}>
                      {m.p2Value}
                    </span>
                  </div>

                  {/* Dual Comparison Bar */}
                  <div className="grid grid-cols-2 gap-1.5 h-2.5 bg-black/60 rounded-full p-0.5 border border-white/[0.05]">
                    {/* Left (P1) Bar going right-to-left */}
                    <div className="flex justify-end overflow-hidden rounded-full">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${p1Pct}%` }}
                      />
                    </div>
                    {/* Right (P2) Bar going left-to-right */}
                    <div className="flex justify-start overflow-hidden rounded-full">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all duration-500"
                        style={{ width: `${p2Pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Major Honors & Trophies */}
        <div className="bg-[#0b0b0f] border border-white/[0.08] rounded-3xl p-6 sm:p-7 space-y-6">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div className="flex items-center gap-2 text-white font-display font-black text-sm uppercase tracking-wider">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Major Trophies & Individual Honors</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Ballon d'Or */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] font-black uppercase text-white/40 block">
                  Ballon d'Or
                </span>
                <Award className="w-5 h-5 text-amber-400" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-mono font-black text-primary">{player1.stats.ballonDor}</span>
                <span className="text-white/20 text-xs font-bold">vs</span>
                <span className="text-xl font-mono font-black text-amber-400">{player2.stats.ballonDor}</span>
              </div>
            </div>

            {/* Golden Boots */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] font-black uppercase text-white/40 block">
                  European Golden Boot
                </span>
                <Zap className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-mono font-black text-primary">{player1.stats.goldenBoots}</span>
                <span className="text-white/20 text-xs font-bold">vs</span>
                <span className="text-xl font-mono font-black text-amber-400">{player2.stats.goldenBoots}</span>
              </div>
            </div>

            {/* UEFA Champions League */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] font-black uppercase text-white/40 block">
                  Champions League
                </span>
                <Trophy className="w-5 h-5 text-sky-400" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-mono font-black text-primary">{player1.stats.championsLeagues}</span>
                <span className="text-white/20 text-xs font-bold">vs</span>
                <span className="text-xl font-mono font-black text-amber-400">{player2.stats.championsLeagues}</span>
              </div>
            </div>

            {/* FIFA World Cup */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] font-black uppercase text-white/40 block">
                  FIFA World Cup
                </span>
                <Trophy className="w-5 h-5 text-amber-500" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-mono font-black text-primary">{player1.stats.worldCups}</span>
                <span className="text-white/20 text-xs font-bold">vs</span>
                <span className="text-xl font-mono font-black text-amber-400">{player2.stats.worldCups}</span>
              </div>
            </div>
          </div>

          {/* Minutes per Goal Stat */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white/60">Minutes per Goal Rate</span>
              <span className="font-mono text-white/30 text-[10px]">LOWER IS BETTER</span>
            </div>
            <div className="flex items-center justify-between text-base font-black">
              <span className="text-primary font-mono">{player1.stats.minutesPerGoal} min/G</span>
              <span className="text-amber-400 font-mono">{player2.stats.minutesPerGoal} min/G</span>
            </div>
          </div>
        </div>
      </div>

      {/* Goals by Minute Distribution Timeline */}
      <div className="bg-[#0b0b0f] border border-white/[0.08] rounded-3xl p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <div className="flex items-center gap-2 text-white font-display font-black text-sm uppercase tracking-wider">
            <Flame className="w-4 h-4 text-rose-500" />
            <span>Clutch Distribution: Goals by Match Time</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold">
            <span className="flex items-center gap-1.5 text-primary">
              <span className="w-2.5 h-2.5 rounded-full bg-primary" />
              {player1.shortName}
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              {player2.shortName}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-2">
          {byMinuteDistribution.map((slot) => (
            <div
              key={slot.minuteInterval}
              className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-center space-y-2"
            >
              <span className="font-display font-black text-xs text-white/50 block">
                {slot.minuteInterval}
              </span>
              <div className="flex items-center justify-center gap-2">
                <span className="font-mono text-base font-black text-primary">
                  {slot.p1Goals}
                </span>
                <span className="text-white/20 text-xs">/</span>
                <span className="font-mono text-base font-black text-amber-400">
                  {slot.p2Goals}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
