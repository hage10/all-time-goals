import React from 'react';
import { ViewMode } from '../types/archive';
import { Crosshair, Award, Flame, Trophy, Sparkles } from 'lucide-react';

interface HeaderProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  totalGoals: number;
  totalAssists: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  totalGoals,
  totalAssists,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#232736] bg-[#090a0f]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onViewChange('goals')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-[2px] shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-[#090a0f] rounded-[10px] flex items-center justify-center">
                <span className="font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 text-lg">
                  M10
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-white">
                  MESSI <span className="text-cyan-400">ALL GOALS</span>
                </h1>
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  ARCHIVE
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                The Definitive 2004–2026 Career Database
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => onViewChange('goals')}
              className={`flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                currentView === 'goals'
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Goals ({totalGoals})</span>
            </button>

            <button
              onClick={() => onViewChange('shotmapper')}
              className={`flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                currentView === 'shotmapper'
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Crosshair className="w-4 h-4 text-emerald-400" />
              <span>ShotMapper</span>
            </button>

            <button
              onClick={() => onViewChange('assists')}
              className={`flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                currentView === 'assists'
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Assists ({totalAssists})</span>
            </button>

            <button
              onClick={() => onViewChange('iconic')}
              className={`hidden md:flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                currentView === 'iconic'
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Flame className="w-4 h-4 text-rose-400" />
              <span>Iconic</span>
            </button>
          </nav>

          {/* Quick Info / Hotkeys Badge */}
          <div className="hidden lg:flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-[#161923] px-2.5 py-1.5 rounded-lg border border-[#232736]">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Hotkeys:</span>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-300 rounded border border-slate-700">J</kbd>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-300 rounded border border-slate-700">K</kbd>
              <span>Next/Prev</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
