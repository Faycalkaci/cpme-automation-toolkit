
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Users, FileText, Shield, Activity } from 'lucide-react';
import LicenseManager from '@/components/admin/LicenseManager';
import TemplateManager from '@/components/admin/TemplateManager';

const SuperAdmin = () => {
  const [stats] = useState([
    {
      title: "Licences actives",
      value: "24",
      description: "Accès à la plateforme",
      icon: <Building className="h-8 w-8 text-primary/60" />,
      change: "+12% depuis le mois dernier"
    },
    {
      title: "Utilisateurs totaux",
      value: "187",
      description: "Utilisateurs enregistrés",
      icon: <Users className="h-8 w-8 text-blue-500/60" />,
      change: "+8% depuis le mois dernier"
    },
    {
      title: "Documents générés",
      value: "1,234",
      description: "PDF générés ce mois-ci",
      icon: <FileText className="h-8 w-8 text-green-500/60" />,
      change: "+27% depuis le mois dernier"
    },
    {
      title: "Taux de conversion",
      value: "68%",
      description: "Essais vers abonnements",
      icon: <Activity className="h-8 w-8 text-purple-500/60" />,
      change: "+4% depuis le mois dernier"
    }
  ]);

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center">
        <Shield className="h-8 w-8 mr-3 text-cpme" />
        Administration système
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-sm font-medium text-slate-500">
                  {stat.title}
                </CardTitle>
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-xs text-slate-500 mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
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
          <Card>
            <CardHeader>
              <CardTitle>Gestion des utilisateurs</CardTitle>
              <CardDescription>
                Gérez les comptes utilisateurs pour toutes les CPME.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 flex items-center justify-center border rounded-lg">
                <p className="text-slate-500">La gestion avancée des utilisateurs sera disponible prochainement.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de sécurité</CardTitle>
              <CardDescription>
                Configurez les paramètres de sécurité globaux.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 flex items-center justify-center border rounded-lg">
                <p className="text-slate-500">Les paramètres de sécurité avancés seront disponibles prochainement.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SuperAdmin;
