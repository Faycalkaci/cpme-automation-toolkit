
import React, { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, 
  FileSpreadsheet, 
  FileText, 
  Settings, 
  Users, 
  CreditCard, 
  ShieldCheck, 
  BarChart, 
  Mail,
  Lock
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isMobile: boolean | undefined;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, isMobile }) => {
  const location = useLocation();
  const { user } = useAuth();
  
  useEffect(() => {
    if (isMobile && isOpen) {
      setIsOpen(false);
    }
  }, [location.pathname, isMobile, isOpen, setIsOpen]);

  const navigationItems = [
    { name: 'Tableau de bord', path: '/dashboard', icon: Home },
    { name: 'Classeurs', path: '/spreadsheets', icon: FileSpreadsheet },
    { name: 'Documents générés', path: '/documents', icon: FileText },
    { name: 'Modèles', path: '/templates', icon: FileText, roles: ['admin', 'super-admin'] },
    { name: 'Emails', path: '/emails', icon: Mail },
  ];

  const adminNavigationItems = [
    { name: 'Utilisateurs', path: '/users', icon: Users, roles: ['admin', 'super-admin'] },
    { name: 'Facturation', path: '/billing', icon: CreditCard, roles: ['admin', 'super-admin'] },
    { name: 'Licences', path: '/licenses', icon: ShieldCheck, roles: ['super-admin'] },
    { name: 'Statistiques', path: '/statistics', icon: BarChart, roles: ['super-admin'] },
    { name: 'Administration', path: '/admin', icon: Lock, roles: ['super-admin'] },
    { name: 'Paramètres', path: '/settings', icon: Settings },
  ];

  const renderNavLink = (item: any) => {
    if (item.roles && !item.roles.includes(user?.role || '')) {
      return null;
    }

    return (
      <NavLink
        key={item.path}
        to={item.path}
        className={({ isActive }) => `
          flex items-center px-3 py-2 my-1 rounded-lg transition-all group
          ${isOpen 
            ? 'justify-start text-left'
            : 'justify-center text-center' 
          }
          ${isActive 
            ? 'text-white font-medium bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md' 
            : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
          }
        `}
        title={item.name}
      >
        <item.icon className={`h-5 w-5 ${isOpen ? 'mr-3' : 'mx-auto'} ${isActive ? 'text-white' : 'group-hover:text-blue-500'}`} />
        {isOpen && <span>{item.name}</span>}
      </NavLink>
    );
  };

  return (
    <>
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside 
        className={`
          fixed lg:sticky top-0 lg:top-16 z-50 lg:z-0 
          h-screen lg:h-[calc(100vh-4rem)]
          bg-white/80 backdrop-blur-md border-r border-slate-200/70
          transition-all duration-300 ease-in-out
          ${isOpen 
            ? 'w-64 shadow-xl' 
            : 'w-16'
          }
          ${isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'}
        `}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200/50">
          {isOpen ? (
            <>
              <h2 className="font-semibold text-lg">Menu</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full hover:bg-red-50 hover:text-red-500">
                <X className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <div className="flex justify-center w-full">
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)} className="rounded-full hover:bg-blue-50 hover:text-blue-500">
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>

        <ScrollArea className="h-[calc(100%-4rem)]">
          <div className={`py-6 ${isOpen ? 'px-4' : 'px-2'} space-y-6`}>
            <div className="space-y-1">
              {navigationItems.map(renderNavLink)}
            </div>

            <Separator className="bg-slate-200/70" />

            <div className="space-y-1">
              {adminNavigationItems.map(renderNavLink)}
            </div>
          </div>
        </ScrollArea>
      </aside>
    </>
  );
};

export default Sidebar;
