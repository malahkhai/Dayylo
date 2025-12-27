
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface BottomNavProps {
  active: 'home' | 'analytics' | 'habits' | 'settings';
}

const BottomNav: React.FC<BottomNavProps> = ({ active }) => {
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[92%] max-w-[400px] bg-white/90 dark:bg-[#13231f]/95 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2rem] px-6 py-4 shadow-[0_20px_50px_rgba(0,0,0,0.2)] z-50">
      <div className="flex justify-between items-center">
        <button onClick={() => navigate('/dashboard')} className={`flex flex-col items-center gap-1 group transition-all ${active === 'home' ? 'text-primary scale-110' : 'text-slate-400 opacity-60'}`}>
          <span className={`material-symbols-outlined text-2xl ${active === 'home' ? 'filled' : ''}`}>home</span>
          <span className="text-[10px] font-extrabold uppercase tracking-widest">Home</span>
        </button>
        <button onClick={() => navigate('/manage')} className={`flex flex-col items-center gap-1 group transition-all ${active === 'habits' ? 'text-primary scale-110' : 'text-slate-400 opacity-60'}`}>
          <span className={`material-symbols-outlined text-2xl ${active === 'habits' ? 'filled' : ''}`}>list_alt</span>
          <span className="text-[10px] font-extrabold uppercase tracking-widest">Habits</span>
        </button>
        <button onClick={() => navigate('/insights')} className={`flex flex-col items-center gap-1 group transition-all ${active === 'analytics' ? 'text-primary scale-110' : 'text-slate-400 opacity-60'}`}>
          <span className={`material-symbols-outlined text-2xl ${active === 'analytics' ? 'filled' : ''}`}>bar_chart</span>
          <span className="text-[10px] font-extrabold uppercase tracking-widest">Insights</span>
        </button>
        <button onClick={() => navigate('/profile')} className={`flex flex-col items-center gap-1 group transition-all ${active === 'settings' ? 'text-primary scale-110' : 'text-slate-400 opacity-60'}`}>
          <span className={`material-symbols-outlined text-2xl ${active === 'settings' ? 'filled' : ''}`}>settings</span>
          <span className="text-[10px] font-extrabold uppercase tracking-widest">Profile</span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNav;
