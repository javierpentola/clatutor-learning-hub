
import React from 'react';

export const Logo = ({ className = "", size = 40 }: { className?: string; size?: number }) => {
  return (
    <div className="flex items-center gap-2">
      <div className={`relative ${className}`} style={{ width: size, height: size }}>
        {/* Top squares */}
        <div className="absolute top-0 left-0 w-[40%] h-[40%] bg-[#1a365d] rounded-sm" />
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-[#1a365d] rounded-sm" />
        
        {/* Cross */}
        <div className="absolute left-1/2 top-[15%] w-[20%] h-[70%] bg-[#1a365d] rounded-sm transform -translate-x-1/2" />
        <div className="absolute top-[40%] left-[15%] w-[70%] h-[20%] bg-[#1a365d] rounded-sm" />
        
        {/* Bottom squares */}
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-[#1a365d] rounded-sm" />
        <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-[#1a365d] rounded-sm" />
      </div>
      <span className="text-[#1a365d] text-xl font-medium">CLA.app</span>
    </div>
  );
};
