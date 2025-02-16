
import React from 'react';

export const Logo = ({ className = "", size = 40 }: { className?: string; size?: number }) => {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {/* Top squares */}
      <div className="absolute top-0 left-0 w-[40%] h-[40%] bg-clatutor-primary rounded-sm transform hover:scale-105 transition-transform" />
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-clatutor-primary rounded-sm transform hover:scale-105 transition-transform" />
      
      {/* Cross */}
      <div className="absolute left-1/2 top-[15%] w-[20%] h-[85%] bg-clatutor-primary rounded-sm transform -translate-x-1/2 hover:scale-105 transition-transform" />
      <div className="absolute top-[15%] left-[15%] w-[70%] h-[20%] bg-clatutor-primary rounded-sm transform hover:scale-105 transition-transform" />
      
      {/* Bottom squares */}
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-clatutor-primary rounded-sm transform hover:scale-105 transition-transform" />
      <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-clatutor-primary rounded-sm transform hover:scale-105 transition-transform" />
    </div>
  );
};
