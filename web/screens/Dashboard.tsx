
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
  onUpdateHabitValue?: (id: string, delta: number) => void;
}

const DashboardScreen: React.FC<DashboardProps> = ({ habits, user, onToggleHabit, onOpenLock, onUpdateHabitValue }) => {
  const navigate = useNavigate();
  const [activeDate, setActiveDate] = useState(11);
  const [showBuildList, setShowBuildList] = useState(true);
  const [showBreakList, setShowBreakList] = useState(false);

  const buildHabits = habits.filter(h => h.type === 'build');
  const breakHabits = habits.filter(h => h.type === 'break');
  
  const completedBuild = buildHabits.filter(h => h.completedToday).length;
  const totalCompleted = habits.filter(h => h.completedToday).length;
  const progressPercent = habits.length > 0 ? Math.round((totalCompleted / habits.length) * 100) : 0;

  const dates = [
    { label: 'SA', num: 9 },
    { label: 'SU', num: 10 },
    { label: 'MO', num: 11 },
    { label: 'TU', num: 12 },
    { label: 'WE', num: 13 },
  ];

  return (
    <div className="flex flex-col h-screen bg-[#f6f8f7] dark:bg-background-dark transition-colors duration-200 overflow-hidden">
      <main className="flex-1 overflow-y-auto no-scrollbar pb-40">
        {/* Header Section */}
        <header className="px-6 pt-16 pb-6 flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Tuesday, Oct 24</p>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Dashboard</h1>
          </div>
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white dark:border-white/10 shadow-sm ring-1 ring-black/5">
            <img 
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
        </header>

        {/* Daily Progress Card */}
        <section className="px-6 mb-6">
          <div className="bg-white dark:bg-surface-dark-alt rounded-[2.5rem] p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white dark:border-white/5">
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Daily Progress</h3>
                <p className="text-sm font-medium text-slate-400">Keep up the momentum!</p>
              </div>
              <p className="text-4xl font-black text-[#137fec] tracking-tighter">{progressPercent}%</p>
            </div>
            
            <div className="w-full h-3 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden mb-5">
              <div 
                className="h-full bg-gradient-to-r from-[#137fec] to-[#59a8f5] rounded-full transition-all duration-1000"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {totalCompleted} of {habits.length} Habits Completed
              </p>
              <div className="flex items-center gap-1 text-primary">
                <span className="material-symbols-outlined !text-[18px] font-black">trending_up</span>
                <span className="text-[11px] font-black uppercase tracking-widest">On Track</span>
              </div>
            </div>
          </div>
        </section>

        {/* Streaks Grid */}
        <section className="px-6 grid grid-cols-2 gap-4 mb-8">
          <div className="bg-[#fff9f2] dark:bg-orange-950/20 rounded-[2.5rem] p-6 border border-orange-100 dark:border-orange-500/10">
            <div className="flex items-center gap-2 mb-4">
               <span className="text-orange-500 text-lg">🔥</span>
               <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Build Streak</span>
            </div>
            <div className="flex items-baseline gap-1">
              <p className="text-4xl font-black text-slate-900 dark:text-white">12</p>
              <p className="text-xs font-bold text-slate-400">Days</p>
            </div>
          </div>

          <div className="bg-[#f0f7ff] dark:bg-blue-950/20 rounded-[2.5rem] p-6 border border-blue-100 dark:border-blue-500/10">
            <div className="flex items-center gap-2 mb-4">
               <span className="material-symbols-outlined text-blue-500 !text-[18px] filled">shield</span>
               <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Break Streak</span>
            </div>
            <div className="flex items-baseline gap-1">
              <p className="text-4xl font-black text-slate-900 dark:text-white">5</p>
              <p className="text-xs font-bold text-slate-400">Days</p>
            </div>
          </div>
        </section>

        {/* Interactive Calendar Strip Section (Below Summary) */}
        <section className="px-6 mb-10">
           <div className="bg-[#1c1c1e] text-white p-4 rounded-[2.5rem] shadow-xl">
             <div className="flex items-center justify-between gap-2">
               {dates.map((d) => (
                 <div 
                   key={d.num}
                   onClick={() => setActiveDate(d.num)}
                   className={`flex-1 flex flex-col items-center justify-center h-16 rounded-2xl transition-all cursor-pointer border
                     ${activeDate === d.num ? 'bg-white text-black border-white shadow-lg' : 'bg-white/5 text-slate-500 border-white/5'}
                   `}
                 >
                   <span className={`text-[9px] font-black uppercase tracking-widest mb-1 ${activeDate === d.num ? 'opacity-60' : 'opacity-40'}`}>
                     {d.label}
                   </span>
                   <span className="text-base font-black tracking-tight">{d.num}</span>
                 </div>
               ))}
             </div>
           </div>
        </section>

        {/* Your Habits Section */}
        <section className="px-6">
          <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6">Your Habits</h2>
          
          <div className="space-y-4">
            {/* Build Habits Category Card */}
            <div className="bg-white dark:bg-surface-dark-alt rounded-[2.5rem] p-5 shadow-sm border border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-[#f0f7ff] dark:bg-blue-500/10 flex items-center justify-center text-[#137fec]">
                  <span className="material-symbols-outlined !text-[32px] filled">fitness_center</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">Build Habits</h3>
                  <p className="text-sm font-bold text-slate-400">
                    {buildHabits.length} Active • {completedBuild} Completed Today
                  </p>
                  <button 
                    onClick={() => setShowBuildList(!showBuildList)}
                    className="mt-2 text-[#137fec] text-xs font-black uppercase tracking-widest flex items-center gap-1"
                  >
                    {showBuildList ? 'Hide List' : 'View List'}
                    <span className={`material-symbols-outlined !text-[16px] transition-transform ${showBuildList ? 'rotate-90' : ''}`}>chevron_right</span>
                  </button>
                </div>
              </div>
              
              {showBuildList && (
                <div className="mt-6 pt-6 border-t border-slate-50 dark:border-white/5 animate-fade-in-up">
                  {buildHabits.map(habit => (
                    <HabitTile key={habit.id} habit={habit} onToggle={onToggleHabit} onUpdateValue={onUpdateHabitValue} />
                  ))}
                </div>
              )}
            </div>

            {/* Break Habits Category Card */}
            <div className="bg-white dark:bg-surface-dark-alt rounded-[2.5rem] p-5 shadow-sm border border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400/20 to-red-400/20 flex items-center justify-center text-orange-600 relative overflow-hidden">
                  <div className="absolute inset-0 bg-orange-400/5 blur-lg"></div>
                  <span className="material-symbols-outlined !text-[32px] filled z-10">lock</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">Break Habits</h3>
                    <span className="bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded text-[10px] font-black text-slate-400 uppercase tracking-widest">Locked</span>
                  </div>
                  <p className="text-sm font-bold text-slate-400">
                    {breakHabits.length} Active • Protected View
                  </p>
                  
                  {!user.isUnlocked ? (
                    <button 
                      onClick={onOpenLock}
                      className="mt-3 px-4 py-2 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white text-[11px] font-black uppercase tracking-widest flex items-center gap-2 border border-slate-100 dark:border-white/10"
                    >
                      <span className="material-symbols-outlined !text-[16px]">face</span>
                      Unlock to View
                    </button>
                  ) : (
                    <button 
                      onClick={() => setShowBreakList(!showBreakList)}
                      className="mt-2 text-orange-500 text-xs font-black uppercase tracking-widest flex items-center gap-1"
                    >
                      {showBreakList ? 'Hide List' : 'View List'}
                      <span className={`material-symbols-outlined !text-[16px] transition-transform ${showBreakList ? 'rotate-90' : ''}`}>chevron_right</span>
                    </button>
                  )}
                </div>
              </div>

              {user.isUnlocked && showBreakList && (
                <div className="mt-6 pt-6 border-t border-slate-50 dark:border-white/5 animate-fade-in-up">
                  {breakHabits.map(habit => (
                    <HabitTile key={habit.id} habit={habit} onToggle={onToggleHabit} onUpdateValue={onUpdateHabitValue} />
                  ))}
                </div>
              )}
            </div>
          </div>

          <button 
            onClick={() => navigate('/add')}
            className="w-full mt-8 flex items-center justify-center gap-2 py-4 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-white/10 text-slate-400 font-black text-sm hover:text-primary transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined">add</span>
            New Habit
          </button>
        </section>
      </main>

      <BottomNav active="home" />
    </div>
  );
};

export default DashboardScreen;
