import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { StatCard } from './components/StatCard';
import { TelemetryChart } from './components/TelemetryChart';
import { LoadingScreen } from './components/LoadingScreen';
import { useTheme } from './hooks/useTheme';
import { socket } from './services/socket';
import { CHART_CONFIG } from './utils/constants';

function App() {
  const [metrics, setMetrics] = useState(null);
  const [history, setHistory] = useState([]);
  const [dark, setDark] = useTheme(false);

  useEffect(() => {
    socket.on('metrics', (data) => {
      setMetrics(data);
      setHistory(prev => [
        ...prev.slice(-(CHART_CONFIG.WINDOW_SIZE - 1)),
        { ...data, t: new Date().toLocaleTimeString().slice(3, 8) }
      ]);
    });

    return () => socket.off('metrics');
  }, []);

  if (!metrics) return <LoadingScreen />;

  return (
    <div className="min-h-screen p-4 md:p-8 bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <Header dark={dark} setDark={setDark} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard title="Memory Workload" value={(metrics.raw_kb / 1024).toFixed(2)} unit="MB" />
          <StatCard title="Regression Slope" value={metrics.slope.toFixed(4)} unit="KB/S" />
          <StatCard title="Target Process" value={metrics.pid} unit="PID" />
          <StatCard title="System State" value={metrics.status} unit="OS" status={metrics.status} />
        </div>

        <TelemetryChart history={history} dark={dark} />
      </div>
    </div>
  );
}

export default App;