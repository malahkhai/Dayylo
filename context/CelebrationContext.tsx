import React, { createContext, useContext, useState, useCallback } from 'react';
import { CelebrationOverlay } from '../components/CelebrationOverlay';

interface CelebrationContextType {
  triggerCelebration: () => void;
}

const CelebrationContext = createContext<CelebrationContextType | undefined>(undefined);

export const CelebrationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(false);

  const triggerCelebration = useCallback(() => {
    setVisible(true);
  }, []);

  const handleFinish = useCallback(() => {
    setVisible(false);
  }, []);

  return (
    <CelebrationContext.Provider value={{ triggerCelebration }}>
      {children}
      <CelebrationOverlay visible={visible} onFinish={handleFinish} />
    </CelebrationContext.Provider>
  );
};

export const useCelebration = () => {
  const context = useContext(CelebrationContext);
  if (!context) {
    throw new Error('useCelebration must be used within a CelebrationProvider');
  }
  return context;
};
