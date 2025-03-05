
import React, { useState, useEffect } from 'react';
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
  const [scrolled, setScrolled] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background aceternity-bg-grid">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white [mask-image:radial-gradient(ellipse_at_top,white,transparent)] pointer-events-none"></div>
      
      <Navbar 
        onMenuClick={toggleSidebar}
        scrolled={scrolled}
      />
      
      <div className="flex flex-1 w-full relative z-10">
        {isAuthenticated && (
          <Sidebar 
            isOpen={sidebarOpen} 
            setIsOpen={setSidebarOpen}
            isMobile={isMobile}
          />
        )}
        
        <main className={`flex-1 transition-all duration-300 ease-in-out ${isAuthenticated ? (isMobile ? 'w-full' : sidebarOpen ? 'ml-64' : 'ml-16') : 'w-full'}`}>
          <div className="container mx-auto px-4 animate-fade-in max-w-6xl py-6">
            <Outlet />
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default MainLayout;
