
import React, { useState, useEffect } from 'react';
import { Habit } from '../types';
import { getHabitInsights } from '../services/geminiService';
import BottomNav from '../components/BottomNav';

interface InsightsProps {
  habits: Habit[];
}

const InsightsScreen: React.FC<InsightsProps> = ({ habits }) => {
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');

  useEffect(() => {
    async function loadInsights() {
      const data = await getHabitInsights(habits);
      setInsights(data);
      setLoading(false);
    }
    loadInsights();
  }, [habits]);

  return (
    <div className="flex flex-col h-screen bg-background-dark text-white pb-24 relative overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-10 pb-4 sticky top-0 z-50 bg-background-dark/90 backdrop-blur-md">
        <h2 className="text-2xl font-bold tracking-tight">Insights</h2>
        <button className="flex items-center justify-center w-10 h-10 rounded-full bg-surface-dark text-white border border-white/5">
          <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>account_circle</span>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar px-6 pb-8 space-y-8">
        {/* Segmented Control */}
        <div className="bg-white/5 p-1 rounded-xl flex">
          {(['weekly', 'monthly', 'yearly'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg capitalize transition-all duration-200 ${
                timeFilter === filter ? 'bg-white/15 shadow-sm text-white' : 'text-slate-500'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Total Progress Section */}
        <div className="space-y-1">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Progress</p>
          <div className="flex items-center gap-3">
            <h1 className="text-5xl font-extrabold tracking-tighter">85%</h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary border border-primary/10">
              <span className="material-symbols-outlined text-sm font-bold">trending_up</span>
              +12%
            </span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed pt-1">
            You're more consistent than <strong className="text-slate-200 font-bold">92%</strong> of your previous weeks. Keep up the momentum!
          </p>
        </div>

        {/* Consistency Trend Card */}
        <div className="bg-surface-dark rounded-3xl p-6 border border-white/5 space-y-6 relative overflow-hidden group">
          <p className="text-sm font-bold text-slate-400">Consistency Trend</p>
          <div className="h-32 w-full relative">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 300 100">
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#137fec" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#137fec" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,80 Q40,85 75,65 T150,55 T225,40 T300,35" fill="none" stroke="#137fec" strokeWidth="3" strokeLinecap="round" />
              <path d="M0,80 Q40,85 75,65 T150,55 T225,40 T300,35 L300,100 L0,100 Z" fill="url(#lineGradient)" />
              {/* Data points */}
              <circle cx="105" cy="62" r="3.5" fill="#137fec" stroke="#050a08" strokeWidth="1" />
              <circle cx="190" cy="53" r="3.5" fill="#137fec" stroke="#050a08" strokeWidth="1" />
              <circle cx="280" cy="38" r="3.5" fill="#137fec" stroke="#050a08" strokeWidth="1" />
            </svg>
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>

        {/* Build/Break Summary Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Build Habits Card */}
          <div className="bg-surface-dark rounded-3xl p-5 border border-white/5 space-y-3 relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-xl font-bold">check_circle</span>
              </div>
              <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/10">+5%</span>
            </div>
            <div>
              <p className="text-3xl font-extrabold tracking-tight">15</p>
              <p className="text-[11px] font-bold text-slate-500 uppercase">Build Habits</p>
            </div>
            <div className="pt-2 h-6">
               <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 20">
                  <path d="M0,15 L20,12 L40,16 L60,11 L80,10 L100,5" fill="none" stroke="#30e8ab" strokeWidth="2" strokeLinecap="round" />
               </svg>
            </div>
          </div>
          {/* Resisted Card */}
          <div className="bg-surface-dark rounded-3xl p-5 border border-white/5 space-y-3 relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div className="w-9 h-9 rounded-full bg-orange-500/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-orange-500 text-xl font-bold">block</span>
              </div>
              <span className="text-[10px] font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-md border border-orange-500/10">+2%</span>
            </div>
            <div>
              <p className="text-3xl font-extrabold tracking-tight">3</p>
              <p className="text-[11px] font-bold text-slate-500 uppercase">Resisted</p>
            </div>
            <div className="pt-2 h-6">
               <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 20">
                  <path d="M0,5 L20,8 L40,7 L60,10 L80,11 L100,13" fill="none" stroke="#ff9f0a" strokeWidth="2" strokeLinecap="round" />
               </svg>
            </div>
          </div>
        </div>

        {/* Habit Density Section */}
        <div className="bg-surface-dark rounded-3xl p-6 border border-white/5 space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-base font-bold text-white">Habit Density</p>
            <button className="text-xs font-bold text-blue-500">View History</button>
          </div>
          <div className="grid grid-cols-8 gap-2">
            {/* Legend or Rows Label */}
            <div className="col-span-1 flex flex-col justify-between text-[10px] font-bold text-slate-600 py-1">
              <span>Mon</span><span>Wed</span><span>Fri</span>
            </div>
            {/* Grid Tiles */}
            <div className="col-span-7 grid grid-cols-7 gap-1.5">
              {[
                'empty', 'green-light', 'green-mid', 'orange-mid', 'green-mid', 'green-light', 'active',
                'green-mid', 'orange-mid', 'green-dark', 'empty', 'green-dark', 'orange-mid', 'empty',
                'green-mid', 'empty', 'green-mid', 'green-light', 'empty', 'green-light', 'empty'
              ].map((type, idx) => {
                let bgColor = 'bg-slate-800/40';
                if (type === 'green-light') bgColor = 'bg-primary/30';
                if (type === 'green-mid') bgColor = 'bg-primary/60';
                if (type === 'green-dark') bgColor = 'bg-primary/80';
                if (type === 'orange-mid') bgColor = 'bg-orange-500/70';
                
                return (
                  <div key={idx} className={`aspect-square rounded-[4px] relative ${bgColor} flex items-center justify-center`}>
                    {type === 'active' && (
                      <div className="w-full h-full rounded-[4px] bg-blue-500 flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                        <span className="material-symbols-outlined text-white text-[12px] font-bold">check</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Deep Dive Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold dark:text-white">Deep Dive</h3>
          <div className="flex flex-col gap-3">
            {loading ? (
              <div className="p-12 text-center flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                <p className="text-sm font-bold text-slate-500">AI Coach is analyzing patterns...</p>
              </div>
            ) : (
              insights.map((insight, i) => (
                <div key={i} className="flex items-start gap-4 p-5 rounded-3xl bg-surface-dark border border-white/5 animate-fade-in-up transition-all hover:bg-white/5" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className={`shrink-0 flex items-center justify-center w-11 h-11 rounded-2xl bg-white/5 text-slate-400 group-hover:text-primary transition-colors`}>
                    <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>{insight.icon}</span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <h4 className="text-base font-bold text-slate-100">{insight.title}</h4>
                    <p className="text-sm text-slate-400 leading-relaxed font-medium">{insight.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer Quote */}
        <div className="pt-8 pb-12 flex flex-col items-center gap-6">
          <p className="text-sm font-serif italic text-slate-500 text-center px-4">
            "Small steps every day add up to big results."
          </p>
          <div className="w-12 h-1 rounded-full bg-slate-800"></div>
        </div>
      </main>
      
      <BottomNav active="analytics" />
    </div>
  );
};

export default InsightsScreen;
