import React, { useState, useEffect, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine, Label } from 'recharts';
import { Zap, Camera, Activity } from 'lucide-react';
import { toPng } from 'html-to-image';
import { CHART_CONFIG } from '../utils/constants';

export const TelemetryChart = ({ history, dark, slope }) => {
  const containerRef = useRef(null);
  const captureRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 380 });

  const threshold = history.length > 0 ? history[0].raw_kb * 1.15 : 102400;

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({ width: containerRef.current.offsetWidth, height: 380 });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const exportImage = async () => {
    if (!captureRef.current) return;
    const dataUrl = await toPng(captureRef.current, {
      backgroundColor: dark ? '#020617' : '#ffffff',
      style: { padding: '20px', borderRadius: '16px' }
    });
    const link = document.createElement('a');
    link.download = `Analysis_${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div 
      ref={captureRef} 
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden transition-colors duration-300"
    >
      <Zap className="absolute -right-6 -top-6 text-blue-500/5 dark:text-blue-400/10 rotate-12" size={180} />
      
      {/* HEADER SECTION */}
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div>
          <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em]">Live Growth Spectrum</h3>
          <div className="mt-2 flex items-center gap-3">
            <div className="px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded text-[9px] font-mono text-blue-600 dark:text-blue-400 font-bold">
               f(x) = {slope?.toFixed(2) || "0.00"}x + b
            </div>
            <span className="text-[9px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-widest italic">Linear Regression Overlay</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={exportImage} 
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-blue-600 hover:text-white dark:hover:text-white transition-all shadow-sm"
          >
            <Camera size={14} />
          </button>
          <div className="flex items-center gap-2 text-[10px] font-mono text-blue-600 dark:text-blue-400 font-bold">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" /> ENGINE_ACTIVE
          </div>
        </div>
      </div>

      {/* CHART AREA */}
      <div ref={containerRef} className="w-full h-[380px] relative z-10">
        {dimensions.width > 0 && history.length > 0 ? (
          <AreaChart width={dimensions.width} height={dimensions.height} data={history}>
            <defs>
              <linearGradient id={CHART_CONFIG.BLUE_GRADIENT} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_CONFIG.PRIMARY_BLUE} stopOpacity={0.3} />
                <stop offset="95%" stopColor={CHART_CONFIG.PRIMARY_BLUE} stopOpacity={0} />
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={dark ? '#1e293b' : '#f1f5f9'} />
            <XAxis dataKey="t" hide />
            <YAxis hide domain={['auto', (dataMax) => dataMax * 1.2]} />
            
            <ReferenceLine y={threshold} stroke="#ef4444" strokeDasharray="6 4" strokeWidth={1.5}>
              <Label value="CRITICAL_LIMIT" position="insideTopRight" fill="#ef4444" fontSize={9} fontWeight="900" dy={-10} />
            </ReferenceLine>

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload?.length) {
                  return (
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 rounded-xl shadow-2xl font-mono border-l-4 border-l-blue-500">
                      <p className="text-[9px] text-slate-400 mb-2 uppercase tracking-tighter">{payload[0].payload.time}</p>
                      <div className="space-y-1">
                        <p className="text-xs text-slate-900 dark:text-white font-bold">USE: {(payload[0].value / 1024).toFixed(2)} MB</p>
                        <p className="text-[10px] text-purple-600 dark:text-purple-400 opacity-80">EMA: {(payload[1].value / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Area type="monotone" dataKey="raw_kb" stroke={CHART_CONFIG.PRIMARY_BLUE} strokeWidth={3} fillOpacity={1} fill={`url(#${CHART_CONFIG.BLUE_GRADIENT})`} isAnimationActive={false} />
            <Area type="monotone" dataKey="ema_kb" stroke={CHART_CONFIG.SECONDARY_PURPLE} fill="transparent" strokeDasharray="4 4" strokeWidth={2} isAnimationActive={false} />
          </AreaChart>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-400 font-mono text-[10px]">
             <Activity className="animate-spin-slow opacity-20" size={40} />
             SYNCING_BUFFERS...
          </div>
        )}
      </div>

      {/* READABILITY: Footer Legend */}
      <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 border-t border-slate-100 dark:border-slate-800 pt-6">
        <div className="flex items-center gap-3">
          <div className="w-6 h-1 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.4)]" />
          <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">Live RAM Payload</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-6 h-1 border-t-2 border-dashed border-purple-500" />
          <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">EMA Trend (Filter)</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-6 h-0.5 border-t border-dashed border-red-500" />
          <span className="text-[9px] font-black text-red-500/80 uppercase tracking-[0.2em]">Leak Barrier</span>
        </div>
      </div>
    </div>
  );
};