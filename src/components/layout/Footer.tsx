
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white border-t border-slate-200/50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-cpme flex items-center justify-center">
                <span className="text-white font-bold text-xs">CT</span>
              </div>
              <span className="font-bold text-sm">cpmetool.fr</span>
            </div>
            <p className="text-sm text-slate-500 mt-2">
              &copy; {currentYear} cpmetool.fr. Tous droits réservés.
            </p>
          </div>

          <div className="flex flex-wrap justify-center space-x-4 text-sm text-slate-600">
            <Link to="/about" className="hover:text-primary transition-colors">
              À propos
            </Link>
            <Link to="/contact" className="hover:text-primary transition-colors">
              Contact
            </Link>
            <Link to="/terms" className="hover:text-primary transition-colors">
              Conditions d'utilisation
            </Link>
            <Link to="/privacy" className="hover:text-primary transition-colors">
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
