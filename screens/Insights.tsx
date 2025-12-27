
import React, { useState, useEffect } from 'react';
import { Habit } from '../types';
import { getHabitInsights, getAIRoast } from '../services/geminiService';
import BottomNav from '../components/BottomNav';

interface InsightsProps {
  habits: Habit[];
}

const InsightsScreen: React.FC<InsightsProps> = ({ habits }) => {
  const [insights, setInsights] = useState<any[]>([]);
  const [roast, setRoast] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [loadingRoast, setLoadingRoast] = useState(true);
  const [timeFilter, setTimeFilter] = useState<'Weekly' | 'Monthly' | 'Yearly'>('Weekly');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setLoadingRoast(true);
      
      const [insightsData, roastData] = await Promise.all([
        getHabitInsights(habits),
        getAIRoast(habits)
      ]);
      
      setInsights(insightsData);
      setRoast(roastData);
      setLoading(false);
      setLoadingRoast(false);
    }
    loadData();
  }, [habits]);

  return (
    <div className="flex flex-col h-screen bg-background-dark text-white pb-32 relative overflow-hidden transition-colors duration-200">
      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-12 pb-4 sticky top-0 z-50 bg-background-dark/95 backdrop-blur-xl">
        <h2 className="text-2xl font-black tracking-tight">Insights</h2>
        <div className="h-10 w-10 rounded-full bg-surface-dark flex items-center justify-center border border-white/10">
          <span className="material-symbols-outlined text-slate-400">account_circle</span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar px-6 pb-8 space-y-8 animate-fade-in-up">
        {/* Segmented Control */}
        <div className="bg-[#1c1c1e] p-1 rounded-2xl flex border border-white/5">
          {(['Weekly', 'Monthly', 'Yearly'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${
                timeFilter === filter ? 'bg-[#3a3a3c] shadow-lg text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Total Progress Section */}
        <div className="space-y-2">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Total Progress</p>
          <div className="flex items-center gap-4">
            <h1 className="text-6xl font-black tracking-tighter">85%</h1>
            <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-black text-primary border border-primary/20">
              <span className="material-symbols-outlined text-sm font-black">trending_up</span>
              +12%
            </div>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed pt-1 font-medium">
            You're more consistent than <strong className="text-slate-100 font-bold">92%</strong> of your previous weeks. Keep up the momentum!
          </p>
        </div>

        {/* Consistency Trend Card */}
        <div className="bg-surface-dark rounded-[2.5rem] p-7 border border-white/5 space-y-6 relative overflow-hidden shadow-2xl">
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Consistency Trend</p>
          <div className="h-32 w-full relative mt-4">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 300 100">
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#137fec" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#137fec" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,80 Q40,85 75,65 T150,55 T225,40 T300,35" fill="none" stroke="#137fec" strokeWidth="4" strokeLinecap="round" />
              <path d="M0,80 Q40,85 75,65 T150,55 T225,40 T300,35 L300,100 L0,100 Z" fill="url(#lineGradient)" />
              <circle cx="110" cy="62" r="4" fill="#137fec" stroke="#13231f" strokeWidth="2" />
              <circle cx="180" cy="55" r="4" fill="#137fec" stroke="#13231f" strokeWidth="2" />
              <circle cx="280" cy="38" r="4" fill="#137fec" stroke="#13231f" strokeWidth="2" />
            </svg>
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 font-black uppercase tracking-widest pt-2">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>

        {/* AI Roast/Praise Box */}
        <div className="bg-gradient-to-br from-[#13231f] to-[#0a1512] rounded-[2rem] p-6 border border-primary/20 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10">
             <span className="material-symbols-outlined text-6xl">psychology</span>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-xl font-bold">auto_awesome</span>
            </div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary">AI Performance Review</h4>
          </div>
          
          {loadingRoast ? (
            <div className="space-y-2">
              <div className="h-4 bg-white/5 rounded-full w-full animate-pulse"></div>
              <div className="h-4 bg-white/5 rounded-full w-3/4 animate-pulse"></div>
            </div>
          ) : (
            <p className="text-base font-bold text-slate-100 leading-relaxed italic">
              "{roast}"
            </p>
          )}
        </div>

        {/* Build/Break Summary Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface-dark rounded-[2rem] p-6 border border-white/5 space-y-4 shadow-lg">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-2xl font-bold">check_circle</span>
              </div>
              <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-1 rounded-lg border border-primary/10">+5%</span>
            </div>
            <div>
              <p className="text-4xl font-black tracking-tighter">15</p>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Build Habits</p>
            </div>
            <div className="pt-2 h-8">
               <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 20">
                  <path d="M0,15 L20,12 L40,16 L60,11 L80,10 L100,5" fill="none" stroke="#30e8ab" strokeWidth="3" strokeLinecap="round" />
               </svg>
            </div>
          </div>

          <div className="bg-surface-dark rounded-[2rem] p-6 border border-white/5 space-y-4 shadow-lg">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-orange-500 text-2xl font-bold">block</span>
              </div>
              <span className="text-[10px] font-black text-orange-500 bg-orange-500/10 px-2 py-1 rounded-lg border border-orange-500/10">+2%</span>
            </div>
            <div>
              <p className="text-4xl font-black tracking-tighter">3</p>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Resisted</p>
            </div>
            <div className="pt-2 h-8">
               <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 20">
                  <path d="M0,5 L20,8 L40,7 L60,10 L80,11 L100,13" fill="none" stroke="#ff9f0a" strokeWidth="3" strokeLinecap="round" />
               </svg>
            </div>
          </div>
        </div>

        {/* Habit Density Section */}
        <div className="bg-surface-dark rounded-[2.5rem] p-7 border border-white/5 space-y-6 shadow-lg">
          <div className="flex items-center justify-between">
            <p className="text-lg font-black tracking-tight">Habit Density</p>
            <button className="text-xs font-black text-primary uppercase tracking-widest hover:opacity-80 transition-opacity">View History</button>
          </div>
          <div className="grid grid-cols-8 gap-3">
            <div className="col-span-1 flex flex-col justify-between text-[10px] font-black text-slate-600 py-1 uppercase">
              <span>Mon</span><span>Wed</span><span>Fri</span>
            </div>
            <div className="col-span-7 grid grid-cols-7 gap-2">
              {[
                'empty', 'green-light', 'green-mid', 'orange-mid', 'green-mid', 'green-light', 'active',
                'green-mid', 'orange-mid', 'green-dark', 'empty', 'green-dark', 'orange-mid', 'empty',
                'green-mid', 'empty', 'green-mid', 'green-light', 'empty', 'green-light', 'empty'
              ].map((type, idx) => {
                let bgColor = 'bg-white/5';
                if (type === 'green-light') bgColor = 'bg-primary/20';
                if (type === 'green-mid') bgColor = 'bg-primary/50';
                if (type === 'green-dark') bgColor = 'bg-primary/80';
                if (type === 'orange-mid') bgColor = 'bg-orange-500/50';
                
                return (
                  <div key={idx} className={`aspect-square rounded-lg relative ${bgColor} flex items-center justify-center transition-transform hover:scale-110 cursor-pointer`}>
                    {type === 'active' && (
                      <div className="w-full h-full rounded-lg bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(48,232,171,0.4)]">
                        <span className="material-symbols-outlined text-black text-[14px] font-black">check</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Deep Dive Section */}
        <div className="space-y-6 pt-4">
          <h3 className="text-2xl font-black tracking-tight">Deep Dive</h3>
          <div className="flex flex-col gap-4">
            {loading ? (
              <div className="p-12 text-center flex flex-col items-center gap-4 bg-white/5 rounded-[2rem]">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <p className="text-sm font-black text-slate-500 uppercase tracking-widest">Analyzing Patterns...</p>
              </div>
            ) : (
              insights.map((insight, i) => (
                <div key={i} className="flex items-start gap-5 p-6 rounded-[2rem] bg-surface-dark border border-white/5 hover:bg-white/5 transition-all cursor-pointer group shadow-md" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl bg-white/5 text-slate-500 group-hover:text-primary group-hover:bg-primary/10 transition-all">
                    <span className="material-symbols-outlined" style={{ fontSize: '26px' }}>{insight.icon}</span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <h4 className="text-lg font-black text-slate-100 tracking-tight">{insight.title}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed font-bold">{insight.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer Quote */}
        <div className="pt-8 pb-16 flex flex-col items-center gap-8 opacity-50">
          <p className="text-sm font-medium italic text-slate-400 text-center px-12 leading-relaxed">
            "Your future is hidden in your daily routine."
          </p>
          <div className="w-16 h-1 rounded-full bg-slate-800"></div>
        </div>
      </main>
      
      <BottomNav active="analytics" />
    </div>
  );
};

export default InsightsScreen;
