
import React from 'react';

interface PaywallProps {
  onClose: () => void;
}

const PaywallScreen: React.FC<PaywallProps> = ({ onClose }) => {
  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-hidden mx-auto bg-background-light dark:bg-background-dark shadow-2xl animate-fade-in-up">
      {/* Background Gradient Glow */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/10 to-transparent pointer-events-none z-0"></div>
      
      {/* Top Bar / Close */}
      <div className="relative z-10 flex items-center justify-end p-6 pb-2">
        <button 
          onClick={onClose}
          className="group flex items-center justify-center w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-colors backdrop-blur-sm"
        >
          <span className="material-symbols-outlined text-slate-600 dark:text-slate-200 !text-[20px] font-medium">close</span>
        </button>
      </div>

      {/* Scrollable Content Area */}
      <div className="relative z-10 flex-1 overflow-y-auto no-scrollbar px-6 pb-48">
        {/* Hero Illustration */}
        <div className="flex justify-center mb-6 mt-2">
          <div className="relative w-32 h-32 flex items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 shadow-inner ring-1 ring-white/10">
            <div className="absolute inset-0 bg-white/5 blur-xl rounded-full"></div>
            <span className="material-symbols-outlined text-primary !text-[64px] drop-shadow-[0_0_15px_rgba(48,232,171,0.5)]">diamond</span>
          </div>
        </div>

        {/* Headlines */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-3 text-slate-900 dark:text-white leading-tight">
            Level Up <br/> Your Habits
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed max-w-[280px] mx-auto">
            Unlock your full potential with advanced tools designed for growth.
          </p>
        </div>

        {/* Comparison Toggle */}
        <div className="bg-white/50 dark:bg-surface-dark backdrop-blur-md rounded-2xl p-1 mb-8 ring-1 ring-black/5 dark:ring-white/5 flex relative">
          <div className="w-1/2 text-center py-2 text-sm font-medium text-slate-500 dark:text-slate-400">Free</div>
          <div className="w-1/2 text-center py-2 text-sm font-bold text-slate-900 dark:text-white bg-white dark:bg-surface-dark/40 rounded-xl shadow-sm ring-1 ring-black/5 dark:ring-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5"></div>
            <span className="relative z-10">Premium</span>
          </div>
        </div>

        {/* Feature List */}
        <div className="space-y-3 mb-8">
          {/* Unlimited Habits */}
          <div className="flex items-center p-4 bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-white/5 shadow-sm transition-transform hover:scale-[1.01]">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center mr-4 text-pink-500">
              <span className="material-symbols-outlined !text-[24px]">all_inclusive</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Unlimited Habits</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Track as many goals as you want</p>
            </div>
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-black">
              <span className="material-symbols-outlined !text-[16px] font-bold">check</span>
            </div>
          </div>

          {/* Advanced Analytics */}
          <div className="flex items-center p-4 bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-white/5 shadow-sm transition-transform hover:scale-[1.01]">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mr-4 text-blue-400">
              <span className="material-symbols-outlined !text-[24px]">monitoring</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Advanced Analytics</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Detailed charts and trend insights</p>
            </div>
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-black">
              <span className="material-symbols-outlined !text-[16px] font-bold">check</span>
            </div>
          </div>

          {/* Cloud Sync */}
          <div className="flex items-center p-4 bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-white/5 shadow-sm transition-transform hover:scale-[1.01]">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center mr-4 text-orange-400">
              <span className="material-symbols-outlined !text-[24px]">cloud_sync</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Cloud Sync</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Backup and sync across devices</p>
            </div>
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-black">
              <span className="material-symbols-outlined !text-[16px] font-bold">check</span>
            </div>
          </div>

          {/* Custom Themes */}
          <div className="flex items-center p-4 bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-white/5 shadow-sm transition-transform hover:scale-[1.01]">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mr-4 text-purple-400">
              <span className="material-symbols-outlined !text-[24px]">palette</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Custom Themes</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Personalize with premium colors</p>
            </div>
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-black">
              <span className="material-symbols-outlined !text-[16px] font-bold">check</span>
            </div>
          </div>
        </div>

        {/* Social Proof */}
        <div className="flex items-center justify-center gap-2 mb-8 opacity-80">
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-background-light dark:border-background-dark overflow-hidden bg-slate-200 shadow-sm">
                <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Join 10k+ Premium Users</p>
        </div>
      </div>

      {/* Sticky Bottom CTA */}
      <div className="absolute bottom-0 left-0 w-full bg-white/80 dark:bg-background-dark/80 backdrop-blur-lg border-t border-slate-200 dark:border-white/5 p-6 z-20 pb-8">
        <div className="flex flex-col gap-4">
          {/* Pricing Info */}
          <div className="flex items-baseline justify-between px-2">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Total today</span>
            <div className="text-right">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">$4.99</span>
              <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">/ month</span>
            </div>
          </div>
          {/* Main Button */}
          <button className="w-full bg-primary hover:bg-[#25d39a] active:scale-[0.98] transition-all duration-200 rounded-2xl py-4 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(48,232,171,0.3)] group cursor-pointer">
            <span className="text-black font-bold text-lg leading-tight">Start 7-Day Free Trial</span>
            <span className="text-black/70 text-xs font-medium mt-0.5 group-hover:text-black/90">Then $4.99/mo. Cancel anytime.</span>
          </button>
          {/* Links */}
          <div className="flex items-center justify-center gap-6 mt-1">
            <button className="text-xs text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors font-medium">Restore Purchase</button>
            <button className="text-xs text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors font-medium">Terms of Service</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaywallScreen;
