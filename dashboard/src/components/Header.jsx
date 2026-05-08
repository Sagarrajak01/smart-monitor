import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { Logo } from './Logo';

export const Header = ({ dark, setDark }) => (
  <header className="flex justify-between items-center mb-10">
    <div className="flex items-center gap-4">
      <div className="bg-blue-600/10 p-1 rounded-xl">
        <Logo size={48} />
      </div>
      <div>
        <h1 className="text-2xl font-black tracking-tighter uppercase leading-none">
          Smart Monitor
        </h1>
        <span className="text-[10px] font-mono text-blue-500 font-bold tracking-[0.3em]">
          By Sagar Rajak
        </span>
      </div>
    </div>
    
    <button 
      onClick={() => setDark(!dark)} 
      className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:scale-105 transition-transform cursor-pointer"
    >
      {dark ? (
        <Sun size={18} className="text-yellow-400" />
      ) : (
        <Moon size={18} className="text-slate-600" />
      )}
    </button>
  </header>
);