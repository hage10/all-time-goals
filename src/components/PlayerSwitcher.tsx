import React, { useState, useRef, useEffect } from 'react';
import { PlayerProfile } from '../types/player';
import { PLAYERS } from '../data/players';
import { ChevronDown, Sparkles, Check } from 'lucide-react';

interface PlayerSwitcherProps {
  activePlayer: PlayerProfile;
  onSelectPlayer: (player: PlayerProfile) => void;
}

export const PlayerSwitcher: React.FC<PlayerSwitcherProps> = ({
  activePlayer,
  onSelectPlayer,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.16] transition-all"
        title="Switch All-Star Player"
      >
        <div className="relative w-6 h-6 rounded-full overflow-hidden ring-1 ring-white/20 bg-black">
          <img
            src={activePlayer.avatar}
            alt={activePlayer.name}
            className="w-full h-full object-cover object-top"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs font-black tracking-tight text-white group-hover:text-primary transition-colors">
            {activePlayer.shortName}
          </span>
          <span className="text-[10px]">{activePlayer.flag}</span>
        </div>

        <div className="flex items-center gap-1 pl-1 border-l border-white/[0.1]">
          <span className="font-mono text-[11px] font-black text-primary">
            {activePlayer.stats.totalGoals}
          </span>
          <span className="text-[9px] uppercase font-bold text-white/40">G</span>
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 text-white/40 group-hover:text-white transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 sm:right-0 sm:left-auto top-full mt-2 w-72 rounded-2xl bg-[#0d0d11] border border-white/[0.1] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-200 backdrop-blur-2xl">
          <div className="px-3 py-2 border-b border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-primary">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="font-display text-[9.5px] font-black uppercase tracking-[0.16em]">
                All-Star Superstars
              </span>
            </div>
            <span className="text-[9px] font-bold text-white/30 uppercase">5 Legends</span>
          </div>

          <div className="space-y-1 mt-1.5">
            {PLAYERS.map((player) => {
              const isSelected = player.id === activePlayer.id;

              return (
                <button
                  key={player.id}
                  onClick={() => {
                    onSelectPlayer(player);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                    isSelected
                      ? 'bg-white/[0.08] border border-white/[0.1] shadow-md'
                      : 'hover:bg-white/[0.04] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden bg-black shrink-0 ring-1 ring-white/10">
                      <img
                        src={player.avatar}
                        alt={player.name}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white truncate">
                          {player.name}
                        </span>
                        <span className="text-[11px]">{player.flag}</span>
                      </div>
                      <p className="text-[10px] text-white/40 truncate">
                        {player.currentClub} · {player.stats.careerSpan}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right">
                      <span className="text-xs font-mono font-black text-white block leading-tight">
                        {player.stats.totalGoals}
                      </span>
                      <span className="text-[8.5px] uppercase font-bold text-white/35 block">
                        {player.stats.totalAssists} assists
                      </span>
                    </div>

                    {isSelected && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
