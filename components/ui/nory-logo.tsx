import React from 'react';

export function NoryLogo({ className = "", size = 40 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF8A00" />
          <stop offset="100%" stopColor="#FF6B00" />
        </linearGradient>
        <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0066FF" />
          <stop offset="100%" stopColor="#0044FF" />
        </linearGradient>
      </defs>
      
      {/* Blue part of the 'N' */}
      <path
        d="M10 30V10L20 20V10"
        stroke="url(#blueGradient)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Orange part completing the 'N' */}
      <path
        d="M20 30V20L30 30V10"
        stroke="url(#orangeGradient)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

