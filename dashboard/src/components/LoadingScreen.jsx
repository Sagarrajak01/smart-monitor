import React from 'react';
import { Activity } from 'lucide-react';

export const LoadingScreen = () => (
  <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-950 text-blue-500 font-mono">
    <Activity className="animate-spin mb-4" size={32} />
    <div className="tracking-widest text-[10px] uppercase font-bold">
      Awaiting_Kernel_Stream...
    </div>
  </div>
);