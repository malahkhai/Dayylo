
import React, { useEffect } from 'react';

interface LockScreenProps {
  onUnlock: () => void;
  onCancel: () => void;
}

const LockScreen: React.FC<LockScreenProps> = ({ onUnlock, onCancel }) => {
  useEffect(() => {
    // Simulate Face ID scanning
    const timer = setTimeout(() => {
      onUnlock();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onUnlock]);

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-background-dark text-white">
      <header className="flex w-full items-center justify-end p-4 z-20">
        <button onClick={onCancel} className="flex items-center justify-center rounded-full py-2 px-4 transition-colors hover:bg-white/5 active:bg-white/10">
          <p className="text-primary text-base font-semibold leading-normal tracking-[0.015em]">Cancel</p>
        </button>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 pb-20 relative w-full max-w-md mx-auto z-10">
        <div className="relative mb-8 flex items-center justify-center">
          <div className="absolute inset-0 -m-4 rounded-3xl border-2 border-primary/10 animate-pulse"></div>
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-[3px] border-primary/30 bg-background-dark shadow-[0_0_40px_-10px_rgba(48,110,232,0.3)]">
            <span className="material-symbols-outlined text-[48px] text-primary fill-1">face</span>
          </div>
          <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary ring-4 ring-background-dark">
            <span className="material-symbols-outlined text-[16px] text-white">lock</span>
          </div>
        </div>
        
        <h2 className="tracking-tight text-[28px] font-bold leading-tight text-center mb-3">
          Dayylo Locked
        </h2>
        <p className="text-[#93a5c8] text-base font-normal leading-relaxed text-center max-w-[280px]">
          Authenticate to manage your private Break habits.
        </p>
        
        <div className="mt-8 flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
          <span className="material-symbols-outlined text-lg text-primary animate-spin">progress_activity</span>
          <p className="text-primary text-sm font-medium leading-none">Scanning Face ID...</p>
        </div>
      </main>

      <div className="w-full p-8 pb-12 z-20 flex flex-col items-center gap-6">
        <button onClick={onUnlock} className="text-primary text-base font-medium hover:text-primary/80 transition-colors">
          Use Passcode
        </button>
        <div className="flex items-center gap-1.5 opacity-40">
          <span className="material-symbols-outlined text-lg text-white">shield</span>
          <span className="text-xs font-medium text-white tracking-widest uppercase">Secured by Dayylo</span>
        </div>
      </div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none z-0"></div>
    </div>
  );
};

export default LockScreen;
