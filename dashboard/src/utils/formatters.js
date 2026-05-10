
export const formatTTF = (seconds) => {
  if (seconds === null || seconds === undefined || isNaN(seconds)) return "STABLE";
  
  const totalSeconds = Math.floor(seconds);
  if (totalSeconds > 86400) return `${(totalSeconds / 86400).toFixed(1)}d`;
  if (totalSeconds > 3600) return `${(totalSeconds / 3600).toFixed(1)}h`;
  if (totalSeconds > 60) return `${Math.floor(totalSeconds / 60)}m ${totalSeconds % 60}s`;
  
  return `${totalSeconds}s`;
};

export const getStatusLevel = (slope, engineStatus) => {
  if (engineStatus === "CRITICAL" || slope > 10) return "CRITICAL";
  if (slope > 0.01) return "WARNING";
  return engineStatus || "HEALTHY";
};

export const toMB = (kb) => (kb / 1024).toFixed(2);