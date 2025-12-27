
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface BottomNavProps {
  active: 'home' | 'analytics' | 'habits' | 'settings';
}

const BottomNav: React.FC<BottomNavProps> = ({ active }) => {
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[85%] bg-[#1c1c1e]/80 backdrop-blur-2xl border border-white/5 rounded-full px-10 py-5 shadow-2xl z-50">
      <div className="flex justify-between items-center max-w-[300px] mx-auto">
        <button onClick={() => navigate('/dashboard')} className={`flex flex-col items-center gap-1 transition-all ${active === 'home' ? 'text-primary' : 'text-slate-600'}`}>
          <span className={`material-symbols-outlined text-[28px] ${active === 'home' ? 'filled' : ''}`}>home</span>
          <span className="text-[10px] font-black uppercase tracking-widest">Home</span>
        </button>
        
        <button onClick={() => navigate('/insights')} className={`flex flex-col items-center gap-1 transition-all ${active === 'analytics' ? 'text-primary' : 'text-slate-600'}`}>
          <span className={`material-symbols-outlined text-[28px] ${active === 'analytics' ? 'filled' : ''}`}>bar_chart</span>
          <span className="text-[10px] font-black uppercase tracking-widest">Analytics</span>
        </button>
        
        <button onClick={() => navigate('/profile')} className={`flex flex-col items-center gap-1 transition-all ${active === 'settings' ? 'text-primary' : 'text-slate-600'}`}>
          <span className={`material-symbols-outlined text-[28px] ${active === 'settings' ? 'filled' : ''}`}>settings</span>
          <span className="text-[10px] font-black uppercase tracking-widest">Settings</span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNav;
