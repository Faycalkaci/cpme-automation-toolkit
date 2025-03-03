
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <span className="tracking-tight my-0 py-0 text-2xl font-bold mx-[5px] px-[23px] text-[#0069da]">CPME Tool</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-medium text-slate-700 hover:text-cpme transition-colors">
              Fonctionnalités
            </a>
            <a href="#pricing" className="text-sm font-medium text-slate-700 hover:text-cpme transition-colors">
              Tarifs
            </a>
            <a href="#about" className="text-sm font-medium text-slate-700 hover:text-cpme transition-colors">
              À propos
            </a>
          </nav>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" onClick={() => navigate('/login')}>
              Se connecter
            </Button>
            <Button onClick={() => navigate('/register')}>
              S'inscrire
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
