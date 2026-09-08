import React from 'react';
import { FilterState } from '../types/archive';
import { Search, X, RotateCcw, SlidersHorizontal } from 'lucide-react';

interface SearchAndFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  totalFiltered: number;
  totalAll: number;
  competitions: string[];
  seasons: string[];
}

export const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  filters,
  onFilterChange,
  totalFiltered,
  totalAll,
  competitions,
  seasons,
}) => {
  const handleReset = () => {
    onFilterChange({
      search: '',
      team: 'all',
      competition: 'all',
      opponent: 'all',
      season: 'all',
      shotType: 'all',
      foot: 'all',
      sort: 'desc',
    });
  };

  const hasActiveFilters =
    filters.search !== '' ||
    filters.team !== 'all' ||
    filters.competition !== 'all' ||
    filters.season !== 'all' ||
    filters.shotType !== 'all' ||
    filters.foot !== 'all' ||
    filters.sort !== 'desc';

  return (
    <div className="w-full bg-[#11131a] border-b border-[#232736] p-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Top Row: Search Input + Quick Shot Type Pills */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
              placeholder="Search goals by opponent, competition, stadium, assist, goalkeeper (e.g. Real Madrid, Casillas, 2011)..."
              className="w-full bg-[#161923] text-sm text-slate-100 placeholder-slate-500 pl-10 pr-10 py-2.5 rounded-xl border border-[#232736] focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all"
            />
            {filters.search && (
              <button
                onClick={() => onFilterChange({ ...filters, search: '' })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Shot Types Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'All Shots' },
              { id: 'freekick', label: 'Free Kick (74)' },
              { id: 'penalty', label: 'Penalty (114)' },
              { id: 'outsidebox', label: 'Outside Box (109)' },
              { id: 'header', label: 'Header (26)' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => onFilterChange({ ...filters, shotType: st.id })}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  filters.shotType === st.id
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : 'bg-[#161923] text-slate-400 hover:text-slate-200 border border-[#232736]'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Row: Detailed Dropdown Selectors */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 text-xs">
          {/* Team Dropdown */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium text-slate-400">Team / Club</label>
            <select
              value={filters.team}
              onChange={(e) => onFilterChange({ ...filters, team: e.target.value })}
              className="bg-[#161923] text-slate-200 py-2 px-2.5 rounded-lg border border-[#232736] focus:outline-none focus:border-cyan-500/50"
            >
              <option value="all">All Teams</option>
              <option value="Barcelona">FC Barcelona</option>
              <option value="Argentina">Argentina</option>
              <option value="Inter Miami">Inter Miami</option>
              <option value="PSG">Paris Saint-Germain</option>
            </select>
          </div>

          {/* Competition Dropdown */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium text-slate-400">Competition</label>
            <select
              value={filters.competition}
              onChange={(e) => onFilterChange({ ...filters, competition: e.target.value })}
              className="bg-[#161923] text-slate-200 py-2 px-2.5 rounded-lg border border-[#232736] focus:outline-none focus:border-cyan-500/50"
            >
              <option value="all">All Competitions</option>
              {competitions.map((comp) => (
                <option key={comp} value={comp}>
                  {comp}
                </option>
              ))}
            </select>
          </div>

          {/* Season Dropdown */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium text-slate-400">Season</label>
            <select
              value={filters.season}
              onChange={(e) => onFilterChange({ ...filters, season: e.target.value })}
              className="bg-[#161923] text-slate-200 py-2 px-2.5 rounded-lg border border-[#232736] focus:outline-none focus:border-cyan-500/50"
            >
              <option value="all">All Seasons</option>
              {seasons.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Foot Preference */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium text-slate-400">Body Part</label>
            <select
              value={filters.foot}
              onChange={(e) => onFilterChange({ ...filters, foot: e.target.value })}
              className="bg-[#161923] text-slate-200 py-2 px-2.5 rounded-lg border border-[#232736] focus:outline-none focus:border-cyan-500/50"
            >
              <option value="all">All</option>
              <option value="left">Left Foot</option>
              <option value="right">Right Foot</option>
              <option value="head">Header</option>
            </select>
          </div>

          {/* Sort Option */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium text-slate-400">Sort By</label>
            <select
              value={filters.sort}
              onChange={(e) => onFilterChange({ ...filters, sort: e.target.value as any })}
              className="bg-[#161923] text-slate-200 py-2 px-2.5 rounded-lg border border-[#232736] focus:outline-none focus:border-cyan-500/50"
            >
              <option value="desc">Goal #927 → #1 (Latest)</option>
              <option value="asc">Goal #1 → #927 (Oldest)</option>
              <option value="xg_high">Highest xG</option>
              <option value="minute_late">Latest Minute</option>
            </select>
          </div>

          {/* Filter Status & Reset */}
          <div className="flex items-end justify-between gap-2">
            {hasActiveFilters && (
              <button
                onClick={handleReset}
                className="w-full py-2 px-2.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center gap-1.5 transition-colors font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
            <div className="text-[11px] text-slate-400 py-2 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
              <span>
                <strong>{totalFiltered}</strong> / {totalAll}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
