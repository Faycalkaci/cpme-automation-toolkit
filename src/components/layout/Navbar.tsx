
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface NavbarProps {
  onMenuClick: () => void;
  scrolled?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({
  onMenuClick,
  scrolled = false
}) => {
  const {
    user,
    isAuthenticated,
    logout
  } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <nav className={`sticky top-0 z-40 w-full transition-all duration-300 ${
      scrolled 
        ? 'bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-md' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {isAuthenticated && 
              <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden mr-2">
                <Menu className="h-5 w-5" />
              </Button>
            }
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold">CT</span>
              </div>
              <span className="font-bold text-lg tracking-tight">cpmetool.fr</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 hover:bg-slate-100 group p-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center overflow-hidden group-hover:shadow-md transition-shadow">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex flex-col items-start text-sm">
                      <span className="font-medium">{user?.name}</span>
                      <span className="text-xs text-slate-500">{user?.role === 'super-admin' ? 'Super Admin' : user?.role === 'admin' ? 'Admin CPME' : 'Utilisateur'}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-slate-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white shadow-lg rounded-lg border border-slate-200">
                  <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer hover:bg-slate-50">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer hover:bg-slate-50">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Déconnexion</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" onClick={() => navigate('/login')} className="rounded-lg">
                  Connexion
                </Button>
                <Button onClick={() => navigate('/register')} className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-md hover:shadow-blue-500/20">
                  Inscription
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
