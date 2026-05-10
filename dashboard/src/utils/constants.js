export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

export const CHART_CONFIG = {
  WINDOW_SIZE: 50,
  BLUE_GRADIENT: "colorBlue",
  PRIMARY_BLUE: "#2563eb",
  SECONDARY_PURPLE: "#8b5cf6",
};
export const STATUS_THEMES = {
  HEALTHY: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  WARNING: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  CRITICAL: "text-rose-500 bg-rose-500/10 border-rose-500/20 animate-pulse",
  
  IDLE: "text-slate-500 bg-slate-500/10 border-slate-500/20",
  LEAKING: "text-rose-500 bg-rose-500/10 border-rose-500/20 animate-pulse",
  ACTIVE: "text-blue-500 bg-blue-500/10 border-blue-500/20"
};