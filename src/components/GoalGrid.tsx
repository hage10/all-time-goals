import React, { useState, useEffect } from 'react';
import { Goal } from '../types/archive';
import { GoalCard } from './GoalCard';
import { ArrowDown, Trophy } from 'lucide-react';

interface GoalGridProps {
  goals: Goal[];
  onSelectGoal: (goal: Goal) => void;
}

const PAGE_SIZE = 48;

export const GoalGrid: React.FC<GoalGridProps> = ({ goals, onSelectGoal }) => {
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);

  // Reset page count when filtered goals change
  useEffect(() => {
    setDisplayCount(PAGE_SIZE);
  }, [goals]);

  const visibleGoals = goals.slice(0, displayCount);
  const hasMore = displayCount < goals.length;

  const handleLoadMore = () => {
    setDisplayCount((prev) => Math.min(prev + PAGE_SIZE, goals.length));
  };

  if (goals.length === 0) {
    return (
      <div className="w-full py-24 flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
          <Trophy className="w-8 h-8 text-white/30" />
        </div>
        <h3 className="text-lg font-bold text-white mb-1 font-display">No Goals Found</h3>
        <p className="text-xs text-white/40 max-w-sm">
          Try adjusting your search criteria or resetting the active filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Grid of Cards (2 cols mobile, up to 6 cols on wide desktop matching messiallgoals.com) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
        {visibleGoals.map((goal) => (
          <GoalCard
            key={`${goal.title}-${goal.date}-${goal.matchNumber || ''}`}
            goal={goal}
            onClick={() => onSelectGoal(goal)}
          />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex flex-col items-center justify-center pt-8 pb-12">
          <button
            onClick={handleLoadMore}
            className="group px-7 py-3 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-white font-bold text-xs border border-white/[0.12] hover:border-white/25 shadow-2xl transition-all flex items-center gap-2 font-display uppercase tracking-wider"
          >
            <span>Load More ({goals.length - displayCount} Remaining)</span>
            <ArrowDown className="w-3.5 h-3.5 text-[#F97316] group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
};
