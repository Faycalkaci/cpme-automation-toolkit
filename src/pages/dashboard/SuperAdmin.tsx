
import React from 'react';
import { Shield } from 'lucide-react';
import StatsSection from '@/components/admin/dashboard/StatsSection';
import AdminTabs from '@/components/admin/dashboard/AdminTabs';

const SuperAdmin = () => {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center">
        <Shield className="h-8 w-8 mr-3 text-cpme" />
        Administration système
      </h1>
      
      <StatsSection />
      <AdminTabs />
    </div>
  );
};

export default SuperAdmin;
