import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ViewMode } from '../types/archive';
import {
  Crosshair,
  Coffee,
  Globe,
  LogIn,
  Home,
  SlidersHorizontal,
  ChevronDown,
  Check,
} from 'lucide-react';

interface NavbarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  search: string;
  onSearchChange: (search: string) => void;
  activeFilterCount: number;
  onOpenFilterDrawer: () => void;
  totalFiltered: number;
  totalGoals: number;
  totalAssists: number;
  totalIconic?: number;
  currentTheme?: string;
  onThemeChange?: (theme: string) => void;
}

const LANGUAGES = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'es', label: 'Español', short: 'ES' },
  { code: 'tr', label: 'Türkçe', short: 'TR' },
];

const THEMES = [
  { id: 'default', name: 'Auto', color: '#F97316' },
  { id: 'barcelona', name: 'Barcelona', color: '#A50044' },
  { id: 'argentina', name: 'Argentina', color: '#74ACDF' },
  { id: 'miami', name: 'Inter Miami', color: '#f4127a' },
  { id: 'psg', name: 'PSG', color: '#DA291C' },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  search,
  onSearchChange,
  activeFilterCount,
  onOpenFilterDrawer,
  totalFiltered,
  totalGoals,
  totalAssists,
  totalIconic = 74,
  currentTheme = 'default',
  onThemeChange,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<'theme' | 'lang' | null>(null);
  const [currentLang, setCurrentLang] = useState('en');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeThemeObj = THEMES.find((t) => t.id === currentTheme) || THEMES[0];
  const activeLangObj = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  const DATASET_TABS = [
    { key: 'goals' as ViewMode, label: 'Goals', count: totalGoals },
    { key: 'assists' as ViewMode, label: 'Assists', count: totalAssists },
    { key: 'iconic' as ViewMode, label: 'Iconic', count: totalIconic },
  ];

  const renderTabs = (stacked = false) => (
    <nav className={`flex items-stretch ${stacked ? 'justify-around' : ''}`}>
      {DATASET_TABS.map((tab) => {
        const isActive = currentView === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onViewChange(tab.key)}
            className="group relative flex flex-col items-center justify-center px-3.5 sm:px-5 py-1.5 min-w-[74px] sm:min-w-[86px] transition-colors"
          >
            <span
              className={`num text-[17px] sm:text-[19px] leading-none tabular-nums transition-colors ${
                isActive ? 'text-primary' : 'text-white/30 group-hover:text-white/60'
              }`}
            >
              {tab.count ?? '—'}
            </span>
            <span
              className={`font-display text-[8px] sm:text-[8.5px] font-black uppercase tracking-[0.2em] mt-1.5 transition-colors ${
                isActive ? 'text-white' : 'text-white/25 group-hover:text-white/45'
              }`}
            >
              {tab.label}
            </span>
            {isActive && (
              <span className="absolute -bottom-px inset-x-2 h-[2px] rounded-full bg-primary" />
            )}
          </button>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Top Fixed Appbar (Exact h-[52px] DOM matching original PF component) */}
      <header className="fixed top-0 inset-x-0 z-50">
        <div
          className={`relative z-20 border-b backdrop-blur-2xl backdrop-saturate-150 transition-[background-color,border-color] duration-250 ${
            scrolled
              ? 'bg-[#070708]/92 border-white/[0.09]'
              : 'bg-[#070708]/55 border-white/[0.04]'
          }`}
        >
          <div className="mx-auto max-w-[1500px] px-3 sm:px-5 h-[52px] flex items-center gap-3">
            {/* Left: Brand Logo & Title */}
            <div
              onClick={() => onViewChange('goals')}
              className="flex items-center gap-2.5 shrink-0 group cursor-pointer"
            >
              <img
                src="/icon.png"
                alt="Messi All Goals"
                className="w-7 h-7 rounded-lg object-cover shrink-0 transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="hidden min-[420px]:inline font-display text-[13px] font-black uppercase italic tracking-[-0.02em] text-white leading-none">
                Messi<span className="text-primary"> All Goals</span>
              </span>
            </div>

            <span className="hidden sm:block w-px h-7 bg-white/[0.08] ml-1" />

            {/* Desktop Center: Dataset Tabs */}
            <div className="hidden sm:flex self-stretch items-stretch">
              {renderTabs(false)}
            </div>

            <div className="flex-1 min-w-0" />

            {/* Right: Controls & Links */}
            <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
              {/* Shot Map link */}
              <button
                onClick={() => onViewChange('shotmapper')}
                data-active={currentView === 'shotmapper'}
                className={`hidden sm:flex items-center gap-1.5 h-[34px] px-1.5 sm:px-2 transition-colors ${
                  currentView === 'shotmapper' ? 'text-primary' : 'text-white/40 hover:text-white'
                }`}
                title="Shot Map"
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span className="hidden lg:inline font-display text-[9.5px] font-black uppercase tracking-[0.18em]">
                  Shot Map
                </span>
              </button>

              {/* Support link */}
              <span className="hidden sm:block">
                <a
                  href="https://buymeacoffee.com/messiallgoals1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 h-[34px] px-1.5 sm:px-2 transition-colors text-white/40 hover:text-white"
                  title="Support"
                >
                  <Coffee className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline font-display text-[9.5px] font-black uppercase tracking-[0.18em]">
                    Support
                  </span>
                </a>
              </span>

              <span className="w-px h-5 bg-white/[0.08] mx-0.5 hidden sm:block" />

              {/* Theme Selector Dropdown */}
              <div className="relative flex items-center">
                <button
                  onClick={() => setOpenMenu(openMenu === 'theme' ? null : 'theme')}
                  className="iconbtn !rounded-xl"
                  aria-label="Change theme"
                >
                  <span className="relative flex items-center justify-center">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white/20"
                      style={{ backgroundColor: activeThemeObj.color }}
                    />
                    <span
                      className="absolute -bottom-1 -right-1 w-1.5 h-1.5 rounded-full ring-1 ring-black"
                      style={{ backgroundColor: activeThemeObj.color }}
                    />
                  </span>
                </button>

                {openMenu === 'theme' && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setOpenMenu(null)}
                    />
                    <div className="menu absolute top-[calc(100%+10px)] right-0 z-50 w-52 bg-[#0b0b0d] border border-white/[0.1] rounded-2xl p-1.5 shadow-2xl">
                      {THEMES.map((th) => (
                        <button
                          key={th.id}
                          onClick={() => {
                            if (onThemeChange) onThemeChange(th.id);
                            setOpenMenu(null);
                          }}
                          data-active={currentTheme === th.id}
                          className="menu-item w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left hover:bg-white/[0.06] text-xs font-semibold text-white/80 transition-colors"
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{
                              backgroundColor: th.color,
                              boxShadow: `0 0 8px ${th.color}`,
                            }}
                          />
                          <span className="flex-1">{th.name}</span>
                          {currentTheme === th.id && (
                            <Check className="w-3 h-3 text-primary" />
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Language Selector Dropdown */}
              <div className="relative flex items-center">
                <button
                  onClick={() => setOpenMenu(openMenu === 'lang' ? null : 'lang')}
                  className="iconbtn !w-auto !px-2 sm:!px-2.5 !rounded-xl gap-1 sm:gap-1.5 flex items-center text-white/70 hover:text-white"
                  aria-label="Change language"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span className="font-display text-[10px] font-black tracking-[0.1em]">
                    {activeLangObj.short}
                  </span>
                  <ChevronDown
                    className={`hidden sm:block w-2.5 h-2.5 opacity-50 transition-transform ${
                      openMenu === 'lang' ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {openMenu === 'lang' && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setOpenMenu(null)}
                    />
                    <div className="menu absolute top-[calc(100%+10px)] right-0 z-50 w-44 bg-[#0b0b0d] border border-white/[0.1] rounded-2xl p-1.5 shadow-2xl">
                      {LANGUAGES.map((lg) => (
                        <button
                          key={lg.code}
                          onClick={() => {
                            setCurrentLang(lg.code);
                            setOpenMenu(null);
                          }}
                          data-active={currentLang === lg.code}
                          className="menu-item w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-white/[0.06] text-xs font-semibold text-white/80 transition-colors"
                        >
                          <span className="w-6 text-[10px] font-black opacity-60">
                            {lg.short}
                          </span>
                          <span className="flex-1">{lg.label}</span>
                          {currentLang === lg.code && (
                            <Check className="w-3 h-3 text-primary" />
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Sign In button */}
              <button
                onClick={() => onViewChange('goals')}
                aria-label="Sign In"
                title="Sign In"
                className="btn btn-primary !h-8 !w-8 sm:!w-auto !px-0 sm:!px-3.5 !rounded-xl ml-0.5 shrink-0 flex items-center justify-center font-display text-[10px] font-black uppercase tracking-[0.14em]"
              >
                <LogIn className="w-3.5 h-3.5 sm:hidden" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            </div>
          </div>

          {/* Mobile Stacked Tabs row below header */}
          <div className="sm:hidden border-t border-white/[0.05]">
            {renderTabs(true)}
          </div>
        </div>
      </header>

      {/* Spacer for fixed top header */}
      <div className="h-[52px] sm:h-[52px]" />

      {/* Mobile Fixed Bottom Floating Bar (Exact DOM matching RF component) */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-center px-4 pt-2 pointer-events-none"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 10px)' }}
      >
        <div className="pointer-events-auto flex items-stretch gap-0.5 max-w-full bg-black/70 backdrop-blur-3xl px-2 py-1.5 rounded-[1.75rem] border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
          {[
            {
              name: 'Home',
              view: 'goals' as ViewMode,
              icon: Home,
            },
            {
              name: 'Shots',
              view: 'shotmapper' as ViewMode,
              icon: Crosshair,
            },
            {
              name: 'Support',
              view: 'goals' as ViewMode,
              icon: Coffee,
              isExternal: true,
              href: 'https://buymeacoffee.com/messiallgoals1',
            },
            {
              name: 'Profile',
              view: 'goals' as ViewMode,
              icon: LogIn,
            },
          ].map((item) => {
            const Icon = item.icon;
            const isTabActive = currentView === item.view && !item.isExternal;

            if (item.isExternal) {
              return (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative flex flex-col items-center justify-center gap-1 min-w-[56px] min-[380px]:min-w-[62px] px-2 py-2 rounded-[1.35rem] transition-all duration-300 border border-transparent text-white/35 active:text-white/70"
                >
                  <span className="flex items-center justify-center w-5 h-5">
                    <Icon size={16} />
                  </span>
                  <span className="font-display text-[8px] font-black uppercase tracking-[0.16em] leading-none">
                    {item.name}
                  </span>
                </a>
              );
            }

            return (
              <button
                key={item.name}
                onClick={() => onViewChange(item.view)}
                aria-current={isTabActive ? 'page' : undefined}
                className={`relative flex flex-col items-center justify-center gap-1 min-w-[56px] min-[380px]:min-w-[62px] px-2 py-2 rounded-[1.35rem] transition-all duration-300 ${
                  isTabActive
                    ? 'bg-white/[0.08] border border-white/[0.1] text-white shadow-[0_4px_14px_rgba(0,0,0,0.55)]'
                    : 'border border-transparent text-white/35 active:text-white/70'
                }`}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <span className="flex items-center justify-center w-5 h-5">
                  <Icon size={16} className={isTabActive ? 'text-primary' : ''} />
                </span>
                <span className="font-display text-[8px] font-black uppercase tracking-[0.16em] leading-none">
                  {item.name}
                </span>
                {isTabActive && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-5 h-[2px] rounded-full bg-primary shadow-[0_0_10px_var(--color-primary)]" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
