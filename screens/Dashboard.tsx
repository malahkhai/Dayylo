
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Habit, User } from '../types';
import BottomNav from '../components/BottomNav';

interface DashboardProps {
  habits: Habit[];
  user: User;
  onToggleHabit: (id: string) => void;
  onOpenLock: () => void;
}

const DashboardScreen: React.FC<DashboardProps> = ({ habits, user, onToggleHabit, onOpenLock }) => {
  const navigate = useNavigate();
  
  const buildHabits = habits.filter(h => h.type === 'build');
  const breakHabits = habits.filter(h => h.type === 'break');
  
  const totalCompleted = habits.filter(h => h.completedToday).length;
  const progressPercent = habits.length > 0 ? Math.round((totalCompleted / habits.length) * 100) : 0;
  
  const buildCompletedCount = buildHabits.filter(h => h.completedToday).length;
  const breakCompletedCount = breakHabits.filter(h => h.completedToday).length;

  return (
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark pb-32 relative overflow-hidden transition-colors duration-200">
      {/* Background Accent Blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-primary/5 dark:bg-primary/10 blur-[100px] pointer-events-none z-0"></div>

      {/* Header */}
      <header className="flex flex-col px-6 pt-12 pb-4 z-10">
        <div className="flex items-end justify-between">
          <div className="flex flex-col">
            <h2 className="text-slate-400 dark:text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </h2>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Dashboard</h1>
          </div>
          <div 
            onClick={() => navigate('/profile')}
            className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden border border-slate-300 dark:border-white/10 cursor-pointer hover:scale-105 active:scale-95 transition-all"
          >
            <img 
              className="h-full w-full object-cover" 
              alt="User" 
              src="https://i.pravatar.cc/100?img=12"
            />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar px-6 space-y-6 pt-2 z-10">
        {/* Daily Progress Section */}
        <section className="bg-white dark:bg-surface-dark rounded-[2.5rem] p-6 shadow-sm border border-slate-100 dark:border-white/5">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Daily Progress</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5 font-medium">Keep up the momentum!</p>
            </div>
            <div className="text-right">
              <span className="text-4xl font-black text-primary tracking-tighter">{progressPercent}%</span>
            </div>
          </div>
          
          <div className="h-4 w-full bg-slate-100 dark:bg-slate-800/50 rounded-full overflow-hidden mb-4">
            <div 
              className="h-full bg-gradient-to-r from-primary to-[#5ac8fa] rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(48,232,171,0.3)]" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          <div className="flex justify-between items-center text-sm font-bold">
            <span className="text-slate-900 dark:text-white">{totalCompleted} of {habits.length} Habits Completed</span>
            <span className="text-primary flex items-center gap-1">
              <span className="material-symbols-outlined text-sm font-bold">trending_up</span> On Track
            </span>
          </div>
        </section>

        {/* Streak Grid */}
        <section className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-surface-dark rounded-[2rem] p-5 border border-slate-100 dark:border-white/5 flex flex-col justify-between h-36 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-orange-100 dark:bg-orange-900/10 rounded-full blur-2xl"></div>
            <div className="flex items-center gap-2 z-10">
              <span className="material-symbols-outlined text-orange-500 filled !text-[20px]">local_fire_department</span>
              <span className="text-[10px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest">Build Streak</span>
            </div>
            <div className="z-10 mt-4">
              <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">12</span>
              <span className="text-sm font-bold text-slate-400 ml-1.5 uppercase tracking-widest">Days</span>
            </div>
          </div>

          <div className="bg-white dark:bg-surface-dark rounded-[2rem] p-5 border border-slate-100 dark:border-white/5 flex flex-col justify-between h-36 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-blue-100 dark:bg-blue-900/10 rounded-full blur-2xl"></div>
            <div className="flex items-center gap-2 z-10">
              <span className="material-symbols-outlined text-blue-500 !text-[20px]">shield</span>
              <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Break Streak</span>
            </div>
            <div className="z-10 mt-4">
              <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">5</span>
              <span className="text-sm font-bold text-slate-400 ml-1.5 uppercase tracking-widest">Days</span>
            </div>
          </div>
        </section>

        {/* Habits Overview */}
        <section className="space-y-4">
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white px-1 tracking-tight">Your Habits</h3>
          
          {/* Build Habits Category */}
          <div 
            onClick={() => navigate('/manage')}
            className="bg-white dark:bg-surface-dark rounded-[2rem] p-4 border border-slate-100 dark:border-white/5 flex gap-5 items-center cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 active:scale-[0.98] transition-all"
          >
            <div className="w-20 h-20 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex-shrink-0 flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-blue-500">fitness_center</span>
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-extrabold text-slate-900 dark:text-white leading-tight">Build Habits</h4>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{buildHabits.length} Active • {buildCompletedCount} Completed Today</p>
              <div className="mt-2 flex items-center text-primary font-bold text-xs uppercase tracking-widest">
                View List <span className="material-symbols-outlined text-base ml-0.5">chevron_right</span>
              </div>
            </div>
          </div>

          {/* Break Habits Category (Locked state) */}
          <div 
            className="bg-white dark:bg-surface-dark rounded-[2rem] p-4 border border-slate-100 dark:border-white/5 flex gap-5 items-center relative overflow-hidden group"
          >
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl flex-shrink-0 relative overflow-hidden">
               <div className="absolute inset-0 bg-red-500/10 backdrop-blur-md flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl text-slate-300 dark:text-slate-600">lock</span>
               </div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-lg font-extrabold text-slate-900 dark:text-white leading-tight">Break Habits</h4>
                <span className="bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md text-slate-500 border border-slate-200 dark:border-white/5">Locked</span>
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{breakHabits.length} Active • Protected View</p>
              <button 
                onClick={onOpenLock}
                className="mt-2 flex items-center gap-1.5 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-900 dark:text-white text-xs font-bold py-2 px-4 rounded-xl transition-all border border-slate-200 dark:border-white/5"
              >
                <span className="material-symbols-outlined text-sm">face</span>
                Unlock to View
              </button>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="pt-2 pb-12">
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white px-1 mb-4 tracking-tight">Quick Actions</h3>
          <div className="grid grid-cols-3 gap-3">
            <button 
              onClick={() => navigate('/add')}
              className="flex flex-col items-center justify-center gap-2 p-5 rounded-[2rem] bg-primary text-white shadow-lg shadow-primary/20 active:scale-95 transition-all"
            >
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-white/20">
                <span className="material-symbols-outlined text-2xl font-bold">add</span>
              </div>
              <span className="text-[11px] font-black uppercase tracking-widest">Add Habit</span>
            </button>
            
            <button className="flex flex-col items-center justify-center gap-2 p-5 rounded-[2rem] bg-white dark:bg-surface-dark text-slate-900 dark:text-white border border-slate-100 dark:border-white/5 active:scale-95 transition-all">
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-500">
                <span className="material-symbols-outlined text-2xl">notifications</span>
              </div>
              <span className="text-[11px] font-black uppercase tracking-widest">Reminders</span>
            </button>
            
            <button 
              onClick={onOpenLock}
              className="flex flex-col items-center justify-center gap-2 p-5 rounded-[2rem] bg-white dark:bg-surface-dark text-slate-900 dark:text-white border border-slate-100 dark:border-white/5 active:scale-95 transition-all"
            >
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-50 dark:bg-white/5 text-slate-400">
                <span className="material-symbols-outlined text-2xl">shield_lock</span>
              </div>
              <span className="text-[11px] font-black uppercase tracking-widest">Privacy</span>
            </button>
          </div>
        </section>
      </main>

      <BottomNav active="home" />
    </div>
  );
};

export default DashboardScreen;
