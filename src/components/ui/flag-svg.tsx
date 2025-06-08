
import React from 'react';

interface FlagSvgProps {
  countryCode: string;
  className?: string;
}

const flags: Record<string, JSX.Element> = {
  FR: (
    <svg viewBox="0 0 24 16" className="w-5 h-3">
      <rect width="8" height="16" fill="#002395"/>
      <rect x="8" width="8" height="16" fill="#FFFFFF"/>
      <rect x="16" width="8" height="16" fill="#ED2939"/>
    </svg>
  ),
  US: (
    <svg viewBox="0 0 24 16" className="w-5 h-3">
      <rect width="24" height="16" fill="#B22234"/>
      <rect y="1" width="24" height="1" fill="#FFFFFF"/>
      <rect y="3" width="24" height="1" fill="#FFFFFF"/>
      <rect y="5" width="24" height="1" fill="#FFFFFF"/>
      <rect y="7" width="24" height="1" fill="#FFFFFF"/>
      <rect y="9" width="24" height="1" fill="#FFFFFF"/>
      <rect y="11" width="24" height="1" fill="#FFFFFF"/>
      <rect y="13" width="24" height="1" fill="#FFFFFF"/>
      <rect y="15" width="24" height="1" fill="#FFFFFF"/>
      <rect width="10" height="8" fill="#3C3B6E"/>
    </svg>
  ),
  GB: (
    <svg viewBox="0 0 24 16" className="w-5 h-3">
      <rect width="24" height="16" fill="#012169"/>
      <path d="M0,0 L24,16 M24,0 L0,16" stroke="#FFFFFF" strokeWidth="2"/>
      <path d="M12,0 L12,16 M0,8 L24,8" stroke="#FFFFFF" strokeWidth="3"/>
      <path d="M0,0 L24,16 M24,0 L0,16" stroke="#C8102E" strokeWidth="1"/>
      <path d="M12,0 L12,16 M0,8 L24,8" stroke="#C8102E" strokeWidth="1.5"/>
    </svg>
  ),
  DE: (
    <svg viewBox="0 0 24 16" className="w-5 h-3">
      <rect width="24" height="5.33" fill="#000000"/>
      <rect y="5.33" width="24" height="5.33" fill="#DD0000"/>
      <rect y="10.67" width="24" height="5.33" fill="#FFCE00"/>
    </svg>
  ),
  ES: (
    <svg viewBox="0 0 24 16" className="w-5 h-3">
      <rect width="24" height="4" fill="#AA151B"/>
      <rect y="4" width="24" height="8" fill="#F1BF00"/>
      <rect y="12" width="24" height="4" fill="#AA151B"/>
    </svg>
  ),
  IT: (
    <svg viewBox="0 0 24 16" className="w-5 h-3">
      <rect width="8" height="16" fill="#009246"/>
      <rect x="8" width="8" height="16" fill="#FFFFFF"/>
      <rect x="16" width="8" height="16" fill="#CE2B37"/>
    </svg>
  ),
  BE: (
    <svg viewBox="0 0 24 16" className="w-5 h-3">
      <rect width="8" height="16" fill="#000000"/>
      <rect x="8" width="8" height="16" fill="#FDDA24"/>
      <rect x="16" width="8" height="16" fill="#EF3340"/>
    </svg>
  ),
  CH: (
    <svg viewBox="0 0 24 16" className="w-5 h-3">
      <rect width="24" height="16" fill="#FF0000"/>
      <rect x="10" y="4" width="4" height="8" fill="#FFFFFF"/>
      <rect x="6" y="6" width="12" height="4" fill="#FFFFFF"/>
    </svg>
  ),
  CA: (
    <svg viewBox="0 0 24 16" className="w-5 h-3">
      <rect width="8" height="16" fill="#FF0000"/>
      <rect x="8" width="8" height="16" fill="#FFFFFF"/>
      <rect x="16" width="8" height="16" fill="#FF0000"/>
      <path d="M12,4 L14,6 L12,8 L14,10 L12,12 L10,10 L12,8 L10,6 Z" fill="#FF0000"/>
    </svg>
  ),
  AU: (
    <svg viewBox="0 0 24 16" className="w-5 h-3">
      <rect width="24" height="16" fill="#012169"/>
      <rect width="12" height="8" fill="#012169"/>
      <path d="M0,0 L12,8 M12,0 L0,8" stroke="#FFFFFF" strokeWidth="1"/>
      <path d="M6,0 L6,8 M0,4 L12,4" stroke="#FFFFFF" strokeWidth="1.5"/>
      <path d="M0,0 L12,8 M12,0 L0,8" stroke="#C8102E" strokeWidth="0.5"/>
      <path d="M6,0 L6,8 M0,4 L12,4" stroke="#C8102E" strokeWidth="0.75"/>
    </svg>
  )
};

export const FlagSvg: React.FC<FlagSvgProps> = ({ countryCode, className = "" }) => {
  const flag = flags[countryCode];
  
  if (!flag) {
    return (
      <div className={`w-5 h-3 bg-gray-200 rounded-sm flex items-center justify-center text-xs text-gray-500 ${className}`}>
        {countryCode}
      </div>
    );
  }
  
  return <div className={className}>{flag}</div>;
};
