
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white/70 backdrop-blur-md border-t border-slate-200/50 py-8 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold text-xs">CT</span>
              </div>
              <span className="font-bold text-sm">cpmetool.fr</span>
            </div>
            <p className="text-sm text-slate-500 mt-2">
              &copy; {currentYear} cpmetool.fr. Tous droits réservés.
            </p>
          </div>

          <div className="flex flex-wrap justify-center space-x-6 text-sm">
            <Link to="/about" className="text-slate-600 hover:text-blue-600 transition-colors">
              À propos
            </Link>
            <Link to="/contact" className="text-slate-600 hover:text-blue-600 transition-colors">
              Contact
            </Link>
            <Link to="/terms" className="text-slate-600 hover:text-blue-600 transition-colors">
              Conditions d'utilisation
            </Link>
            <Link to="/privacy" className="text-slate-600 hover:text-blue-600 transition-colors">
              Politique de confidentialité
            </Link>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-slate-200/50 text-center text-xs text-slate-400">
          <p>Conçu avec ❤️ pour les CPME de France</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
