import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Goal, FilterState } from '../types/archive';
import { getCrestUrl } from '../utils/crestUtils';
import { CompetitionMark } from './CompetitionMark';
import { X, Search, RotateCcw, ArrowDown, ArrowUp } from 'lucide-react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  totalResults: number;
  competitions: string[];
  seasons: string[];
  allGoals?: Goal[];
  activeTab?: string;
}

const VENUES = [
  ['H', 'Home'],
  ['A', 'Away'],
  ['N', 'Neutral'],
];

const STAGES = [
  'Final',
  'Semi-final',
  'Quarter-final',
  'Round of 16',
  'Group stage',
];

const TRAITS = [
  ['freekick', 'Free kick'],
  ['penalty', 'Penalty'],
  ['outsidebox', 'Outside box'],
  ['header', 'Header'],
  ['leftfoot', 'Left foot'],
  ['rightfoot', 'Right foot'],
];

const CLUBS = [
  { id: 'Barcelona', name: 'FC Barcelona', crest: 'barcelona.png' },
  { id: 'Argentina', name: 'Argentina', crest: 'argentina.png' },
  { id: 'Inter Miami', name: 'Inter Miami', crest: 'inter.png' },
  { id: 'PSG', name: 'Paris Saint-Germain', crest: 'psg.png' },
];

export const FilterDrawer: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  totalResults,
  competitions,
  seasons,
  allGoals = [],
  activeTab = 'goals',
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('teams');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categorySearch, setCategorySearch] = useState<string>('');
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    const t = setTimeout(() => searchInputRef.current?.focus(), 100);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(t);
    };
  }, [isOpen, onClose]);

  // Unique opponents with counts
  const opponentsList = useMemo(() => {
    const map = new Map<string, { count: number; crest?: string }>();
    allGoals.forEach((g) => {
      if (g.opponent) {
        const cur = map.get(g.opponent) || { count: 0, crest: g.oppoimage };
        map.set(g.opponent, { count: cur.count + 1, crest: g.oppoimage || cur.crest });
      }
    });
    return Array.from(map.entries())
      .map(([name, data]) => ({ name, count: data.count, crest: data.crest }))
      .sort((a, b) => b.count - a.count);
  }, [allGoals]);

  // Unique years
  const yearsList = useMemo(() => {
    const map = new Map<string, number>();
    allGoals.forEach((g) => {
      const year = g.date ? g.date.split('/')[2] : null;
      if (year) map.set(year, (map.get(year) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([year, count]) => ({ year, count }))
      .sort((a, b) => parseInt(b.year) - parseInt(a.year));
  }, [allGoals]);

  // Active filter tokens
  const activeTokens = useMemo(() => {
    const tokens: Array<{ key: string; label: string; field: string; onRemove: () => void }> = [];
    if (filters.team !== 'all') {
      tokens.push({
        key: `team:${filters.team}`,
        label: filters.team,
        field: 'team',
        onRemove: () => onFilterChange({ ...filters, team: 'all' }),
      });
    }
    if (filters.competition !== 'all') {
      tokens.push({
        key: `comp:${filters.competition}`,
        label: filters.competition,
        field: 'competition',
        onRemove: () => onFilterChange({ ...filters, competition: 'all' }),
      });
    }
    if (filters.opponent !== 'all') {
      tokens.push({
        key: `oppo:${filters.opponent}`,
        label: filters.opponent,
        field: 'opponent',
        onRemove: () => onFilterChange({ ...filters, opponent: 'all' }),
      });
    }
    if (filters.season !== 'all') {
      tokens.push({
        key: `season:${filters.season}`,
        label: filters.season,
        field: 'season',
        onRemove: () => onFilterChange({ ...filters, season: 'all' }),
      });
    }
    if (filters.shotType !== 'all') {
      const traitLabel = TRAITS.find(([k]) => k === filters.shotType)?.[1] || filters.shotType;
      tokens.push({
        key: `shot:${filters.shotType}`,
        label: traitLabel,
        field: 'shotType',
        onRemove: () => onFilterChange({ ...filters, shotType: 'all' }),
      });
    }
    if (filters.foot !== 'all') {
      tokens.push({
        key: `foot:${filters.foot}`,
        label: `${filters.foot === 'left' ? 'Left' : 'Right'} Foot`,
        field: 'foot',
        onRemove: () => onFilterChange({ ...filters, foot: 'all' }),
      });
    }
    return tokens;
  }, [filters, onFilterChange]);

  const clearAllFilters = () => {
    onFilterChange({
      search: '',
      team: 'all',
      competition: 'all',
      opponent: 'all',
      season: 'all',
      shotType: 'all',
      foot: 'all',
      sort: 'asc',
    });
  };

  if (!isOpen) return null;

  // Categories list with counts of active selections
  const categories = [
    { key: 'teams', label: 'Teams', count: filters.team !== 'all' ? 1 : 0 },
    { key: 'leagues', label: 'Competitions', count: filters.competition !== 'all' ? 1 : 0 },
    { key: 'opponents', label: 'Opponents', count: filters.opponent !== 'all' ? 1 : 0 },
    { key: 'seasons', label: 'Seasons', count: filters.season !== 'all' ? 1 : 0 },
    { key: 'years', label: 'Years', count: 0 },
    { key: 'traits', label: 'Traits', count: (filters.shotType !== 'all' ? 1 : 0) + (filters.foot !== 'all' ? 1 : 0) },
    { key: 'venues', label: 'Venues', count: 0 },
    { key: 'stages', label: 'Stages', count: 0 },
  ];

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-end sm:items-start sm:pt-[10vh] justify-center sm:p-6 bg-black/85 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full sm:max-w-[720px] h-[88vh] sm:h-[560px] sm:max-h-[80vh] flex flex-col rounded-t-[1.75rem] sm:rounded-[1.5rem] border border-white/[0.1] bg-[#0c0c0e] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.95)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient Top Line */}
        <span className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />

        {/* Modal Top Header & Active Filter Tokens */}
        <div className="shrink-0 flex items-start gap-2 px-4 pt-4 pb-3">
          <div className="flex-1 min-w-0 flex flex-wrap items-center gap-1.5">
            <span className="label shrink-0 text-white/45">
              Showing {activeTab === 'assists' ? 'assists' : 'goals'}
            </span>
            {activeTokens.length === 0 ? (
              <span className="label text-white/20">— no filters</span>
            ) : (
              activeTokens.map((tok) => (
                <button
                  key={tok.key}
                  onClick={tok.onRemove}
                  className="group/tk inline-flex items-center gap-1.5 h-6 pl-2.5 pr-1.5 rounded-full bg-primary/12 border border-primary/25 text-primary-light font-display text-[9px] font-black uppercase tracking-[0.12em] hover:bg-primary/20 transition-colors"
                >
                  <span className="truncate max-w-[130px]">{tok.label}</span>
                  <X size={9} strokeWidth={3} className="opacity-50 group-hover/tk:opacity-100" />
                </button>
              ))
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors shrink-0"
          >
            <X size={15} />
          </button>
        </div>

        {/* Global Search Bar Inside Filter Modal */}
        <div className="shrink-0 relative flex items-center px-4 pb-3">
          <Search size={15} className="absolute left-7 text-white/30" />
          <input
            ref={searchInputRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by team, opponent, year, stage…"
            className="w-full bg-black/50 border border-white/[0.1] rounded-2xl pl-10 pr-10 h-12 text-[13.5px] font-semibold text-white placeholder:text-white/25 focus:outline-none focus:border-primary/50 transition-colors"
          />
          {searchQuery.trim() && (
            <button
              onClick={() => {
                setSearchQuery('');
                searchInputRef.current?.focus();
              }}
              aria-label="Clear search"
              className="absolute right-7 text-white/30 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Body Layout: Left Category Nav + Right Content Area */}
        <div className="flex-1 min-h-0 flex flex-col sm:flex-row">
          {/* Left Tabs Nav */}
          <nav className="shrink-0 sm:w-[150px] border-b sm:border-b-0 sm:border-r border-white/[0.08] flex sm:flex-col overflow-x-auto sm:overflow-y-auto px-2 sm:px-0 sm:py-2 custom-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => {
                  setActiveCategory(cat.key);
                  setCategorySearch('');
                }}
                className={`relative shrink-0 flex items-center gap-1.5 h-10 px-3 whitespace-nowrap transition-colors text-left ${
                  activeCategory === cat.key ? 'text-white font-bold' : 'text-white/35 hover:text-white/70 font-semibold'
                }`}
              >
                <span className="label !text-[9px] !text-inherit">{cat.label}</span>
                {cat.count > 0 && (
                  <span className="num-plain !text-[9px] text-primary font-black ml-auto">
                    {cat.count}
                  </span>
                )}
                {activeCategory === cat.key && (
                  <span className="absolute bg-primary rounded-full inset-x-2 bottom-0 h-[2px] sm:inset-x-auto sm:left-0 sm:inset-y-2 sm:w-[2px] sm:h-auto" />
                )}
              </button>
            ))}
          </nav>

          {/* Right Selection List */}
          <div className="flex-1 min-h-0 flex flex-col">
            {/* Search within category if long list */}
            {(activeCategory === 'opponents' || activeCategory === 'leagues' || activeCategory === 'seasons') && (
              <div className="shrink-0 px-3 pt-2.5 pb-1">
                <input
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  placeholder={`Search all ${activeCategory}…`}
                  className="w-full bg-transparent border-b border-white/[0.08] h-8 text-[12px] font-semibold text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            )}

            <div ref={listContainerRef} className="flex-1 min-h-0 overflow-y-auto px-3 pb-3 custom-scrollbar">
              {/* TEAMS */}
              {activeCategory === 'teams' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 pt-2">
                  <button
                    onClick={() => onFilterChange({ ...filters, team: 'all' })}
                    data-on={filters.team === 'all'}
                    className="group relative flex items-center gap-2.5 h-11 pl-3 pr-2 text-left border-b border-white/[0.05] transition-colors hover:bg-white/[0.025]"
                  >
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 rounded-full bg-primary transition-opacity opacity-0 group-data-[on=true]:opacity-100" />
                    <span className="w-5 shrink-0" />
                    <span className={`min-w-0 flex-1 truncate text-[12.5px] font-semibold ${filters.team === 'all' ? 'text-white' : 'text-white/55'}`}>
                      All Teams
                    </span>
                    <span className={`num !text-[11px] not-italic shrink-0 ${filters.team === 'all' ? 'text-primary-light' : 'text-white/25'}`}>
                      {allGoals.length}
                    </span>
                  </button>
                  {CLUBS.map((club) => {
                    const isOn = filters.team === club.id;
                    const clubCount = allGoals.filter((g) =>
                      (g.homeTeam || '').toLowerCase().includes(club.id.toLowerCase()) ||
                      (g.image || '').toLowerCase().includes(club.crest.split('.')[0])
                    ).length;

                    return (
                      <button
                        key={club.id}
                        onClick={() => onFilterChange({ ...filters, team: isOn ? 'all' : club.id })}
                        data-on={isOn}
                        className="group relative flex items-center gap-2.5 h-11 pl-3 pr-2 text-left border-b border-white/[0.05] transition-colors hover:bg-white/[0.025]"
                      >
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 rounded-full bg-primary transition-opacity opacity-0 group-data-[on=true]:opacity-100" />
                        <img src={getCrestUrl(club.crest)} alt="" className="w-5 h-5 object-contain shrink-0" />
                        <span className={`min-w-0 flex-1 truncate text-[12.5px] font-semibold ${isOn ? 'text-white' : 'text-white/55'}`}>
                          {club.name}
                        </span>
                        <span className={`num !text-[11px] not-italic shrink-0 ${isOn ? 'text-primary-light' : 'text-white/25'}`}>
                          {clubCount}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* COMPETITIONS */}
              {activeCategory === 'leagues' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 pt-2">
                  <button
                    onClick={() => onFilterChange({ ...filters, competition: 'all' })}
                    data-on={filters.competition === 'all'}
                    className="group relative flex items-center gap-2.5 h-11 pl-3 pr-2 text-left border-b border-white/[0.05] transition-colors hover:bg-white/[0.025]"
                  >
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 rounded-full bg-primary transition-opacity opacity-0 group-data-[on=true]:opacity-100" />
                    <span className={`min-w-0 flex-1 truncate text-[12.5px] font-semibold ${filters.competition === 'all' ? 'text-white' : 'text-white/55'}`}>
                      All Competitions
                    </span>
                  </button>
                  {competitions
                    .filter((c) => !categorySearch.trim() || c.toLowerCase().includes(categorySearch.toLowerCase()))
                    .map((comp) => {
                      const isOn = filters.competition === comp;
                      const count = allGoals.filter((g) => g.competition === comp).length;
                      return (
                        <button
                          key={comp}
                          onClick={() => onFilterChange({ ...filters, competition: isOn ? 'all' : comp })}
                          data-on={isOn}
                          className="group relative flex items-center gap-2.5 h-11 pl-3 pr-2 text-left border-b border-white/[0.05] transition-colors hover:bg-white/[0.025]"
                        >
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 rounded-full bg-primary transition-opacity opacity-0 group-data-[on=true]:opacity-100" />
                          <CompetitionMark competition={comp} size={16} className="shrink-0" />
                          <span className={`min-w-0 flex-1 truncate text-[12.5px] font-semibold ${isOn ? 'text-white' : 'text-white/55'}`}>
                            {comp}
                          </span>
                          <span className={`num !text-[11px] not-italic shrink-0 ${isOn ? 'text-primary-light' : 'text-white/25'}`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                </div>
              )}

              {/* OPPONENTS */}
              {activeCategory === 'opponents' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 pt-2">
                  {opponentsList
                    .filter((o) => !categorySearch.trim() || o.name.toLowerCase().includes(categorySearch.toLowerCase()))
                    .map((oppo) => {
                      const isOn = filters.opponent === oppo.name;
                      return (
                        <button
                          key={oppo.name}
                          onClick={() => onFilterChange({ ...filters, opponent: isOn ? 'all' : oppo.name })}
                          data-on={isOn}
                          className="group relative flex items-center gap-2.5 h-11 pl-3 pr-2 text-left border-b border-white/[0.05] transition-colors hover:bg-white/[0.025]"
                        >
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 rounded-full bg-primary transition-opacity opacity-0 group-data-[on=true]:opacity-100" />
                          {oppo.crest ? (
                            <img src={getCrestUrl(oppo.crest)} alt="" className="w-5 h-5 object-contain shrink-0 opacity-80" />
                          ) : (
                            <span className="w-5 shrink-0" />
                          )}
                          <span className={`min-w-0 flex-1 truncate text-[12.5px] font-semibold ${isOn ? 'text-white' : 'text-white/55'}`}>
                            {oppo.name}
                          </span>
                          <span className={`num !text-[11px] not-italic shrink-0 ${isOn ? 'text-primary-light' : 'text-white/25'}`}>
                            {oppo.count}
                          </span>
                        </button>
                      );
                    })}
                </div>
              )}

              {/* SEASONS */}
              {activeCategory === 'seasons' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 pt-2">
                  {seasons
                    .filter((s) => !categorySearch.trim() || s.toLowerCase().includes(categorySearch.toLowerCase()))
                    .map((s) => {
                      const isOn = filters.season === s;
                      const count = allGoals.filter((g) => g.season === s).length;
                      return (
                        <button
                          key={s}
                          onClick={() => onFilterChange({ ...filters, season: isOn ? 'all' : s })}
                          data-on={isOn}
                          className="group relative flex items-center gap-2.5 h-11 pl-3 pr-2 text-left border-b border-white/[0.05] transition-colors hover:bg-white/[0.025]"
                        >
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 rounded-full bg-primary transition-opacity opacity-0 group-data-[on=true]:opacity-100" />
                          <span className={`min-w-0 flex-1 truncate text-[12.5px] font-semibold ${isOn ? 'text-white' : 'text-white/55'}`}>
                            {s}
                          </span>
                          <span className={`num !text-[11px] not-italic shrink-0 ${isOn ? 'text-primary-light' : 'text-white/25'}`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                </div>
              )}

              {/* YEARS */}
              {activeCategory === 'years' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 pt-2">
                  {yearsList.map((y) => (
                    <button
                      key={y.year}
                      onClick={() => onFilterChange({ ...filters, search: y.year })}
                      className="group relative flex items-center gap-2.5 h-11 pl-3 pr-2 text-left border-b border-white/[0.05] transition-colors hover:bg-white/[0.025]"
                    >
                      <span className="min-w-0 flex-1 truncate text-[12.5px] font-semibold text-white/70 group-hover:text-white">
                        {y.year}
                      </span>
                      <span className="num !text-[11px] not-italic shrink-0 text-white/25">
                        {y.count}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* TRAITS */}
              {activeCategory === 'traits' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 pt-2">
                  {TRAITS.map(([id, label]) => {
                    const isOn =
                      filters.shotType === id ||
                      (id === 'leftfoot' && filters.foot === 'left') ||
                      (id === 'rightfoot' && filters.foot === 'right');

                    return (
                      <button
                        key={id}
                        onClick={() => {
                          if (id === 'leftfoot') {
                            onFilterChange({ ...filters, foot: filters.foot === 'left' ? 'all' : 'left' });
                          } else if (id === 'rightfoot') {
                            onFilterChange({ ...filters, foot: filters.foot === 'right' ? 'all' : 'right' });
                          } else {
                            onFilterChange({
                              ...filters,
                              shotType: filters.shotType === id ? 'all' : id,
                            });
                          }
                        }}
                        data-on={isOn}
                        className="group relative flex items-center gap-2.5 h-11 pl-3 pr-2 text-left border-b border-white/[0.05] transition-colors hover:bg-white/[0.025]"
                      >
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 rounded-full bg-primary transition-opacity opacity-0 group-data-[on=true]:opacity-100" />
                        <span className={`min-w-0 flex-1 truncate text-[12.5px] font-semibold ${isOn ? 'text-white' : 'text-white/55'}`}>
                          {label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* VENUES */}
              {activeCategory === 'venues' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 pt-2">
                  {VENUES.map(([code, label]) => (
                    <button
                      key={code}
                      onClick={() => onFilterChange({ ...filters, search: `(${code})` })}
                      className="group relative flex items-center gap-2.5 h-11 pl-3 pr-2 text-left border-b border-white/[0.05] transition-colors hover:bg-white/[0.025]"
                    >
                      <span className="min-w-0 flex-1 truncate text-[12.5px] font-semibold text-white/70 group-hover:text-white">
                        {label} ({code})
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* STAGES */}
              {activeCategory === 'stages' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 pt-2">
                  {STAGES.map((stg) => (
                    <button
                      key={stg}
                      onClick={() => onFilterChange({ ...filters, search: stg })}
                      className="group relative flex items-center gap-2.5 h-11 pl-3 pr-2 text-left border-b border-white/[0.05] transition-colors hover:bg-white/[0.025]"
                    >
                      <span className="min-w-0 flex-1 truncate text-[12.5px] font-semibold text-white/70 group-hover:text-white">
                        {stg}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer with Live Count, Reset & Apply */}
        <footer className="shrink-0 flex items-center gap-3 px-4 py-3 border-t border-white/[0.08] bg-black/50">
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="num text-[20px] text-white leading-none font-display font-black">
              {totalResults.toLocaleString()}
            </span>
            <span className="label truncate text-white/40">
              {activeTab === 'assists' ? 'assists' : 'goals'}
            </span>
          </div>

          <span className="flex-1" />

          {activeTokens.length > 0 && (
            <button
              onClick={clearAllFilters}
              className="btn !h-8 !px-3 font-display text-[9px] font-black uppercase tracking-[0.14em] text-white/45 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw size={11} />
              <span>Reset</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-light text-white font-display text-[10px] font-black uppercase tracking-[0.16em] transition-colors shadow-[0_0_20px_-4px_var(--color-primary)]"
          >
            Apply
          </button>
        </footer>
      </div>
    </div>
  );
};
