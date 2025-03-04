import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToHowItWorks = () => {
    const howItWorksSection = document.getElementById('how-it-works');
    if (howItWorksSection) {
      howItWorksSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2" onClick={scrollToTop}>
            <div className="h-10 w-10 rounded-lg bg-blue-gradient flex items-center justify-center text-white font-bold text-lg">CT</div>
            <span className="text-xl font-bold text-slate-800">cpmetool.fr</span>
            <ChevronUp className="h-4 w-4 text-slate-600" />
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-medium text-slate-700 hover:text-primary transition-colors">
              Fonctionnalités
            </a>
            <Button 
              variant="ghost" 
              onClick={scrollToHowItWorks}
              className="text-sm font-medium text-slate-700 hover:text-primary transition-colors flex items-center"
            >
              Comment ça marche
              <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
            <a href="#about" className="text-sm font-medium text-slate-700 hover:text-primary transition-colors">
              À propos
            </a>
            <a href="#pricing" className="text-sm font-medium text-slate-700 hover:text-primary transition-colors">
              Tarifs
            </a>
          </nav>

          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => navigate('/login')} className="shadow-subtle hover:shadow-md transition-all">
              Se connecter
            </Button>
            <Button onClick={() => navigate('/register')} className="shadow-md hover:shadow-lg transition-all bg-primary text-white">
              S'inscrire
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
