
import React from 'react';
import { Habit } from '../types';
import { useNavigate } from 'react-router-dom';

interface HabitTileProps {
  habit: Habit;
  onToggle: (id: string) => void;
  isLocked?: boolean;
}

const HabitTile: React.FC<HabitTileProps> = ({ habit, onToggle, isLocked }) => {
  const navigate = useNavigate();

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLocked) onToggle(habit.id);
  };

  return (
    <div 
      onClick={() => !isLocked && navigate(`/habit/${habit.id}`)}
      className={`aspect-square flex flex-col justify-between p-5 rounded-3xl border shadow-sm relative group cursor-pointer active:scale-95 transition-all duration-200 
        ${habit.completedToday 
          ? 'bg-primary/10 border-primary/20' 
          : habit.type === 'break' 
            ? 'bg-[#fffaf5] dark:bg-[#1c1917] border-orange-100 dark:border-stone-800' 
            : 'bg-white dark:bg-surface-dark border-slate-100 dark:border-white/5'
        }`}
    >
      <div className="flex justify-between items-start">
        <div className={`flex h-10 w-10 items-center justify-center rounded-2xl 
          ${habit.completedToday ? 'bg-primary text-black' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}
        `}>
          <span className="material-symbols-outlined filled">{habit.icon}</span>
        </div>
        
        <div className="relative h-8 w-8 flex items-center justify-center" onClick={handleToggle}>
          {isLocked ? (
             <span className="material-symbols-outlined text-slate-400">lock</span>
          ) : habit.completedToday ? (
            <div className="h-full w-full rounded-full bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-black text-lg font-bold">check</span>
            </div>
          ) : (
            <div className="h-full w-full rounded-full border-2 border-slate-200 dark:border-slate-700"></div>
          )}
        </div>
      </div>

      <div>
        <h3 className={`text-lg font-bold leading-tight mb-1 ${habit.completedToday ? 'text-primary' : ''}`}>
          {habit.name}
        </h3>
        <p className="text-xs font-medium text-slate-400 flex items-center gap-1">
          <span className="text-orange-500">🔥</span> {habit.streak} days
        </p>
      </div>

      {isLocked && (
         <div className="absolute inset-0 bg-black/5 dark:bg-white/5 backdrop-blur-[2px] rounded-3xl z-10"></div>
      )}
    </div>
  );
};

export default HabitTile;
