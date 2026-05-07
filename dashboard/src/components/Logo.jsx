import React from 'react';

export const Logo = ({ size = 40 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className="drop-shadow-sm"
  >
    {/* Outer Monitor Frame - Uses currentColor to adapt to text color */}
    <rect x="10" y="20" width="80" height="50" rx="4" stroke="currentColor" strokeWidth="4"/>
    <path d="M40 70L35 80H65L60 70" stroke="currentColor" strokeWidth="4" strokeLinejoin="round"/>
    <path d="M30 80H70" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>

    {/* The Telemetry Pulse - Blue Accent */}
    <path 
      d="M20 55H35L42 35L52 60L58 45L65 55H80" 
      stroke="#38bdf8" 
      strokeWidth="4" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    
    {/* System Status Indicator - Red Dot */}
    <circle cx="80" cy="30" r="4" fill="#ef4444" className="animate-pulse" />
  </svg>
);