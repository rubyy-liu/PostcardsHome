
import React from 'react';

interface BrutalistStampProps {
  text: string;
  variant?: 'rectangular' | 'circular';
  className?: string;
}

export const BrutalistStamp: React.FC<BrutalistStampProps> = ({ text, variant = 'rectangular', className = '' }) => {
  const rotation = Math.floor(Math.random() * 20) - 10;
  
  if (variant === 'circular') {
    return (
      <div 
        className={`w-24 h-24 rounded-full border-2 border-dashed border-archive-ink flex items-center justify-center font-bold text-xs text-archive-ink opacity-80 pointer-events-none uppercase tracking-widest ${className}`}
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <span className="text-center px-2">{text}</span>
      </div>
    );
  }

  return (
    <div 
      className={`w-20 h-24 border-2 border-dashed border-archive-ink flex items-center justify-center font-bold text-sm text-archive-ink opacity-80 pointer-events-none uppercase ${className}`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {text}
    </div>
  );
};
