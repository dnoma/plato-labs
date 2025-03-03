
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);
  
  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300 px-6 md:px-10",
        scrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-serif font-bold text-plato-900">PLATO</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-sm text-foreground/80 hover:text-plato-700 transition-colors">Features</a>
          <a href="#benefits" className="text-sm text-foreground/80 hover:text-plato-700 transition-colors">Benefits</a>
          <a href="#how-it-works" className="text-sm text-foreground/80 hover:text-plato-700 transition-colors">How It Works</a>
        </nav>
        
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:inline-flex text-plato-900 border-plato-300 hover:bg-plato-50"
          >
            Log in
          </Button>
          <Button
            size="sm"
            className="bg-plato-600 text-white hover:bg-plato-700"
          >
            Sign up
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
