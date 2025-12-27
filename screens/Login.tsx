
import React from 'react';

interface LoginProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginProps> = ({ onLogin }) => {
  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-[#0d141b] dark:text-white antialiased min-h-screen">
      <div className="relative mx-auto w-full max-w-[400px] px-6 py-12">
        <div className="flex flex-col items-center justify-center pb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-blue-600 shadow-lg mb-4">
            <span className="material-symbols-outlined text-white text-3xl">check_circle</span>
          </div>
        </div>
        
        <h1 className="tracking-tight text-[32px] font-bold leading-tight px-4 text-center pb-2">
          Welcome Back
        </h1>
        <p className="text-slate-500 dark:text-gray-400 text-base font-normal leading-normal pb-8 px-4 text-center">
          Let’s get you focused.
        </p>

        <div className="flex flex-col gap-3 pb-6">
          <button 
            onClick={onLogin}
            className="group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-black dark:bg-white text-white dark:text-black gap-3 transition-all hover:opacity-90"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M17.05 20.28c-.98.95-2.05 1.78-3.19 1.76-1.07-.02-1.5-.67-2.75-.67-1.25 0-1.74.65-2.74.67-1.11.02-2.12-.78-3.13-1.76C3.18 18.23 1.5 14.53 1.5 11.1c0-5.18 3.39-7.9 6.72-7.9 1.74 0 3.03.62 4.01 1.25.75-.54 2.22-1.35 4.14-1.24 2.12.12 3.73 1.15 4.63 2.52-4.14 2.13-3.46 7.42.61 9.07-.84 2.06-1.89 4.14-4.56 5.48zM12.03 5.07c-.15-2.18 1.48-4.22 3.48-4.57.25 2.45-1.92 4.67-3.48 4.57z"/>
            </svg>
            <span className="text-base font-bold leading-normal tracking-[0.015em]">Continue with Apple</span>
          </button>
          <button 
            onClick={onLogin}
            className="group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-white dark:bg-[#1e2936] text-[#0d141b] dark:text-white border border-slate-200 dark:border-slate-700 gap-3 transition-all hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="text-base font-bold leading-normal tracking-[0.015em]">Continue with Google</span>
          </button>
        </div>

        <div className="relative flex items-center justify-center py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
          </div>
          <span className="relative bg-background-light dark:bg-background-dark px-4 text-[#4c739a] dark:text-gray-400 text-sm font-normal">
            Or sign in with email
          </span>
        </div>

        <form className="space-y-4 pt-4" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
          <div>
            <label className="block text-sm font-medium leading-6 mb-1.5">Email address</label>
            <input className="block w-full rounded-lg border-0 py-3 px-4 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-primary dark:bg-[#1e2936] dark:ring-slate-700 dark:focus:ring-primary sm:text-sm sm:leading-6 bg-white dark:text-white" placeholder="you@example.com" type="email"/>
          </div>
          <div>
            <label className="block text-sm font-medium leading-6 mb-1.5">Password</label>
            <div className="relative">
              <input className="block w-full rounded-lg border-0 py-3 px-4 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-primary dark:bg-[#1e2936] dark:ring-slate-700 dark:focus:ring-primary sm:text-sm sm:leading-6 bg-white dark:text-white" placeholder="••••••••" type="password"/>
              <button className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400" type="button">
                <span className="material-symbols-outlined text-[20px]">visibility</span>
              </button>
            </div>
          </div>
          <button className="flex w-full cursor-pointer items-center justify-center rounded-lg bg-primary px-3 py-3.5 text-sm font-bold leading-6 text-white shadow-sm hover:bg-blue-600 transition-colors" type="submit">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
