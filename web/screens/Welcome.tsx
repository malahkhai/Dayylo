
import React from 'react';

interface WelcomeProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeProps> = ({ onStart }) => {
  return (
    <div className="flex h-screen flex-col justify-between bg-background-light dark:bg-background-dark">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none"></div>
      <div className="h-12 w-full shrink-0"></div>
      
      <div className="flex flex-col items-center justify-center flex-grow px-6 z-10 animate-fade-in-up">
        <div className="mb-10 p-6 bg-white dark:bg-gray-800 rounded-[2rem] shadow-xl ring-1 ring-black/5 dark:ring-white/10">
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-center bg-no-repeat bg-contain" 
               style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDYFxvh6hTI4CzV08-G_RoUjwWDwuAngkN6ZLd5_7JZ5uskQJq4fGlb_VCsmMcUgSfmPzCRlRAw-hEt_WFdVAzQpmgdWGewgPYcKABW5bVOkvqFsnlQ5iW2NsJqG-g3ZwBqIg24ysvSmR9KJMWGmDl1ncysiK-AaQVKc70gxP8nAa-LdLlmEJy8YJcY1TCiGiSzZYDeFwJ28-H4aQiz6bMJEojbM-S8_cIk0Z_pdBCMRj82CtjDg11aHk07MQx51QpkcyNcmLgPUUs")' }}>
          </div>
        </div>
        
        <div className="text-center max-w-sm mx-auto space-y-3">
          <h1 className="text-gray-900 dark:text-white tracking-tight text-4xl font-extrabold leading-tight">
            Dayylo
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium leading-relaxed px-4">
            Your daily path to better habits. <br className="hidden sm:block"/> Stay consistent, stay focused.
          </p>
        </div>
      </div>

      <div className="w-full px-6 pb-12 pt-6 z-10 flex flex-col gap-4 max-w-md mx-auto">
        <button 
          onClick={onStart}
          className="group relative flex w-full items-center justify-center overflow-hidden rounded-2xl h-14 bg-primary text-white text-lg font-bold shadow-lg shadow-primary/25 transition-transform active:scale-[0.98] hover:bg-blue-600"
        >
          <span>Get Started</span>
          <span className="material-symbols-outlined ml-2 text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </button>
        <button className="flex w-full items-center justify-center overflow-hidden rounded-xl h-12 text-gray-600 dark:text-gray-400 text-sm font-semibold hover:text-gray-900 dark:hover:text-gray-200">
          I already have an account
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
