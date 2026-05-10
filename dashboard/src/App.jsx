import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { StatCard } from './components/StatCard';
import { TelemetryChart } from './components/TelemetryChart';
import { LoadingScreen } from './components/LoadingScreen';
import { ProcessSidebar } from './components/ProcessSidebar';
import { useTheme } from './hooks/useTheme';
import { socket, fetchHistory } from './services/socket';

import { CHART_CONFIG } from './utils/constants';
import { formatTTF, toMB, getStatusLevel } from './utils/formatters';

function App() {
  const [metrics, setMetrics] = useState(null);
  const [history, setHistory] = useState([]);
  const [dark, setDark] = useTheme(false);

  useEffect(() => {
    fetchHistory().then(data => { if (data) setHistory(data); });

    socket.on('metrics', (data) => {
      setMetrics(data);
      setHistory(prev => [
        ...prev.slice(-(CHART_CONFIG.WINDOW_SIZE - 1)),
        { ...data, t: new Date().toLocaleTimeString().slice(3, 8) }
      ]);
    });

    return () => socket.off('metrics');
  }, []);

  const handleProcessSelect = (pid, name) => {
    socket.emit('switch-target', pid);
    setHistory([]);
    setMetrics(null);
  };

  if (!metrics && history.length === 0) return <LoadingScreen />;

  return (
    <div className="min-h-screen p-4 md:p-8 bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <Header dark={dark} setDark={setDark} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <StatCard title="Memory Workload" value={toMB(metrics?.raw_kb || 0)} unit="MB" />
          <StatCard title="Regression Slope" value={metrics?.slope?.toFixed(4) || 0} unit="KB/S" />
          <StatCard title="Target Process" value={metrics?.pid || "---"} unit="PID" />
          <StatCard title="System State" value={metrics?.status || "HEALTHY"} status={metrics?.status} />
          <StatCard 
            title="Est. Time to Failure" 
            value={formatTTF(metrics?.ttf)} 
            unit={metrics?.ttf ? "" : "N/A"}
            status={getStatusLevel(metrics?.slope, metrics?.status)}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="shrink-0 w-full lg:w-64">
            <ProcessSidebar activePid={metrics?.pid} onSelect={handleProcessSelect} />
          </aside>
          <main className="flex-1 bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 p-4">
            <TelemetryChart history={history} dark={dark} slope={metrics?.slope} />
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;