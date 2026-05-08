import React from 'react';
import { STATUS_THEMES } from '../utils/constants';

export const StatCard = ({ title, value, unit, status }) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
    <div className="flex items-baseline gap-1">
      <span className="text-2xl font-black">{value}</span>
      <span className="text-[10px] font-mono text-slate-500 font-semibold">{unit}</span>
    </div>

    {status && (
      <div className={`mt-2 px-2 py-0.5 rounded text-[10px] font-bold inline-block border ${STATUS_THEMES[status] || ""}`}>
        {status}
      </div>
    )}
  </div>
);