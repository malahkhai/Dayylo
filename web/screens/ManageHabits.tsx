
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Habit } from '../types';
import BottomNav from '../components/BottomNav';

interface ManageHabitsProps {
  habits: Habit[];
  onRemove: (id: string) => void;
}

const ManageHabitsScreen: React.FC<ManageHabitsProps> = ({ habits, onRemove }) => {
  const navigate = useNavigate();
  const [activeClass, setActiveClass] = useState<'build' | 'break'>('build');

  const filteredHabits = habits.filter(h => h.type === activeClass);

  return (
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark pb-32">
      <header className="px-6 pt-12 pb-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight">Your Habits</h1>
          <button 
            onClick={() => navigate('/add')}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-black shadow-lg"
          >
            <span className="material-symbols-outlined font-bold">add</span>
          </button>
        </div>

        {/* Menu Bar / Class Selector */}
        <div className="bg-slate-100 dark:bg-surface-dark p-1.5 rounded-2xl flex relative ring-1 ring-black/5 dark:ring-white/5">
          <button 
            onClick={() => setActiveClass('build')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${activeClass === 'build' ? 'bg-white dark:bg-[#24342f] shadow-md text-primary scale-[1.02]' : 'text-slate-500 opacity-60'}`}
          >
            Build Class
          </button>
          <button 
            onClick={() => setActiveClass('break')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${activeClass === 'break' ? 'bg-white dark:bg-[#2a231b] shadow-md text-accent-break scale-[1.02]' : 'text-slate-500 opacity-60'}`}
          >
            Break Class
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar px-6 space-y-4">
        {filteredHabits.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 opacity-30">
            <span className="material-symbols-outlined text-6xl mb-2">inventory_2</span>
            <p className="font-bold">No habits in this class yet</p>
          </div>
        ) : (
          filteredHabits.map(habit => (
            <div 
              key={habit.id}
              className="flex items-center justify-between p-5 rounded-3xl bg-white dark:bg-surface-dark border border-slate-100 dark:border-white/5 shadow-sm group"
            >
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${activeClass === 'build' ? 'bg-primary/10 text-primary' : 'bg-orange-500/10 text-orange-500'}`}>
                  <span className="material-symbols-outlined text-2xl filled">{habit.icon}</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">{habit.name}</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{habit.streak} day streak</p>
                </div>
              </div>
              
              <button 
                onClick={() => onRemove(habit.id)}
                className="h-10 w-10 flex items-center justify-center rounded-full text-slate-300 hover:text-red-500 hover:bg-red-500/10 transition-all"
              >
                <span className="material-symbols-outlined text-xl">delete</span>
              </button>
            </div>
          ))
        )}
      </main>

      <BottomNav active="habits" />
    </div>
  );
};

export default ManageHabitsScreen;
