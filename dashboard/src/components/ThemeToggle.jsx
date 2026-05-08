import { Sun, Moon } from 'lucide-react';

export const ThemeToggle = ({ theme, toggle }) => (
  <button 
    onClick={toggle}
    className="p-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 transition-all hover:scale-110"
  >
    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
  </button>
);