
import React from 'react';

export const Logo = ({ className = "", size = 40 }: { className?: string; size?: number }) => {
  return (
    <div className="flex items-center gap-2">
      <div className={`relative ${className}`} style={{ width: size, height: size }}>
        <img 
          src="public/lovable-uploads/c4ed4610-c63e-4c9c-b6dc-3b900cb14f3e.png" 
          alt="CLA.app Logo" 
          className="w-full h-full object-contain" 
        />
      </div>
      <span className="text-[#1a365d] text-xl font-medium">CLA.app</span>
    </div>
  );
};
