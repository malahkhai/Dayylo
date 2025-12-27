
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Habit } from '../types';

interface HabitDetailProps {
  habits: Habit[];
}

const HabitDetailScreen: React.FC<HabitDetailProps> = ({ habits }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const habit = habits.find(h => h.id === id);

  if (!habit) return <div className="p-10 text-center">Habit not found</div>;

  return (
    <div className="relative mx-auto flex h-full min-h-screen w-full max-w-md flex-col overflow-hidden bg-background-light dark:bg-background-dark shadow-2xl">
      <header className="sticky top-0 z-20 flex items-center justify-between bg-background-light/80 px-4 py-4 backdrop-blur-md dark:bg-background-dark/80">
        <button onClick={() => navigate(-1)} className="group flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-black/5 dark:hover:bg-white/10">
          <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>arrow_back_ios_new</span>
        </button>
        <h2 className="flex-1 text-center text-lg font-bold tracking-tight">{habit.name}</h2>
        <button className="flex h-10 items-center justify-center px-2">
          <span className="text-base font-semibold text-primary">Edit</span>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-24">
        <section className="flex flex-col items-center justify-center pb-8 pt-6">
          <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10 ring-1 ring-primary/20">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: '48px' }}>{habit.icon}</span>
          </div>
          <h1 className="text-6xl font-extrabold tracking-tighter text-slate-900 dark:text-white">{habit.streak}</h1>
          <p className="mt-1 text-base font-medium text-slate-500 dark:text-slate-400">
            {habit.type === 'break' ? 'Days Avoided' : 'Day Streak'}
          </p>
        </section>

        <section className="px-4 py-2">
          <div className="flex flex-col gap-4 rounded-3xl bg-white dark:bg-surface-dark/50 p-6 shadow-sm border border-slate-100 dark:border-white/5">
            <div className="flex items-center justify-between pb-2">
              <button className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-white/5">
                <span className="material-symbols-outlined text-slate-500" style={{ fontSize: '20px' }}>chevron_left</span>
              </button>
              <p className="text-base font-bold leading-tight">October 2024</p>
              <button className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-white/5">
                <span className="material-symbols-outlined text-slate-500" style={{ fontSize: '20px' }}>chevron_right</span>
              </button>
            </div>
            
            <div className="grid grid-cols-7 gap-y-2">
              {['S','M','T','W','T','F','S'].map((d, i) => (
                <div key={i} className="flex h-8 items-center justify-center text-[11px] font-bold uppercase tracking-wider text-slate-400">{d}</div>
              ))}
              {Array.from({length: 31}).map((_, i) => (
                <div key={i} className="flex aspect-square items-center justify-center relative">
                   {i === 11 && <div className="absolute inset-y-1 left-0 right-0 rounded-xl bg-primary/20"></div>}
                   <div className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-xl ${i === 11 ? 'bg-primary text-black font-bold' : ''}`}>
                      <span className="text-sm">{i + 1}</span>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex min-w-[158px] flex-1 flex-col gap-3 rounded-3xl bg-white dark:bg-surface-dark/50 p-6 shadow-sm border border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-2 text-slate-500">
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>military_tech</span>
                <p className="text-sm font-medium">Longest Streak</p>
              </div>
              <p className="text-3xl font-bold tracking-tight">45 <span className="text-lg font-medium text-slate-400">Days</span></p>
            </div>
            <div className="flex min-w-[158px] flex-1 flex-col gap-3 rounded-3xl bg-white dark:bg-surface-dark/50 p-6 shadow-sm border border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-2 text-slate-500">
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>shield_moon</span>
                <p className="text-sm font-medium">Success Rate</p>
              </div>
              <p className="text-3xl font-bold tracking-tight">88%</p>
            </div>
          </div>
        </section>

        <section className="px-8 py-4 text-center">
          <p className="text-sm font-medium leading-relaxed italic text-slate-400">
            "Discipline is doing what needs to be done, even if you don't want to do it."
          </p>
        </section>
      </main>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background-light via-background-light to-transparent dark:from-background-dark dark:via-background-dark dark:to-transparent pt-12">
        <button className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-primary px-6 py-4 shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined text-black" style={{ fontSize: '24px' }}>shield</span>
          <span className="text-lg font-bold text-black">
            {habit.completedToday ? 'Completed' : habit.type === 'break' ? 'Kept Clean Today' : 'Mark Completed'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default HabitDetailScreen;
