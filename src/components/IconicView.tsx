import React from 'react';
import { Goal } from '../types/archive';
import { GoalCard } from './GoalCard';
import { Flame, Sparkles } from 'lucide-react';

interface IconicViewProps {
  goals: Goal[];
  onSelectGoal: (goal: Goal) => void;
}

// Landmark iconic goal numbers
const ICONIC_GOAL_TITLES = [
  '1',    // 1st Barcelona Goal vs Albacete (Ronaldinho assist)
  '19',   // Solo vs Getafe 2007 (Maradona replica)
  '100',  // 100th Goal
  '108',  // UCL Final 2009 vs Man Utd (Header)
  '178',  // Real Madrid 2011 Bernabeu Solo in UCL Semi
  '186',  // UCL Final 2011 vs Man Utd at Wembley
  '452',  // Bayern Munich 2015 (Boateng ankle-breaker chip)
  '500',  // Real Madrid 2017 (90+2 minute Santiago Bernabeu shirt celebration)
  '600',  // Liverpool 2019 (35-yard Free Kick vs Alisson)
  '700',  // Panenka vs Atletico Madrid
  '793',  // World Cup Final 2022 vs France
  '800',  // 800th Goal (Free kick vs Panama)
  '815',  // Inter Miami debut 94' Free kick vs Cruz Azul
  '900',  // 900th Career Goal milestone
  '927',  // Latest Masterclass
];

export const IconicView: React.FC<IconicViewProps> = ({ goals, onSelectGoal }) => {
  const iconicGoals = goals.filter((g) => ICONIC_GOAL_TITLES.includes(g.title));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-rose-950/40 via-[#161923] to-[#11131a] p-6 rounded-2xl border border-rose-500/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center">
            <Flame className="w-6 h-6 text-rose-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-extrabold text-xl text-white">
                Iconic Career Masterpieces
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                HALL OF FAME
              </span>
            </div>
            <p className="text-xs text-slate-400">
              The defining moments, historical milestones, and greatest goals in football history
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {iconicGoals.map((goal) => (
          <GoalCard
            key={`iconic-${goal.title}`}
            goal={goal}
            onClick={() => onSelectGoal(goal)}
          />
        ))}
      </div>
    </div>
  );
};
