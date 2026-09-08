import React, { useState, useMemo, useEffect, useCallback } from 'react';
import rawGoalkeepers from './data/goalkeepers.json';
import { Goal, Assist, FilterState, ViewMode } from './types/archive';
import { PlayerProfile } from './types/player';
import { PLAYERS, getPlayerGoals, getPlayerAssists, getPlayer } from './data/players';
import { Navbar } from './components/Navbar';
import { FilterDrawer } from './components/FilterDrawer';
import { GoalGrid } from './components/GoalGrid';
import { ShotMapper } from './components/ShotMapper';
import { AssistsView } from './components/AssistsView';
import { IconicView } from './components/IconicView';
import { HeadToHeadCompare } from './components/HeadToHeadCompare';
import { GoalDetailModal } from './components/GoalDetailModal';
import { SEOHead } from './components/SEOHead';
import { Footer } from './components/Footer';
import { filterGoals } from './utils/filterUtils';
import {
  SlidersHorizontal,
  Search,
  X,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CornerDownLeft,
  Coffee,
  Check,
} from 'lucide-react';

const THEME_CONFIGS: Record<
  string,
  { primary: string; rgb: string; light: string; dark: string }
> = {
  barcelona: {
    primary: '#A50044',
    rgb: '165, 0, 68',
    light: '#C00055',
    dark: '#8A0038',
  },
  argentina: {
    primary: '#74ACDF',
    rgb: '116, 172, 223',
    light: '#8EC5EB',
    dark: '#5A94CF',
  },
  miami: {
    primary: '#f4127a',
    rgb: '244, 18, 122',
    light: '#f74d9b',
    dark: '#c40e62',
  },
  psg: {
    primary: '#DA291C',
    rgb: '218, 41, 28',
    light: '#E5453A',
    dark: '#B52117',
  },
  default: {
    primary: '#F97316',
    rgb: '249, 115, 22',
    light: '#FB923C',
    dark: '#EA580C',
  },
};

const SORT_OPTIONS = [
  { key: 'date-asc', label: 'Oldest first' },
  { key: 'date-desc', label: 'Latest first' },
  { key: 'views', label: 'Most viewed' },
  { key: 'likes', label: 'Most liked' },
  { key: 'xg', label: 'Least likely' },
  { key: 'rated', label: 'Highest rated' },
];

export const App: React.FC = () => {
  // 0. Active Superstar Player State
  const [activePlayer, setActivePlayer] = useState<PlayerProfile>(() => {
    const saved = localStorage.getItem('active_player_id');
    return saved ? getPlayer(saved) : PLAYERS[0];
  });

  // 1. Dynamic Goals & Assists for Selected Player
  const allGoals: Goal[] = useMemo(() => {
    const gkMap = rawGoalkeepers as Record<string, string>;
    const baseGoals = getPlayerGoals(activePlayer.id);
    return baseGoals.map((g) => ({
      ...g,
      goalkeeper: gkMap[g.title] || g.goalkeeper || undefined,
    }));
  }, [activePlayer.id]);

  const allAssists: Assist[] = useMemo(() => {
    return getPlayerAssists(activePlayer.id) as unknown as Assist[];
  }, [activePlayer.id]);

  // 2. State & Settings
  const [currentView, setCurrentView] = useState<ViewMode>('goals');
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<string>(() => localStorage.getItem('theme_override') || 'default');

  // Filters and pagination
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    team: 'all',
    competition: 'all',
    opponent: 'all',
    season: 'all',
    shotType: 'all',
    foot: 'all',
    sort: 'asc',
  });

  const [sortKey, setSortKey] = useState<string>('date-asc');
  const [isSortMenuOpen, setIsSortMenuOpen] = useState<boolean>(false);
  const [jumpInput, setJumpInput] = useState<string>('');
  const [jumpSpan, setJumpSpan] = useState<{ from: number; to: number } | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 24;

  // Apply CSS root variables for active theme
  useEffect(() => {
    let cfg = THEME_CONFIGS[theme];
    if (!cfg || theme === 'default') {
      cfg = {
        primary: activePlayer.theme.primary,
        rgb: activePlayer.theme.primaryRgb,
        light: activePlayer.theme.primaryLight,
        dark: activePlayer.theme.primaryDark,
      };
    }
    const root = document.documentElement;
    root.style.setProperty('--color-primary', cfg.primary);
    root.style.setProperty('--color-primary-rgb', cfg.rgb);
    root.style.setProperty('--color-primary-light', cfg.light);
    root.style.setProperty('--color-primary-dark', cfg.dark);
    root.style.setProperty('--color-accent-glow', `rgba(${cfg.rgb}, 0.4)`);

    if (theme !== 'default') {
      localStorage.setItem('theme_override', theme);
    } else {
      localStorage.removeItem('theme_override');
    }
  }, [theme, activePlayer]);

  // Synchronize initial URL on mount and browser popstate
  const syncFromUrl = useCallback(() => {
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);

    const goalMatch = path.match(/^\/goal\/(\d+)$/);
    if (goalMatch) {
      const gId = goalMatch[1];
      const found = allGoals.find((g) => g.title === gId);
      if (found) {
        setSelectedGoal(found);
        return;
      }
    }

    const assistMatch = path.match(/^\/assist\/(\d+)$/);
    if (assistMatch) {
      const aId = assistMatch[1];
      const found = allGoals.find((g) => g.title === aId) || allGoals[0];
      if (found) {
        setSelectedGoal({ ...found, type: 'assist' });
        return;
      }
    }

    if (path === '/shotmapper') {
      setCurrentView('shotmapper');
      setSelectedGoal(null);
      return;
    }

    const tab = params.get('tab');
    if (path === '/assists' || tab === 'assists') {
      setCurrentView('assists');
      setSelectedGoal(null);
      return;
    }

    if (path === '/iconic' || tab === 'famous-goals') {
      setCurrentView('iconic');
      setSelectedGoal(null);
      return;
    }

    setCurrentView('goals');
    setSelectedGoal(null);
  }, [allGoals]);

  useEffect(() => {
    syncFromUrl();
    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, [syncFromUrl]);

  // Handle View Navigation & URL update
  const handleViewChange = (view: ViewMode) => {
    setCurrentView(view);
    setSelectedGoal(null);
    setCurrentPage(1);

    let newPath = '/';
    if (view === 'shotmapper') newPath = '/shotmapper';
    else if (view === 'assists') newPath = '/?tab=assists';
    else if (view === 'iconic') newPath = '/?tab=famous-goals';

    window.history.pushState({}, '', newPath);
  };

  // Handle Goal Select & URL update
  const handleSelectGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    const prefix = goal.type === 'assist' ? '/assist/' : '/goal/';
    window.history.pushState({}, '', `${prefix}${goal.title}`);
  };

  // Handle Modal Close & URL restore
  const handleCloseModal = () => {
    setSelectedGoal(null);
    let backPath = '/';
    if (currentView === 'shotmapper') backPath = '/shotmapper';
    else if (currentView === 'assists') backPath = '/?tab=assists';
    else if (currentView === 'iconic') backPath = '/?tab=famous-goals';
    window.history.pushState({}, '', backPath);
  };

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.team !== 'all') count++;
    if (filters.competition !== 'all') count++;
    if (filters.season !== 'all') count++;
    if (filters.shotType !== 'all') count++;
    if (filters.foot !== 'all') count++;
    if (filters.sort !== 'asc') count++;
    return count;
  }, [filters]);

  // Filtered Goals
  const filteredGoals = useMemo(() => {
    let result = filterGoals(allGoals, filters);

    // Apply jump-to-span filter e.g. #500-520
    if (jumpSpan) {
      result = result.filter((g) => {
        const num = parseInt(g.title, 10);
        return num >= jumpSpan.from && num <= jumpSpan.to;
      });
    }

    // Apply sorting
    if (sortKey === 'date-desc') {
      result = [...result].reverse();
    } else if (sortKey === 'views') {
      result = [...result].sort((a, b) => (parseInt(b.title, 10) % 500) - (parseInt(a.title, 10) % 500));
    } else if (sortKey === 'likes') {
      result = [...result].sort((a, b) => (parseInt(b.title, 10) % 200) - (parseInt(a.title, 10) % 200));
    } else if (sortKey === 'xg') {
      result = [...result].sort((a, b) => (a.xg ?? 0.5) - (b.xg ?? 0.5));
    }

    return result;
  }, [allGoals, filters, jumpSpan, sortKey]);

  // Unique competitions and seasons
  const competitions = useMemo(() => {
    const set = new Set<string>();
    allGoals.forEach((g) => { if (g.competition) set.add(g.competition); });
    return Array.from(set).sort();
  }, [allGoals]);

  const seasons = useMemo(() => {
    const set = new Set<string>();
    allGoals.forEach((g) => { if (g.season) set.add(g.season); });
    return Array.from(set).sort().reverse();
  }, [allGoals]);

  // Paginated Goals for Grid
  const totalPages = Math.ceil(filteredGoals.length / pageSize) || 1;
  const paginatedGoals = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredGoals.slice(start, start + pageSize);
  }, [filteredGoals, currentPage, pageSize]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Jump to specific goal ID or span
  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = jumpInput.trim();
    if (!raw) {
      setJumpSpan(null);
      return;
    }

    const spanMatch = raw.match(/^(\d+)\s*[-–—]\s*(\d+)$/);
    if (spanMatch) {
      const from = Math.min(Number(spanMatch[1]), Number(spanMatch[2]));
      const to = Math.max(Number(spanMatch[1]), Number(spanMatch[2]));
      setJumpSpan({ from, to });
      setCurrentPage(1);
      return;
    }

    const singleMatch = raw.match(/^#?(\d+)$/);
    if (singleMatch) {
      const gId = singleMatch[1];
      const target = allGoals.find((g) => g.title === gId);
      if (target) {
        handleSelectGoal(target);
      }
    }
  };

  // Modal Navigation (Next / Prev)
  const currentGoalIndex = useMemo(() => {
    if (!selectedGoal) return -1;
    return filteredGoals.findIndex((g) => g.title === selectedGoal.title);
  }, [selectedGoal, filteredGoals]);

  const handleNextGoal = () => {
    if (currentGoalIndex >= 0 && currentGoalIndex < filteredGoals.length - 1) {
      const nextG = filteredGoals[currentGoalIndex + 1];
      handleSelectGoal(nextG);
    }
  };

  const handlePrevGoal = () => {
    if (currentGoalIndex > 0) {
      const prevG = filteredGoals[currentGoalIndex - 1];
      handleSelectGoal(prevG);
    }
  };

  // Dynamic SEO Title & Description
  const seoInfo = useMemo(() => {
    if (selectedGoal) {
      const isA = selectedGoal.type === 'assist';
      const label = isA ? 'Assist' : 'Goal';
      const opp = selectedGoal.opponent || selectedGoal.awayTeam || 'Opponent';
      return {
        title: `${label} #${selectedGoal.title} vs ${opp}`,
        description: `Watch ${activePlayer.name}'s ${label.toLowerCase()} #${selectedGoal.title} against ${opp} in ${selectedGoal.competition} (${selectedGoal.date}).`,
        goalData: {
          title: selectedGoal.title,
          opponent: opp,
          competition: selectedGoal.competition,
          date: selectedGoal.date,
          videoUrl: selectedGoal.videoUrl || `https://cdn.messiallgoals.com/${isA ? 'Assist' : 'Goal'}${selectedGoal.title}.mp4`,
        },
      };
    }

    if (currentView === 'compare') {
      return {
        title: 'GOAT Debate · Head to Head Comparison',
        description: `Compare all-time stats, trophies, clutch goals, and metrics between ${activePlayer.name} and football legends.`,
      };
    }

    if (currentView === 'shotmapper') {
      return {
        title: `${activePlayer.shortName} Shot Map`,
        description: `Every ${activePlayer.name} goal on one pitch, with the position it was scored from. Filter by competition, season, opponent, or shot type.`,
      };
    }

    if (currentView === 'assists') {
      return {
        title: `${activePlayer.shortName} Assists`,
        description: `Complete collection of ${activePlayer.name} career assists across all clubs and international matches.`,
      };
    }

    if (currentView === 'iconic') {
      return {
        title: `${activePlayer.shortName} Iconic Goals`,
        description: `The defining moments, historical milestones, and greatest goals in ${activePlayer.name}'s career.`,
      };
    }

    return {
      title: `${activePlayer.shortName} All Goals`,
      description: `Explore every one of ${activePlayer.name}'s ${activePlayer.stats.totalGoals} career goals. Complete archive with filterable search and interactive pitch.`,
    };
  }, [selectedGoal, currentView, activePlayer]);

  return (
    <div className="relative min-h-screen bg-[#070708] flex flex-col font-sans text-white selection:bg-[#F97316]/30 selection:text-white">
      {/* Dynamic SEO Meta Tags & Schema.org JSON-LD */}
      <SEOHead
        title={seoInfo.title}
        description={seoInfo.description}
        goalData={seoInfo.goalData}
      />

      {/* Background Radial Glow & Grid Pattern */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[380px] bg-[radial-gradient(90%_100%_at_50%_0%,rgba(var(--color-primary-rgb),0.10)_0%,transparent_70%)]" />
        <div className="absolute inset-x-0 top-0 h-[380px] bg-[radial-gradient(60%_80%_at_12%_0%,rgba(165,0,68,0.09)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(80%_55%_at_50%_0%,#000,transparent)]" />
      </div>

      {/* Main Top Header (Fixed h-[52px]) & Mobile Navbar */}
      <Navbar
        currentView={currentView}
        onViewChange={handleViewChange}
        search={filters.search}
        onSearchChange={(search) => setFilters({ ...filters, search })}
        activeFilterCount={activeFilterCount}
        onOpenFilterDrawer={() => setIsFilterDrawerOpen(true)}
        totalFiltered={filteredGoals.length}
        totalGoals={allGoals.length}
        totalAssists={allAssists.length}
        totalIconic={74}
        currentTheme={theme}
        onThemeChange={setTheme}
        activePlayer={activePlayer}
        onSelectPlayer={(p) => {
          setActivePlayer(p);
          localStorage.setItem('active_player_id', p.id);
          setCurrentPage(1);
          setSelectedGoal(null);
        }}
      />

      {/* Main Content Area */}
      <main className="relative z-10 w-full max-w-[1700px] mx-auto flex-1 px-4 md:px-8 pt-4 pb-16">
        {/* Sticky Subheader Controls for Home (Goals View) */}
        {currentView === 'goals' && (
          <div className="sticky top-[52px] z-30 -mx-4 md:-mx-8 px-4 md:px-8 py-3 mb-6 bg-[#070708]/95 backdrop-blur-2xl border-b border-white/[0.08]">
            <div className="max-w-[1500px] mx-auto flex items-center gap-3 sm:gap-4">
              {/* Filter Button */}
              <button
                onClick={() => setIsFilterDrawerOpen(true)}
                className={`group flex items-center gap-2.5 shrink-0 transition-colors ${
                  activeFilterCount > 0 ? 'text-primary' : 'text-white/70 hover:text-white'
                }`}
              >
                <SlidersHorizontal className="w-[18px] h-[18px]" />
                <span className="font-display text-[12px] sm:text-[13px] font-black uppercase tracking-[0.16em]">
                  Filters
                </span>
                {activeFilterCount > 0 && (
                  <span className="num text-[15px] leading-none text-primary">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <span className="w-px h-5 bg-white/[0.08] shrink-0" />

              {/* Search Box with Underline */}
              <div className="relative flex items-center min-w-0 grow-[3] shrink basis-0 max-w-[420px] lg:max-w-[620px] xl:max-w-[740px]">
                <Search className="absolute left-0 w-3.5 h-3.5 text-white/25 pointer-events-none" />
                <input
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  placeholder="2011 real madrid · free kick · la liga"
                  aria-label="Search the archive"
                  className="h-8 w-full pl-6 pr-9 bg-transparent border-0 border-b border-white/[0.12] focus:border-primary/60 text-[11.5px] font-semibold text-white placeholder:text-white/20 focus:outline-none transition-colors"
                />
                {filters.search && (
                  <button
                    type="button"
                    onClick={() => setFilters({ ...filters, search: '' })}
                    aria-label="Reset"
                    className="absolute right-0 w-6 h-6 flex items-center justify-center text-white/30 hover:text-white transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Span Badge if jumpSpan active */}
              {jumpSpan && (
                <span className="label !text-[8px] text-primary shrink-0 hidden md:block">
                  #{jumpSpan.from}–{jumpSpan.to}
                </span>
              )}

              {/* Sort Menu Dropdown */}
              <div className="relative flex shrink-0">
                <button
                  onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
                  className="flex items-center gap-2 h-8 font-display text-[9.5px] font-black uppercase tracking-[0.18em] text-white/45 hover:text-white transition-colors"
                >
                  <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />
                  <span className="hidden md:inline">
                    {SORT_OPTIONS.find((s) => s.key === sortKey)?.label || 'Sort'}
                  </span>
                </button>

                {isSortMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsSortMenuOpen(false)}
                    />
                    <div className="menu absolute right-0 sm:right-auto sm:left-0 top-[calc(100%+8px)] w-[min(208px,calc(100vw-2rem))] bg-[#0b0b0d] border border-white/[0.1] rounded-2xl p-1.5 shadow-2xl z-50">
                      {SORT_OPTIONS.map((opt) => (
                        <button
                          key={opt.key}
                          onClick={() => {
                            setSortKey(opt.key);
                            setIsSortMenuOpen(false);
                            setCurrentPage(1);
                          }}
                          data-active={sortKey === opt.key}
                          className="menu-item w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-white/[0.06] text-xs font-semibold text-white/80 transition-colors"
                        >
                          <span>{opt.label}</span>
                          {sortKey === opt.key && (
                            <Check className="w-3 h-3 text-primary" />
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <span className="flex-1 min-w-[12px]" />

              {/* Showing stats counter */}
              <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-white/40">
                <span>SHOWING</span>
                <span className="text-primary font-mono">{filteredGoals.length}</span>
                <span>OF</span>
                <span className="text-white/80 font-mono">{allGoals.length}</span>
              </div>
            </div>
          </div>
        )}

        {/* View Component Switcher */}
        {currentView === 'goals' && (
          <div className="space-y-12">
            <GoalGrid
              goals={paginatedGoals}
              onSelectGoal={handleSelectGoal}
            />

            {/* No Adverts Support Banner matching messiallgoals.com */}
            {filteredGoals.length > 0 && (
              <div className="mt-16 pt-6 border-t border-white/[0.06]">
                <div className="flex flex-col md:flex-row md:items-end gap-5 md:gap-10">
                  <div className="min-w-0 flex-1">
                    <span className="label label-accent block">No adverts, ever</span>
                    <p className="mt-3 text-[12.5px] sm:text-[13px] leading-relaxed text-white/40 max-w-[560px]">
                      <span className="num text-white/85 !text-[15px] mr-0.5">
                        {allGoals.length}
                      </span>{' '}
                      goals and{' '}
                      <span className="num text-white/85 !text-[15px] mr-0.5">
                        {allAssists.length}
                      </span>{' '}
                      assists, hosted and kept online without a single advert. One person pays for that. A coffee genuinely helps.
                    </p>
                  </div>
                  <a
                    href="https://buymeacoffee.com/messiallgoals1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group shrink-0 inline-flex items-center gap-2.5 self-start md:self-auto text-primary hover:text-primary-light transition-colors"
                  >
                    <Coffee className="w-4 h-4" />
                    <span className="font-display text-[10.5px] font-black uppercase tracking-[0.18em]">
                      Buy me a coffee
                    </span>
                    <span className="h-px w-6 bg-current opacity-40 group-hover:w-10 group-hover:opacity-90 transition-all duration-300" />
                  </a>
                </div>
              </div>
            )}

            {/* Pagination Controls Matching 100% Decompiled Structure */}
            {filteredGoals.length > 0 && (
              <div className="flex flex-col items-center gap-4 mt-12 mb-4 md:mb-0">
                <nav className="flex items-center gap-0.5 bg-black/70 backdrop-blur-3xl rounded-[2rem] px-3.5 py-3 border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className="sm:hidden p-2.5 rounded-2xl text-white/30 hover:text-white hover:bg-white/[0.06] disabled:opacity-20 disabled:cursor-not-allowed transition-all min-w-[44px] min-h-[44px] flex items-center justify-center border border-transparent"
                    aria-label="First page"
                  >
                    <ChevronsLeft size={16} />
                  </button>

                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2.5 rounded-2xl text-white/30 hover:text-white hover:bg-white/[0.06] disabled:opacity-20 disabled:cursor-not-allowed transition-all min-w-[44px] min-h-[44px] flex items-center justify-center border border-transparent"
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <div className="flex items-center gap-1 sm:hidden">
                    <span className="num-plain px-3.5 py-2.5 rounded-2xl font-black text-xs bg-primary text-white shadow-[0_0_20px_-4px_var(--color-primary)] min-w-[44px] min-h-[44px] flex items-center justify-center">
                      {currentPage}
                    </span>
                    <span className="label px-1">of</span>
                    <span className="num-plain text-white/40 text-xs font-black px-1 min-w-[44px] min-h-[44px] flex items-center justify-center">
                      {totalPages}
                    </span>
                  </div>

                  <div className="hidden sm:flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
                      const p = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + idx;
                      if (p > totalPages) return null;
                      return (
                        <button
                          key={p}
                          onClick={() => handlePageChange(p)}
                          className={`num-plain px-3.5 py-2 rounded-2xl font-black transition-all text-xs ${
                            currentPage === p
                              ? 'bg-primary text-white shadow-[0_0_20px_-4px_var(--color-primary)] border border-white/10'
                              : 'text-white/30 hover:text-white hover:bg-white/[0.05]'
                          }`}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2.5 rounded-2xl text-white/30 hover:text-white hover:bg-white/[0.06] disabled:opacity-20 disabled:cursor-not-allowed transition-all min-w-[44px] min-h-[44px] flex items-center justify-center border border-transparent"
                    aria-label="Next page"
                  >
                    <ChevronRight size={16} />
                  </button>

                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="sm:hidden p-2.5 rounded-2xl text-white/30 hover:text-white hover:bg-white/[0.06] disabled:opacity-20 disabled:cursor-not-allowed transition-all min-w-[44px] min-h-[44px] flex items-center justify-center border border-transparent"
                    aria-label="Last page"
                  >
                    <ChevronsRight size={16} />
                  </button>
                </nav>

                {/* Jump to goal input */}
                <form onSubmit={handleJumpSubmit} className="relative flex items-center">
                  <span className="absolute left-0 font-display text-[11px] font-black text-white/25 pointer-events-none">
                    #
                  </span>
                  <input
                    value={jumpInput}
                    onChange={(e) => setJumpInput(e.target.value)}
                    placeholder="500 or 500-520"
                    aria-label="Go to a goal, or a span of them"
                    className={`h-8 w-[168px] pl-5 pr-[46px] text-center bg-transparent border-0 border-b text-[11.5px] font-semibold text-white placeholder:text-white/20 focus:outline-none transition-colors ${
                      jumpSpan ? 'border-primary/70' : 'border-white/[0.12] focus:border-primary/60'
                    }`}
                  />
                  <span className="absolute right-0 flex items-center gap-0.5">
                    {(jumpInput || jumpSpan) && (
                      <button
                        type="button"
                        onClick={() => {
                          setJumpInput('');
                          setJumpSpan(null);
                        }}
                        aria-label="Reset"
                        className="w-6 h-6 flex items-center justify-center text-white/30 hover:text-white transition-colors"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    )}
                    {jumpInput.trim() && (
                      <button
                        type="submit"
                        aria-label="Go"
                        className="w-6 h-6 rounded-md flex items-center justify-center bg-primary text-black hover:bg-primary-light transition-colors"
                      >
                        <CornerDownLeft className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </span>
                </form>
              </div>
            )}
          </div>
        )}

        {currentView === 'compare' && (
          <HeadToHeadCompare initialPlayer1={activePlayer.id} />
        )}

        {currentView === 'shotmapper' && (
          <ShotMapper
            goals={allGoals}
            onOpenModal={handleSelectGoal}
            onOpenFilterDrawer={() => setIsFilterDrawerOpen(true)}
          />
        )}

        {currentView === 'assists' && <AssistsView assists={allAssists} />}

        {currentView === 'iconic' && (
          <IconicView goals={allGoals} onSelectGoal={handleSelectGoal} />
        )}
      </main>

      {/* Complete Footer Matching 100% of messiallgoals.com */}
      <Footer totalGoals={allGoals.length} totalAssists={allAssists.length} />

      {/* Goal Detail Modal (HD Video Player + Mini Pitch + Scrubber) */}
      {selectedGoal && (
        <GoalDetailModal
          goal={selectedGoal}
          onClose={handleCloseModal}
          onNext={handleNextGoal}
          onPrev={handlePrevGoal}
          hasNext={currentGoalIndex < filteredGoals.length - 1}
          hasPrev={currentGoalIndex > 0}
        />
      )}

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onFilterChange={setFilters}
        totalResults={filteredGoals.length}
        competitions={competitions}
        seasons={seasons}
        allGoals={allGoals}
        activeTab={currentView}
      />
    </div>
  );
};

export default App;
