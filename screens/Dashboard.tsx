
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Habit, User } from '../types';
import BottomNav from '../components/BottomNav';
import HabitTile from '../components/HabitTile';

interface DashboardProps {
  habits: Habit[];
  user: User;
  onToggleHabit: (id: string) => void;
  onOpenLock: () => void;
}

const DashboardScreen: React.FC<DashboardProps> = ({ habits, user, onToggleHabit, onOpenLock }) => {
  const navigate = useNavigate();
  const [activeClass, setActiveClass] = useState<'build' | 'break'>('build');
  
  const buildHabits = habits.filter(h => h.type === 'build');
  const breakHabits = habits.filter(h => h.type === 'break');
  
  const totalCompleted = habits.filter(h => h.completedToday).length;
  const progressPercent = habits.length > 0 ? Math.round((totalCompleted / habits.length) * 100) : 0;
  
  const currentHabits = activeClass === 'build' ? buildHabits : breakHabits;
  const habitsLeft = currentHabits.filter(h => !h.completedToday).length;

  return (
    <div className="flex flex-col h-screen bg-background-dark pb-32 relative overflow-hidden transition-colors duration-200">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[400px] bg-primary/5 blur-[120px] pointer-events-none z-0"></div>

      {/* Header */}
      <header className="flex flex-col px-6 pt-12 pb-4 z-10">
        <div className="flex items-end justify-between">
          <div className="flex flex-col">
            <h2 className="text-slate-500 text-sm font-black uppercase tracking-[0.2em] mb-1">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </h2>
            <h1 className="text-4xl font-black tracking-tighter text-white">Dashboard</h1>
          </div>
          <div 
            onClick={() => navigate('/profile')}
            className="h-11 w-11 rounded-2xl bg-surface-dark overflow-hidden border border-white/10 cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center justify-center"
          >
            <img 
              className="h-full w-full object-cover opacity-80" 
              alt="User" 
              src="https://i.pravatar.cc/100?img=12"
            />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar px-6 space-y-8 pt-4 z-10 animate-fade-in-up">
        {/* Daily Progress Section */}
        <section className="bg-surface-dark rounded-[2.5rem] p-7 border border-white/5 shadow-2xl relative overflow-hidden group">
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary/5 blur-[50px] rounded-full pointer-events-none"></div>
          
          <div className="flex justify-between items-end mb-5">
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">Daily Progress</h2>
              <p className="text-slate-400 text-sm mt-0.5 font-bold uppercase tracking-widest opacity-60">Keep the momentum</p>
            </div>
            <div className="text-right">
              <span className="text-5xl font-black text-primary tracking-tighter drop-shadow-[0_0_10px_rgba(48,232,171,0.4)]">
                {progressPercent}%
              </span>
            </div>
          </div>
          
          <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden mb-5">
            <div 
              className="h-full bg-gradient-to-r from-primary via-[#5ac8fa] to-primary rounded-full transition-all duration-1000 ease-out" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest">
            <span className="text-white/60">{totalCompleted} of {habits.length} Habits Completed</span>
            <span className="text-primary flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] font-black">trending_up</span> On Track
            </span>
          </div>
        </section>

        {/* Streak Grid */}
        <section className="grid grid-cols-2 gap-4">
          <div className="bg-surface-dark rounded-[2rem] p-6 border border-white/5 flex flex-col justify-between h-40 relative overflow-hidden shadow-xl">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl"></div>
            <div className="flex items-center gap-2.5 z-10">
              <span className="material-symbols-outlined text-orange-500 filled !text-[22px]">local_fire_department</span>
              <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em]">Build Streak</span>
            </div>
            <div className="z-10 mt-4">
              <span className="text-5xl font-black text-white tracking-tighter">12</span>
              <span className="text-xs font-black text-slate-500 ml-2 uppercase tracking-[0.3em]">Days</span>
            </div>
          </div>

          <div className="bg-surface-dark rounded-[2rem] p-6 border border-white/5 flex flex-col justify-between h-40 relative overflow-hidden shadow-xl">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
            <div className="flex items-center gap-2.5 z-10">
              <span className="material-symbols-outlined text-blue-500 !text-[22px]">shield</span>
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Break Streak</span>
            </div>
            <div className="z-10 mt-4">
              <span className="text-5xl font-black text-white tracking-tighter">5</span>
              <span className="text-xs font-black text-slate-500 ml-2 uppercase tracking-[0.3em]">Days</span>
            </div>
          </div>
        </section>

        {/* Your Habits Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-1">
            <div className="flex flex-col">
              <h3 className="text-2xl font-black text-white tracking-tight">Your Habits</h3>
              <p className="text-[11px] font-black uppercase tracking-widest text-primary mt-1">
                You have <span className="text-white">{habitsLeft} habits</span> left
              </p>
            </div>
          </div>

          {/* Segmented Class Selector */}
          <div className="bg-white/5 p-1 rounded-2xl flex relative ring-1 ring-white/5">
            <button 
              onClick={() => setActiveClass('build')}
              className={`flex-1 py-3 text-sm font-black rounded-xl transition-all duration-300 ${activeClass === 'build' ? 'bg-[#24342f] shadow-lg text-primary' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Build Class
            </button>
            <button 
              onClick={() => setActiveClass('break')}
              className={`flex-1 py-3 text-sm font-black rounded-xl transition-all duration-300 ${activeClass === 'break' ? 'bg-[#2a231b] shadow-lg text-orange-500' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Break Class
            </button>
          </div>

          {/* Habit Grid */}
          {currentHabits.length === 0 ? (
            <div className="bg-white/5 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center gap-4 border border-dashed border-white/10">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-slate-700">
                <span className="material-symbols-outlined text-4xl">inventory_2</span>
              </div>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No habits in this class</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {currentHabits.map((habit) => (
                <HabitTile 
                  key={habit.id} 
                  habit={habit} 
                  onToggle={onToggleHabit} 
                  isLocked={habit.private && !user.isUnlocked}
                />
              ))}
              
              {/* Add New Placeholder Tile */}
              <button 
                onClick={() => navigate('/add')}
                className="aspect-[0.9/1] rounded-[2rem] border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-3 text-slate-600 hover:text-primary hover:border-primary/20 hover:bg-primary/5 transition-all group active:scale-95"
              >
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-all">
                  <span className="material-symbols-outlined text-2xl font-bold">add</span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">New Habit</span>
              </button>
            </div>
          )}
        </section>

        {/* Quick Actions Footer */}
        <section className="pt-2 pb-16 grid grid-cols-2 gap-4">
           <button 
            onClick={onOpenLock}
            className="flex items-center justify-center gap-3 p-5 rounded-[1.5rem] bg-surface-dark text-slate-400 border border-white/5 active:scale-95 transition-all"
           >
              <span className="material-symbols-outlined text-xl">shield_lock</span>
              <span className="text-[11px] font-black uppercase tracking-widest">Privacy Settings</span>
           </button>
           <button className="flex items-center justify-center gap-3 p-5 rounded-[1.5rem] bg-surface-dark text-slate-400 border border-white/5 active:scale-95 transition-all">
              <span className="material-symbols-outlined text-xl">notifications_active</span>
              <span className="text-[11px] font-black uppercase tracking-widest">Daily Focus</span>
           </button>
        </section>
      </main>

      <BottomNav active="home" />
    </div>
  );
};

export default DashboardScreen;
