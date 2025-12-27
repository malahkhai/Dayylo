
import React from 'react';

interface OnboardingProps {
  onComplete: () => void;
}

const OnboardingScreen: React.FC<OnboardingProps> = ({ onComplete }) => {
  return (
    <div className="relative flex h-screen w-full flex-col bg-background-dark text-white overflow-hidden">
      {/* Header / Page Indicator */}
      <div className="flex w-full flex-row items-center justify-center gap-3 py-8 pt-12">
        <div className="h-1.5 w-6 rounded-full bg-primary shadow-[0_0_8px_rgba(48,232,171,0.5)]"></div>
        <div className="h-1.5 w-1.5 rounded-full bg-white/20"></div>
        <div className="h-1.5 w-1.5 rounded-full bg-white/20"></div>
      </div>

      {/* Headline */}
      <div className="px-6 pb-2">
        <h1 className="text-3xl font-bold tracking-tight text-white leading-tight mb-2">
          How do you want <br />to grow?
        </h1>
        <p className="text-slate-400 text-base font-normal leading-relaxed">
          Choose the path that fits your goals. You can always add more later.
        </p>
      </div>

      {/* Cards Container */}
      <div className="flex-1 flex flex-col gap-6 p-6 overflow-y-auto no-scrollbar pb-32">
        {/* Build Habits Card */}
        <div className="group relative overflow-hidden rounded-[2rem] bg-[#13231f] p-6 shadow-xl ring-1 ring-white/10 transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/20 text-primary">
              <span className="material-symbols-outlined text-2xl font-bold">spa</span>
            </div>
          </div>
          
          <div className="space-y-2 mb-4">
            <h3 className="text-2xl font-extrabold tracking-tight text-white">Build Habits</h3>
            <p className="text-primary/80 text-[14px] font-bold leading-relaxed">
              Cultivate routines that empower you like Meditation, Reading, or Fitness.
            </p>
          </div>
          
          <div className="w-full h-40 rounded-2xl bg-slate-800 relative overflow-hidden ring-1 ring-white/5 mb-4">
            <img 
              src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000&auto=format&fit=crop" 
              className="w-full h-full object-cover"
              alt="Nature leaf growth"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          </div>

          <button 
            onClick={onComplete}
            className="w-full py-3.5 rounded-2xl font-bold text-sm bg-[#1a3a31] text-primary hover:bg-primary hover:text-background-dark transition-all flex items-center justify-center"
          >
            Start Building
          </button>
        </div>

        {/* Break Habits Card */}
        <div className="group relative overflow-hidden rounded-[2rem] bg-[#1c1c1e] p-6 shadow-xl ring-1 ring-white/10 transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-orange-500/20 text-orange-500">
              <span className="material-symbols-outlined text-2xl font-bold">block</span>
            </div>
          </div>
          
          <div className="space-y-2 mb-4">
            <h3 className="text-2xl font-extrabold tracking-tight text-white">Break Habits</h3>
            <p className="text-[#93a5c8] text-[14px] font-bold leading-relaxed">
              Eliminate behaviors that hold you back like Smoking, Social Media, or Sugar.
            </p>
          </div>
          
          <div className="w-full h-40 rounded-2xl bg-slate-800 relative overflow-hidden ring-1 ring-white/5 mb-4">
            <img 
              src="https://images.unsplash.com/photo-1516410529446-2c777cb7366d?q=80&w=1000&auto=format&fit=crop" 
              className="w-full h-full object-cover grayscale opacity-60"
              alt="Dark aesthetic focus"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>

          <button 
            onClick={onComplete}
            className="w-full py-3.5 rounded-2xl font-bold text-sm bg-white/5 text-[#93a5c8] hover:bg-white/10 hover:text-white transition-all flex items-center justify-center"
          >
            Start Breaking
          </button>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="absolute bottom-0 w-full p-8 pb-10 bg-gradient-to-t from-background-dark via-background-dark/95 to-transparent flex items-center justify-center z-50">
        <button 
          onClick={onComplete}
          className="w-full max-w-[320px] py-4 rounded-full font-bold text-base bg-white text-black shadow-2xl transition-all active:scale-[0.98]"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default OnboardingScreen;
