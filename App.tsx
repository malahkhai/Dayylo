
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Habit, User } from './types';
import { INITIAL_HABITS } from './constants';

import WelcomeScreen from './screens/Welcome';
import LoginScreen from './screens/Login';
import OnboardingScreen from './screens/Onboarding';
import DashboardScreen from './screens/Dashboard';
import HabitDetailScreen from './screens/HabitDetail';
import AddHabitScreen from './screens/AddHabit';
import InsightsScreen from './screens/Insights';
import LockScreen from './screens/LockScreen';
import ManageHabitsScreen from './screens/ManageHabits';
import ProfileScreen from './screens/Profile';
import PaywallScreen from './screens/Paywall';

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User>({
    name: 'Alex Johnson',
    email: 'alex.j@example.com',
    isLoggedIn: false,
    isUnlocked: false,
    onboardingStep: 0
  });
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);

  useEffect(() => {
    const isAuthPath = location.pathname.includes('login') || location.pathname.includes('welcome');
    if (!user.isLoggedIn && !isAuthPath) {
      navigate('/welcome');
    }
  }, [user.isLoggedIn, location.pathname, navigate]);

  const toggleHabit = (id: string) => {
    setHabits(prev => prev.map(h => h.id === id ? { 
      ...h, 
      completedToday: !h.completedToday, 
      streak: h.completedToday ? Math.max(0, h.streak - 1) : h.streak + 1 
    } : h));
  };

  const removeHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  const handleUnlock = () => {
    setUser(prev => ({ ...prev, isUnlocked: true }));
    navigate('/dashboard');
  };

  const handleLogout = () => {
    setUser({
      name: 'Alex Johnson',
      email: 'alex.j@example.com',
      isLoggedIn: false,
      isUnlocked: false,
      onboardingStep: 0
    });
    navigate('/welcome');
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you absolutely sure? This will delete all your progress and cannot be undone.")) {
      setHabits([]);
      handleLogout();
    }
  };

  return (
    <div className="mx-auto max-w-md min-h-screen bg-background-light dark:bg-background-dark shadow-2xl overflow-x-hidden relative">
      <Routes>
        <Route path="/welcome" element={<WelcomeScreen onStart={() => navigate('/login')} />} />
        <Route path="/login" element={<LoginScreen onLogin={() => { setUser(p => ({ ...p, isLoggedIn: true })); navigate('/onboarding'); }} />} />
        <Route path="/onboarding" element={<OnboardingScreen onComplete={() => navigate('/dashboard')} />} />
        <Route path="/dashboard" element={<DashboardScreen habits={habits} user={user} onToggleHabit={toggleHabit} onOpenLock={() => navigate('/lock')} />} />
        <Route path="/habit/:id" element={<HabitDetailScreen habits={habits} />} />
        <Route path="/add" element={<AddHabitScreen onAdd={(h) => { setHabits(p => [...p, h]); navigate('/dashboard'); }} />} />
        <Route path="/manage" element={<ManageHabitsScreen habits={habits} onRemove={removeHabit} />} />
        <Route path="/insights" element={<InsightsScreen habits={habits} />} />
        <Route path="/lock" element={<LockScreen onUnlock={handleUnlock} onCancel={() => navigate('/dashboard')} />} />
        <Route path="/profile" element={<ProfileScreen user={user} onLogout={handleLogout} onDeleteAccount={handleDeleteAccount} />} />
        <Route path="/paywall" element={<PaywallScreen onClose={() => navigate(-1)} />} />
        <Route path="/" element={<DashboardScreen habits={habits} user={user} onToggleHabit={toggleHabit} onOpenLock={() => navigate('/lock')} />} />
      </Routes>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
};

export default App;
