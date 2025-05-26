
import React from 'react';
import ltLogo from '../assets/L&T Valves Logo.png';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center justify-center group h-[82px]">
      <div className="logo-container w-[42px] h-[42px] flex items-center justify-center overflow-hidden">
        <img 
          src={ltLogo} 
          alt="L&T Logo" 
          className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-300"
        />
      </div>
    </div>
  );
};

export default Logo;
