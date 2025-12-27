
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Habit } from '../types';
import BottomNav from '../components/BottomNav';

interface ProfileProps {
  user: User;
  habits: Habit[];
  onLogout: () => void;
  onDeleteAccount: () => void;
}

const ProfileScreen: React.FC<ProfileProps> = ({ user, habits, onLogout, onDeleteAccount }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'Statistics' | 'Habits'>('Statistics');
  
  // Weekly data (mocked for visualization)
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const buildActivity = [80, 60, 100, 40, 90, 70, 85]; // % completed
  const breakActivity = [100, 100, 0, 100, 100, 100, 100]; // % resisted (bad habits)

  const buildStats = [
    { label: 'Pages Read', value: '780', icon: 'menu_book' },
    { label: 'Walked', value: '413 km', icon: 'directions_walk' },
    { label: 'Meditated', value: '822 min', icon: 'self_improvement' },
  ];

  const longestStreak = {
    title: 'Longest Streak',
    subtitle: 'Standing',
    goal: 'Reading 10 pages',
    days: 78
  };

  return (
    <div className="flex flex-col h-screen bg-[#f6f8f7] dark:bg-background-dark pb-32 transition-colors">
      <main className="flex-1 overflow-y-auto no-scrollbar">
        {/* Profile Header */}
        <section className="flex flex-col items-center pt-16 pb-8">
          <p className="text-[14px] font-black uppercase tracking-[0.2em] mb-8 text-slate-400">Profile</p>
          
          <div className="relative mb-6">
             <div className="w-36 h-36 rounded-full border-8 border-white dark:border-white/5 shadow-2xl overflow-hidden ring-1 ring-black/5">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop" 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
             </div>
             <div className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-white dark:bg-surface-dark flex items-center justify-center shadow-xl border border-white dark:border-white/10">
                <span className="material-symbols-outlined text-orange-500 !text-[20px] filled">local_fire_department</span>
             </div>
          </div>
          
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Emma Jackson</h1>
          <p className="text-[12px] font-bold text-slate-400 mt-2 uppercase tracking-[0.2em] opacity-60">Since {user.joinDate || 'April 2024'}</p>
        </section>

        {/* Tab Navigation */}
        <section className="px-6 mb-8">
          <div className="bg-[#1c1c1e] p-1.5 rounded-2xl flex border border-white/5 shadow-inner">
            {['Statistics', 'Habits'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 py-3 text-[13px] font-black rounded-xl transition-all duration-300
                  ${activeTab === tab ? 'bg-white text-black shadow-lg scale-[1.02]' : 'text-slate-500 hover:text-slate-300'}
                `}
              >
                {tab}
              </button>
            ))}
          </div>
        </section>

        {/* Statistics View */}
        {activeTab === 'Statistics' && (
          <div className="px-6 space-y-8 animate-fade-in-up pb-12">
            
            {/* Longest Streak Highlight */}
            <div className="bg-[#ff5b22] rounded-[2.5rem] p-7 text-white shadow-2xl shadow-orange-500/30 relative overflow-hidden">
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 blur-[50px] rounded-full pointer-events-none"></div>
               <div className="flex justify-between items-start z-10 relative">
                  <div className="flex items-center gap-2.5">
                     <span className="material-symbols-outlined !text-[22px] filled text-white/80">local_fire_department</span>
                     <p className="text-[12px] font-black uppercase tracking-[0.15em] text-white/70">
                       {longestStreak.title} <span className="text-white/40 lowercase font-bold">{longestStreak.subtitle}</span>
                     </p>
                  </div>
                  <p className="text-5xl font-black tracking-tighter">{longestStreak.days}</p>
               </div>
               <div className="flex justify-between items-end mt-4 z-10 relative">
                  <p className="text-base font-bold max-w-[180px] leading-tight text-white/90">{longestStreak.goal}</p>
                  <p className="text-[11px] font-black uppercase tracking-widest text-white/50">Days</p>
               </div>
            </div>

            {/* Weekly Activity Summary */}
            <section className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 px-1">Weekly Activity</h3>
              
              {/* Build Summary */}
              <div className="bg-white dark:bg-surface-dark-alt rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Build Progress</p>
                  <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-md">82% Avg</span>
                </div>
                <div className="flex justify-between items-end h-16 gap-2">
                  {buildActivity.map((val, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full bg-slate-50 dark:bg-white/5 rounded-full overflow-hidden h-full flex items-end">
                        <div className="w-full bg-primary rounded-full transition-all duration-1000" style={{ height: `${val}%` }}></div>
                      </div>
                      <span className="text-[10px] font-black text-slate-400">{weekDays[i]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Break Summary with Privacy Protection */}
              <div className="relative overflow-hidden rounded-[2rem]">
                <div className={`bg-white dark:bg-surface-dark-alt rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-white/5 space-y-4 transition-all duration-500 ${!user.isUnlocked ? 'blur-xl opacity-30 pointer-events-none scale-[0.98]' : 'blur-0 opacity-100'}`}>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Break Resistance</p>
                    <span className="text-[10px] font-black text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-md">96% Clean</span>
                  </div>
                  <div className="flex justify-between items-end h-16 gap-2">
                    {breakActivity.map((val, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full bg-slate-50 dark:bg-white/5 rounded-full overflow-hidden h-full flex items-end">
                          <div className="w-full bg-orange-500 rounded-full transition-all duration-1000" style={{ height: `${val}%` }}></div>
                        </div>
                        <span className="text-[10px] font-black text-slate-400">{weekDays[i]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {!user.isUnlocked && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center z-10">
                    <div className="w-12 h-12 rounded-full bg-white dark:bg-surface-dark shadow-xl flex items-center justify-center border border-slate-100 dark:border-white/10">
                      <span className="material-symbols-outlined text-slate-400 !text-[24px]">lock</span>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-black text-slate-900 dark:text-white">Break Stats Locked</p>
                      <button 
                        onClick={() => navigate('/lock')}
                        className="text-[11px] font-black text-primary uppercase tracking-widest hover:opacity-80 transition-all"
                      >
                        Authenticate to View
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* General Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
               {buildStats.map((stat, i) => (
                 <div key={i} className="bg-white dark:bg-surface-dark-alt rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-white/5 flex flex-col items-center justify-center text-center gap-1.5">
                    <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{stat.value}</p>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                 </div>
               ))}
               <div className="col-span-2 bg-white dark:bg-surface-dark-alt rounded-[2rem] p-8 shadow-sm border border-slate-100 dark:border-white/5 flex flex-col items-center justify-center text-center gap-2">
                  <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">103,345 kg</p>
                  <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Total Weight Lifted</p>
               </div>
            </div>
            
            {/* Account Management Links */}
            <div className="pt-8 space-y-4">
               <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 text-slate-400 font-black text-xs uppercase tracking-widest py-4 bg-white dark:bg-surface-dark-alt rounded-2xl border border-slate-100 dark:border-white/5">
                  <span className="material-symbols-outlined !text-[18px]">logout</span>
                  Sign Out
               </button>
               <button onClick={onDeleteAccount} className="w-full text-center text-red-500/40 font-black text-[10px] uppercase tracking-[0.2em] pt-2">Delete Account</button>
            </div>
          </div>
        )}

        {/* Habits View */}
        {activeTab === 'Habits' && (
          <div className="px-6 py-4 animate-fade-in-up">
            <div className="grid grid-cols-1 gap-3">
              {habits.map(habit => (
                <div key={habit.id} className="bg-white dark:bg-surface-dark-alt rounded-2xl p-4 border border-slate-100 dark:border-white/5 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${habit.type === 'build' ? 'bg-primary/10 text-primary' : 'bg-orange-500/10 text-orange-500'}`}>
                    <span className="material-symbols-outlined">{habit.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{habit.name}</p>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{habit.streak} Day Streak</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <BottomNav active="settings" />
    </div>
  );
};

export default ProfileScreen;
