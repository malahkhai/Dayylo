
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Habit, HabitType } from '../types';
import { CATEGORIES } from '../constants';

interface AddHabitProps {
  onAdd: (habit: Habit) => void;
}

const AddHabitScreen: React.FC<AddHabitProps> = ({ onAdd }) => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [type, setType] = useState<HabitType>('build');
  const [selectedIcon, setSelectedIcon] = useState('water_drop');
  const [isPrivate, setIsPrivate] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newHabit: Habit = {
      id: Math.random().toString(36).substr(2, 9),
      name: name.trim(),
      type,
      icon: selectedIcon,
      color: type === 'build' ? '#30e8ab' : '#ff9f0a',
      streak: 0,
      completedToday: false,
      private: isPrivate,
      frequency: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    };

    onAdd(newHabit);
  };

  return (
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark overflow-hidden">
      <header className="flex items-center justify-between p-6">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5">
          <span className="material-symbols-outlined">close</span>
        </button>
        <h1 className="text-xl font-bold">New Habit</h1>
        <button 
          onClick={handleSubmit}
          disabled={!name.trim()}
          className="text-primary font-bold disabled:opacity-50"
        >
          Save
        </button>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar px-6 pb-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Type Toggle */}
          <div className="bg-slate-100 dark:bg-surface-dark p-1 rounded-2xl flex">
            <button 
              type="button"
              onClick={() => setType('build')}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${type === 'build' ? 'bg-white dark:bg-[#24342f] shadow-sm text-primary' : 'text-slate-500'}`}
            >
              Build Habit
            </button>
            <button 
              type="button"
              onClick={() => setType('break')}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${type === 'break' ? 'bg-white dark:bg-[#2a231b] shadow-sm text-accent-break' : 'text-slate-500'}`}
            >
              Break Habit
            </button>
          </div>

          {/* Name Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Habit Name</label>
            <input 
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Morning Yoga"
              className="w-full bg-transparent border-0 border-b-2 border-slate-200 dark:border-slate-800 focus:ring-0 focus:border-primary text-2xl font-bold px-0 py-2 placeholder:text-slate-300 dark:placeholder:text-slate-700"
            />
          </div>

          {/* Icon Selector */}
          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Choose Icon</label>
            <div className="grid grid-cols-4 gap-4">
              {Object.values(CATEGORIES).flat().slice(0, 12).map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setSelectedIcon(icon)}
                  className={`aspect-square rounded-2xl flex items-center justify-center transition-all ${selectedIcon === icon ? 'bg-primary text-black' : 'bg-white dark:bg-surface-dark border border-slate-100 dark:border-white/5 text-slate-400'}`}
                >
                  <span className="material-symbols-outlined text-2xl">{icon}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Privacy Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-surface-dark border border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                <span className="material-symbols-outlined text-xl">lock</span>
              </div>
              <div>
                <p className="text-sm font-bold">Private Habit</p>
                <p className="text-xs text-slate-400">Hide from general view</p>
              </div>
            </div>
            <button 
              type="button"
              onClick={() => setIsPrivate(!isPrivate)}
              className={`relative w-12 h-6 rounded-full transition-colors ${isPrivate ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}
            >
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${isPrivate ? 'translate-x-6' : ''}`}></div>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AddHabitScreen;
