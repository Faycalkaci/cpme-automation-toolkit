
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TabItem from './TabItem';
import LicenseManager from '@/components/admin/LicenseManager';
import TemplateManager from '@/components/admin/TemplateManager';

const AdminTabs: React.FC = () => {
  return (
    <Tabs defaultValue="licenses" className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="licenses">Licences</TabsTrigger>
        <TabsTrigger value="templates">Modèles PDF</TabsTrigger>
        <TabsTrigger value="users">Utilisateurs</TabsTrigger>
        <TabsTrigger value="security">Sécurité</TabsTrigger>
      </TabsList>
      
      <TabsContent value="licenses" className="mt-6">
        <LicenseManager />
      </TabsContent>
      
      <TabsContent value="templates" className="mt-6">
        <TemplateManager />
      </TabsContent>
      
      <TabsContent value="users" className="mt-6">
        <TabItem 
          title="Gestion des utilisateurs" 
          description="Gérez les comptes utilisateurs pour toutes les CPME."
          comingSoon
        />
      </TabsContent>
      
      <TabsContent value="security" className="mt-6">
        <TabItem 
          title="Paramètres de sécurité" 
          description="Configurez les paramètres de sécurité globaux."
          comingSoon
        />
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabs;
