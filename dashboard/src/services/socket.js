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
      time: new Date(entry.time).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      }),
      usage: entry.mem,
      ema: entry.ema,
      status: entry.status
    }));
  } catch (error) {
    console.error("[Service] History Load Error:", error);
    return [];
  }
};