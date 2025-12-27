
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import BottomNav from '../components/BottomNav';

interface ProfileProps {
  user: User;
  onLogout: () => void;
  onDeleteAccount: () => void;
}

const ProfileScreen: React.FC<ProfileProps> = ({ user, onLogout, onDeleteAccount }) => {
  const navigate = useNavigate();
  const [privacyMode, setPrivacyMode] = useState(true);
  const [faceIdEnabled, setFaceIdEnabled] = useState(true);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark pb-32">
      {/* Header */}
      <header className="px-6 pt-12 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight">Profile</h1>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar px-6 space-y-8">
        {/* User Card */}
        <div className="bg-white dark:bg-surface-dark p-6 rounded-[2rem] border border-slate-100 dark:border-white/5 shadow-sm flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
              <span className="material-symbols-outlined text-primary text-3xl font-bold">person</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full border-2 border-white dark:border-surface-dark flex items-center justify-center">
              <span className="material-symbols-outlined text-black text-[14px] font-bold">edit</span>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-sm font-medium text-slate-500">{user.email}</p>
          </div>
        </div>

        {/* Subscription / Plan Section */}
        <section className="space-y-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 px-2">Current Plan</p>
          <button 
            onClick={() => navigate('/paywall')}
            className="w-full bg-gradient-to-r from-primary/20 to-blue-500/20 dark:from-primary/10 dark:to-blue-500/10 p-5 rounded-3xl border border-primary/20 flex items-center justify-between group active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined filled">diamond</span>
              </div>
              <div className="text-left">
                <p className="font-bold text-lg leading-tight">Free Plan</p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest group-hover:text-primary transition-colors">Upgrade to Premium</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-slate-400 group-hover:translate-x-1 transition-transform">chevron_right</span>
          </button>
        </section>

        {/* Account Section */}
        <section className="space-y-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 px-2">Account Settings</p>
          <div className="bg-white dark:bg-surface-dark rounded-3xl overflow-hidden border border-slate-100 dark:border-white/5 divide-y divide-slate-50 dark:divide-white/5">
            <button className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-slate-400">notifications</span>
                <span className="font-bold">Notifications</span>
              </div>
              <div 
                onClick={(e) => { e.stopPropagation(); setNotifications(!notifications); }}
                className={`relative w-11 h-6 rounded-full transition-colors ${notifications ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}
              >
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${notifications ? 'translate-x-5' : ''}`}></div>
              </div>
            </button>
            <button className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-slate-400">palette</span>
                <span className="font-bold">App Theme</span>
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Dark Mode</span>
            </button>
          </div>
        </section>

        {/* Privacy Section */}
        <section className="space-y-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 px-2">Privacy & Security</p>
          <div className="bg-white dark:bg-surface-dark rounded-3xl overflow-hidden border border-slate-100 dark:border-white/5 divide-y divide-slate-50 dark:divide-white/5">
            <button className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-slate-400">visibility_off</span>
                <span className="font-bold">Private Habits Mode</span>
              </div>
              <div 
                onClick={(e) => { e.stopPropagation(); setPrivacyMode(!privacyMode); }}
                className={`relative w-11 h-6 rounded-full transition-colors ${privacyMode ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}
              >
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${privacyMode ? 'translate-x-5' : ''}`}></div>
              </div>
            </button>
            <button className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-slate-400">fingerprint</span>
                <span className="font-bold">Face ID / Biometrics</span>
              </div>
              <div 
                onClick={(e) => { e.stopPropagation(); setFaceIdEnabled(!faceIdEnabled); }}
                className={`relative w-11 h-6 rounded-full transition-colors ${faceIdEnabled ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}
              >
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${faceIdEnabled ? 'translate-x-5' : ''}`}></div>
              </div>
            </button>
          </div>
        </section>

        {/* Actions Section */}
        <section className="space-y-4 pt-4">
          <button 
            onClick={onLogout}
            className="w-full py-4 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white font-bold flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined">logout</span>
            Log Out
          </button>
          
          <button 
            onClick={onDeleteAccount}
            className="w-full py-4 rounded-2xl text-red-500 font-bold flex items-center justify-center gap-2 hover:bg-red-500/5 transition-colors"
          >
            <span className="material-symbols-outlined">delete_forever</span>
            Delete Account
          </button>
        </section>

        {/* App Version Info */}
        <div className="text-center pb-12">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Dayylo v1.0.4</p>
        </div>
      </main>

      <BottomNav active="settings" />
    </div>
  );
};

export default ProfileScreen;
