
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

const MainLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar onMenuClick={toggleSidebar} />
      
      <div className="flex flex-1 w-full">
        {isAuthenticated && (
          <Sidebar 
            isOpen={sidebarOpen} 
            setIsOpen={setSidebarOpen}
            isMobile={isMobile}
          />
        )}
        
        <main className={`flex-1 transition-all duration-300 ease-in-out ${isAuthenticated ? (isMobile ? 'w-full' : 'ml-0 lg:ml-64') : 'w-full'}`}>
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default MainLayout;
