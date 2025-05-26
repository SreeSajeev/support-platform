
import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = "IT PORTAL" }) => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener('scroll', handleScroll);
    
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);
  
  const handleLogoClick = () => {
    navigate('/');
    setMobileMenuOpen(false);
  };
  
  return (
    <div className={`w-full sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? 'shadow-lg' : ''}`}>
      <div 
        className={`header-bg w-full h-[53px] flex items-center justify-between px-4 md:px-8 transition-all duration-300 ${
          scrolled ? 'bg-opacity-95' : 'bg-opacity-100'
        }`}
      >
        <div 
          onClick={handleLogoClick} 
          className="cursor-pointer transform hover:scale-105 transition-transform duration-200"
          aria-label="Return to homepage"
        >
          <Logo />
        </div>
        
        <div className="flex items-center">
          <h1 
            className={`lt-title hidden md:block mr-4 hover:text-white transition-colors duration-300 ${
              scrolled ? 'animate-pulse' : ''
            }`}
          >
            {title}
          </h1>
          
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2 hover:bg-lt-brightBlue rounded-full transition-colors duration-300"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      
      {/* Empty nav bar - dashboard section removed */}
      <div className="nav-bg w-full h-[29px] flex items-center px-4 md:px-8">
      </div>
      
      {/* Mobile menu */}
      <div 
        className={`md:hidden bg-white shadow-lg transform transition-transform duration-300 absolute w-full ${
          mobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="p-4">
          <h1 className="text-lt-darkBlue font-bold text-xl mb-2">{title}</h1>
        </div>
      </div>
    </div>
  );
};

export default Header;
