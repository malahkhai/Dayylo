
import React, { useState } from 'react';

interface OnboardingProps {
  onComplete: () => void;
}

interface SelectionHabit {
  id: string;
  name: string;
  category: string;
  icon: string;
  color: string;
}

const BREAK_OPTIONS: SelectionHabit[] = [
  { id: '1', name: 'No Sugar', category: 'Sweets & Desserts', icon: 'cookie', color: '#ff9f0a' },
  { id: '2', name: 'Limit Social', category: 'Digital Detox', icon: 'smartphone', color: '#ff3b30' },
  { id: '3', name: 'Quit Smoking', category: 'Health & Lungs', icon: 'smoke_free', color: '#93a5c8' },
  { id: '4', name: 'Dopamine Control', category: 'Dopamine control', icon: 'psychology', color: '#30e8ab' },
  { id: '5', name: 'No Alcohol', category: 'Clear Mind', icon: 'local_bar', color: '#ff9f0a' },
];

const OnboardingScreen: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  if (step === 1) {
    return (
      <div className="relative flex h-screen w-full flex-col bg-background-dark text-white overflow-hidden">
        <div className="flex w-full flex-row items-center justify-between px-6 py-8 pt-12">
          <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="flex-1 flex justify-center gap-1.5 px-4">
            <div className="h-1 flex-1 rounded-full bg-primary"></div>
            <div className="h-1 flex-1 rounded-full bg-white/10"></div>
          </div>
          <button onClick={onComplete} className="text-slate-500 font-bold text-sm">Skip</button>
        </div>

        <div className="px-6 pb-2">
          <h1 className="text-4xl font-black tracking-tight text-white leading-tight mb-4">
            How do you want <br />to grow?
          </h1>
          <p className="text-slate-400 text-base font-medium leading-relaxed">
            Choose your focus area. You can mix both Build and Break habits later.
          </p>
        </div>

        <div className="flex-1 flex flex-col gap-4 p-6 overflow-y-auto no-scrollbar pb-32">
          <button 
            onClick={() => setStep(2)}
            className="group relative overflow-hidden rounded-[2.5rem] bg-[#13231f] p-8 text-left border border-white/5"
          >
            <div className="flex items-center justify-center h-12 w-12 rounded-2xl bg-primary/20 text-primary mb-4">
              <span className="material-symbols-outlined text-3xl filled">spa</span>
            </div>
            <h3 className="text-2xl font-black text-white mb-2">Build Habits</h3>
            <p className="text-primary/70 text-sm font-bold">Cultivate positive routines like yoga, reading, or meditation.</p>
          </button>

          <button 
            onClick={() => setStep(2)}
            className="group relative overflow-hidden rounded-[2.5rem] bg-[#1c1c1e] p-8 text-left border border-white/5"
          >
            <div className="flex items-center justify-center h-12 w-12 rounded-2xl bg-orange-500/20 text-orange-500 mb-4">
              <span className="material-symbols-outlined text-3xl filled">block</span>
            </div>
            <h3 className="text-2xl font-black text-white mb-2">Break Habits</h3>
            <p className="text-slate-400 text-sm font-bold">Overcome dependencies and bad routines holding you back.</p>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-screen w-full flex-col bg-background-dark text-white overflow-hidden">
      <div className="flex w-full flex-row items-center justify-between px-6 py-8 pt-12">
        <button onClick={() => setStep(1)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex-1 flex justify-center gap-1.5 px-4">
          <div className="h-1 flex-1 rounded-full bg-primary/40"></div>
          <div className="h-1 flex-1 rounded-full bg-primary"></div>
        </div>
        <button onClick={onComplete} className="text-slate-500 font-bold text-sm">Skip</button>
      </div>

      <div className="px-6 pb-6">
        <h1 className="text-4xl font-black tracking-tight text-white leading-tight mb-4">
          What do you want <br />to <span className="text-orange-500">break free</span> from?
        </h1>
        <p className="text-slate-400 text-sm font-medium leading-relaxed">
          Select habits to reduce or avoid. We'll help you track your streak.
        </p>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4 p-6 overflow-y-auto no-scrollbar pb-32">
        {BREAK_OPTIONS.map((option) => (
          <button
            key={option.id}
            onClick={() => toggleSelection(option.id)}
            className={`relative flex flex-col items-start p-5 rounded-[2rem] border-2 transition-all duration-300 text-left
              ${selectedIds.includes(option.id) 
                ? 'bg-orange-950/20 border-orange-500 shadow-[0_0_20px_rgba(255,159,10,0.2)]' 
                : 'bg-white/5 border-transparent hover:bg-white/10'}
            `}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 
              ${selectedIds.includes(option.id) ? 'bg-orange-500 text-black' : 'bg-white/5 text-slate-400'}`}>
              <span className="material-symbols-outlined text-2xl filled">{option.icon}</span>
            </div>
            <h3 className="text-[15px] font-black text-white">{option.name}</h3>
            <p className="text-[11px] font-bold text-slate-500">{option.category}</p>
            
            <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
              ${selectedIds.includes(option.id) ? 'bg-orange-500 border-orange-500' : 'border-orange-500/30'}`}>
              {selectedIds.includes(option.id) && <span className="material-symbols-outlined text-black text-[14px] font-black">check</span>}
            </div>
          </button>
        ))}

        <button className="flex flex-col items-center justify-center p-5 rounded-[2rem] border-2 border-dashed border-white/10 bg-white/5 text-slate-500">
           <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-2">
             <span className="material-symbols-outlined">add</span>
           </div>
           <p className="text-xs font-black uppercase tracking-widest">Create New</p>
        </button>
      </div>

      <div className="absolute bottom-0 w-full p-8 pb-12 bg-gradient-to-t from-background-dark via-background-dark to-transparent flex items-center justify-center z-50">
        <button 
          onClick={onComplete}
          disabled={selectedIds.length === 0}
          className="w-full max-w-[320px] py-4 rounded-full font-black text-base bg-white text-black shadow-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
        >
          <span>Continue</span>
          <span className="bg-slate-100 px-2 py-0.5 rounded-md text-[10px] font-black">{selectedIds.length}</span>
        </button>
      </div>
    </div>
  );
};

export default OnboardingScreen;
