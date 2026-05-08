import React, { useState, useEffect, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Zap } from 'lucide-react';
import { CHART_CONFIG } from '../utils/constants';

export const TelemetryChart = ({ history, dark }) => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 380 });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: 380
        });
      }
    };

    updateSize();

    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden min-h-0 min-w-0">
      <Zap className="absolute -right-6 -top-6 text-blue-500/5 rotate-12" size={180} />
      
      <div className="flex justify-between items-center mb-8 relative z-10">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em]">Live Growth Spectrum</h3>
        <div className="flex items-center gap-2 text-[10px] font-mono text-blue-500 font-bold">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" /> ENGINE_ACTIVE
        </div>
      </div>

      {/* We use a standard div as a reference. 
          The chart will only render if width > 0.
      */}
      <div 
        ref={containerRef}
        className="w-full h-[380px] relative z-10 block"
      >
        {dimensions.width > 0 && history.length > 0 ? (
          <AreaChart 
            width={dimensions.width} 
            height={dimensions.height} 
            data={history} 
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <defs>
              <linearGradient id={CHART_CONFIG.BLUE_GRADIENT} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_CONFIG.PRIMARY_BLUE} stopOpacity={0.3} />
                <stop offset="95%" stopColor={CHART_CONFIG.PRIMARY_BLUE} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={dark ? '#1e293b' : '#e2e8f0'} />
            <XAxis dataKey="t" hide />
            <YAxis hide domain={['auto', 'auto']} />
            <Tooltip
              contentStyle={{ 
                backgroundColor: dark ? '#0f172a' : '#fff', 
                borderRadius: '12px', border: '1px solid #334155', color: dark ? '#fff' : '#000' 
              }}
              itemStyle={{ color: CHART_CONFIG.PRIMARY_BLUE, fontFamily: 'monospace' }}
            />
            <Area 
              type="monotone" dataKey="raw_kb" stroke={CHART_CONFIG.PRIMARY_BLUE} 
              strokeWidth={3} fillOpacity={1} fill={`url(#${CHART_CONFIG.BLUE_GRADIENT})`} 
              isAnimationActive={false} 
            />
            <Area 
              type="monotone" dataKey="ema_kb" stroke={CHART_CONFIG.SECONDARY_PURPLE} 
              fill="transparent" strokeDasharray="4 4" strokeWidth={2} isAnimationActive={false} 
            />
          </AreaChart>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400 font-mono text-[10px] italic tracking-widest uppercase">
            {history.length === 0 ? "Awaiting_Buffer_Data..." : "Syncing_Layout_Pixels..."}
          </div>
        )}
      </div>
    </div>
  );
};