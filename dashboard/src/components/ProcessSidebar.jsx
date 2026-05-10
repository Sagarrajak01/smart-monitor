import React, { useState, useEffect } from 'react';
import { Activity, MousePointer2 } from 'lucide-react';
import {SOCKET_URL} from '../utils/constants'

export const ProcessSidebar = ({ onSelect, activePid }) => {
  const [processes, setProcesses] = useState([]);

  const fetchTopProcesses = async () => {
    try {
      const res = await fetch(`${SOCKET_URL}/api/top-processes`);
      const data = await res.json();
      setProcesses(data);
    } catch (err) {
      console.error("Discovery Error:", err);
    }
  };

  useEffect(() => {
    fetchTopProcesses();
    const interval = setInterval(fetchTopProcesses, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full lg:w-64 flex flex-col gap-4">
      <div className="flex items-center gap-2 px-1">
        <Activity size={14} className="text-blue-500" />
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Top Consumers
        </h3>
      </div>

      <div className="flex flex-col gap-2">
        {processes.map((proc) => (
          <button
            key={proc.pid}
            onClick={() => onSelect(proc.pid, proc.name)}
            className={`flex flex-col p-3 rounded-xl border transition-all text-left group ${
              activePid === proc.pid
                ? 'bg-blue-600 border-blue-500 shadow-lg shadow-blue-500/20'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-400'
            }`}
          >
            <div className="flex justify-between items-start w-full">
              <span className={`text-xs font-black truncate max-w-[100px] ${
                activePid === proc.pid ? 'text-white' : 'dark:text-slate-200'
              }`}>
                {proc.name}
              </span>
              <span className={`text-[10px] font-mono font-bold ${
                activePid === proc.pid ? 'text-blue-100' : 'text-blue-500'
              }`}>
                {proc.mem}%
              </span>
            </div>
            
            <div className="flex justify-between items-center mt-2 w-full">
              <span className={`text-[10px] font-mono ${
                activePid === proc.pid ? 'text-blue-200' : 'text-slate-500'
              }`}>
                PID: {proc.pid}
              </span>
              <MousePointer2 size={10} className={
                activePid === proc.pid ? 'text-white' : 'text-slate-300 group-hover:text-blue-400'
              } />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};