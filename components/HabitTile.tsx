
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

  const isCompleted = habit.completedToday;
  const isBreak = habit.type === 'break';

  return (
    <div 
      onClick={() => !isLocked && navigate(`/habit/${habit.id}`)}
      className={`relative group aspect-[0.9/1] p-5 rounded-[2rem] border transition-all duration-300 active:scale-95 cursor-pointer flex flex-col justify-between overflow-hidden
        ${isCompleted 
          ? 'bg-primary/10 border-primary/20 shadow-[0_8px_20px_-8px_rgba(48,232,171,0.2)]' 
          : 'bg-surface-dark border-white/5 shadow-lg'
        }
      `}
    >
      {/* Background Glow for completed habits */}
      {isCompleted && (
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 blur-[40px] rounded-full pointer-events-none"></div>
      )}

      <div className="flex justify-between items-start z-10">
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300
          ${isCompleted 
            ? 'bg-primary text-black' 
            : isBreak ? 'bg-orange-500/10 text-orange-500' : 'bg-white/5 text-slate-400'
          }
        `}>
          <span className="material-symbols-outlined filled !text-[24px]">{habit.icon}</span>
        </div>
        
        <button 
          onClick={handleToggle}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 border-2
            ${isCompleted 
              ? 'bg-primary border-primary' 
              : 'bg-transparent border-white/10 hover:border-white/30'
            }
          `}
        >
          {isCompleted && <span className="material-symbols-outlined text-black !text-[20px] font-black">check</span>}
        </button>
      </div>

      <div className="z-10">
        <h3 className={`text-lg font-extrabold leading-tight tracking-tight mb-1 transition-colors
          ${isCompleted ? 'text-primary' : 'text-white'}
        `}>
          {habit.name}
        </h3>
        <div className="flex items-center gap-1.5">
          <span className="text-[14px]">🔥</span>
          <p className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-500">{habit.streak} day streak</p>
        </div>
      </div>

      {isLocked && (
        <div className="absolute inset-0 bg-[#0a1512]/80 backdrop-blur-[6px] z-20 flex flex-col items-center justify-center gap-2 p-4 text-center">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-slate-400 !text-[20px]">lock</span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Private</span>
        </div>
      )}
    </div>
  );
};

export default HabitTile;
