
import React from 'react';
import { Habit } from '../types';
import { useNavigate } from 'react-router-dom';

interface HabitTileProps {
  habit: Habit;
  onToggle: (id: string) => void;
  onUpdateValue?: (id: string, delta: number) => void;
  isLocked?: boolean;
}

const HabitTile: React.FC<HabitTileProps> = ({ habit, onToggle, onUpdateValue, isLocked }) => {
  const navigate = useNavigate();

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLocked) onToggle(habit.id);
  };

  const handleIncrement = (e: React.MouseEvent, delta: number) => {
    e.stopPropagation();
    if (onUpdateValue && !isLocked) onUpdateValue(habit.id, delta);
  };

  const isCompleted = habit.completedToday || (habit.targetValue && habit.currentValue && habit.currentValue >= habit.targetValue);
  const hasStepper = habit.targetValue !== undefined && habit.unit !== 'min';

  return (
    <div 
      onClick={() => !isLocked && navigate(`/habit/${habit.id}`)}
      className="relative flex items-center bg-white dark:bg-surface-dark-alt rounded-3xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.03)] border border-slate-50 dark:border-white/5 active:scale-[0.98] transition-all cursor-pointer overflow-hidden mb-3"
    >
      {/* Icon Area */}
      <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-50 dark:bg-white/5 flex-shrink-0">
        <span className="material-symbols-outlined text-slate-500 !text-[24px]">{habit.icon}</span>
      </div>

      {/* Text Info */}
      <div className="ml-4 flex-1 min-w-0">
        <div className="flex items-center gap-2">
           <h3 className="text-[16px] font-bold text-slate-900 dark:text-white truncate">
            {habit.name}
          </h3>
        </div>
        <div className="flex items-center gap-2.5 mt-1">
          {habit.targetValue && (
            <span className="text-[13px] font-medium text-slate-400">
              {habit.currentValue ?? 0} {habit.unit}
            </span>
          )}
          <div className="flex items-center gap-1">
            <span className="text-orange-500 text-[14px]">🔥</span>
            <span className="text-[13px] font-bold text-orange-500">{habit.streak} Days</span>
          </div>
        </div>
      </div>

      {/* Action Area: Checkbox or Stepper */}
      <div className="flex items-center gap-3 ml-2">
        {hasStepper ? (
          <div className="flex items-center bg-slate-50 dark:bg-white/5 rounded-2xl p-1.5 border border-slate-100 dark:border-white/10">
            <button 
              onClick={(e) => handleIncrement(e, -1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-400"
            >
              <span className="material-symbols-outlined !text-[20px]">remove</span>
            </button>
            <span className="min-w-[24px] text-center text-[15px] font-bold text-slate-800 dark:text-slate-200">
              {habit.currentValue}
            </span>
            <button 
              onClick={(e) => handleIncrement(e, 1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-400"
            >
              <span className="material-symbols-outlined !text-[20px]">add</span>
            </button>
          </div>
        ) : (
          <button 
            onClick={handleToggle}
            className={`w-10 h-10 rounded-2xl flex items-center justify-center border transition-all
              ${isCompleted 
                ? 'bg-primary/5 border-primary/20 text-primary shadow-sm' 
                : 'bg-slate-50 dark:bg-transparent border-slate-100 dark:border-white/10 text-slate-200'
              }
            `}
          >
            <span className={`material-symbols-outlined !text-[22px] ${isCompleted ? 'font-bold' : ''}`}>
              {isCompleted ? 'check' : ''}
            </span>
          </button>
        )}
      </div>

      {/* Locked State Overlay */}
      {isLocked && (
        <div className="absolute inset-0 bg-white/40 dark:bg-black/40 backdrop-blur-[2px] z-10 flex items-center justify-end pr-5">
           <span className="material-symbols-outlined text-slate-400 opacity-50">lock</span>
        </div>
      )}
    </div>
  );
};

export default HabitTile;
