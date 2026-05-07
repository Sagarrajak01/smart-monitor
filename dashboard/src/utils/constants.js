export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

export const CHART_CONFIG = {
  WINDOW_SIZE: 50,
  BLUE_GRADIENT: "colorBlue",
  PRIMARY_BLUE: "#2563eb",
  SECONDARY_PURPLE: "#8b5cf6",
};

export const STATUS_THEMES = {
  HEALTHY: "text-emerald-500 bg-emerald-500/10",
  WARNING: "text-amber-500 bg-amber-500/10",
  CRITICAL: "text-rose-500 bg-rose-500/10 animate-pulse",
};