
import React from 'react';

export const Logo = ({ 
  className = "", 
  textClassName = "",
  size = 40 
}: { 
  className?: string; 
  textClassName?: string;
  size?: number 
}) => {
  return (
    <div className="flex items-center gap-2">
      <div className={`relative ${className}`} style={{ width: size, height: size }}>
        <img 
          src="/lovable-uploads/6f91541e-ba50-4ec1-9fa4-2aa4ed541c4f.png" 
          alt="CLA.app Logo" 
          className="w-full h-full object-contain" 
        />
      </div>
      <span className={`text-[#1a365d] text-xl font-medium ${textClassName}`}>CLA.app</span>
    </div>
  );
};
