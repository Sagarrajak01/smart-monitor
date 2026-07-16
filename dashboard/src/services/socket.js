import { io } from 'socket.io-client';

export const socket = io({
  autoConnect: true,
  reconnectionAttempts: 5,
});

// REST API Fetch for History 
export const fetchHistory = async () => {
  try {
    const response = await fetch(`/api/history`);
    if (!response.ok) throw new Error("Database fetch failed");
    
    const data = await response.json();
    
    return data.reverse().map((entry) => ({
      time: new Date(entry.created_at || entry.time || Date.now()).toLocaleTimeString([], {
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      }),
      raw_kb: entry.mem_kb || entry.raw_kb || entry.mem || 0,
      ema_kb: entry.ema_kb || entry.ema || 0,
      status: entry.status || 'HEALTHY',
      slope: entry.slope || 0
    }));
  } catch (error) {
    console.error("[Service] History Load Error:", error);
    return [];
  }
};