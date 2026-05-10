import React from 'react';
import { STATUS_THEMES } from '../utils/constants';

const getExtendedStatus = (title, value, status) => {
  if (title !== "System State") return { label: status, theme: STATUS_THEMES[status] };
  const label = status || "HEALTHY";

  return {
    label: label.replace("_", " "),
    theme: STATUS_THEMES[label] || STATUS_THEMES["HEALTHY"]
  };
};

export const StatCard = ({ title, value, unit, status, trend }) => {
  const isSystemState = title === "System State";

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden transition-all hover:shadow-md group">
      <div className="absolute -right-2 -bottom-2 text-slate-100 dark:text-slate-800/50 font-black text-4xl select-none group-hover:scale-110 transition-transform">
        {unit}
      </div>

      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1 relative z-10">
        {title}
      </p>

      <div className="flex items-baseline gap-1 relative z-10">
        <span className="text-2xl font-black tracking-tight">
          {value}
        </span>
        <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">
          {unit}
        </span>
      </div>

      {status && (
        <div className={`mt-3 px-2 py-0.5 rounded-md text-[9px] font-black inline-block border tracking-widest transition-colors ${STATUS_THEMES[status.toUpperCase()] || STATUS_THEMES.IDLE}`}>
          {status.toUpperCase().replace("_", " ")}
        </div>
      )}
    </div>
  );
};