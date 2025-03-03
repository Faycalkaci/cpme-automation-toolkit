
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { FileText, Users, Key, Upload, Download, X, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface License {
  id: string;
  organizationName: string;
  organizationId: string;
  adminEmail: string;
  status: 'active' | 'expired' | 'pending';
  userLimit: number;
  currentUsers: number;
  expiryDate: string;
}

interface Template {
  id: string;
  name: string;
  type: 'appel' | 'rappel' | 'facture';
  lastUpdated: string;
  version: string;
  status: 'active' | 'draft';
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  organizationName: string;
  lastLogin: string;
  deviceCount: number;
}

const SuperAdmin = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Rediriger si l'utilisateur n'est pas un super admin
  React.useEffect(() => {
    if (user && user.role !== 'super-admin') {
      navigate('/dashboard');
      toast({
        title: "Accès refusé",
        description: "Vous n'avez pas les autorisations nécessaires pour accéder à cette page.",
        variant: "destructive"
      });
    }
  }, [user, navigate, toast]);

  // États pour les différentes sections
  const [licenses, setLicenses] = useState<License[]>([
    {
      id: '1',
      organizationName: 'CPME Seine-Saint-Denis',
      organizationId: '93',
      adminEmail: 'admin@cpme93.fr',
      status: 'active',
      userLimit: 10,
      currentUsers: 5,
      expiryDate: '2024-12-31'
    },
    {
      id: '2',
      organizationName: 'CPME Val-de-Marne',
      organizationId: '94',
      adminEmail: 'admin@cpme94.fr',
      status: 'active',
      userLimit: 5,
      currentUsers: 3,
      expiryDate: '2024-10-15'
    },
    {
      id: '3',
      organizationName: 'CPME Paris',
      organizationId: '75',
      adminEmail: 'admin@cpme75.fr',
      status: 'expired',
      userLimit: 15,
      currentUsers: 0,
      expiryDate: '2024-01-31'
    }
  ]);

  const [templates, setTemplates] = useState<Template[]>([
    {
      id: '1',
      name: 'Appel de cotisation standard',
      type: 'appel',
      lastUpdated: '2024-05-01',
      version: '1.2',
      status: 'active'
    },
    {
      id: '2',
      name: 'Facture CPME',
      type: 'facture',
      lastUpdated: '2024-04-15',
      version: '1.0',
      status: 'active'
    },
    {
      id: '3',
      name: 'Rappel de cotisation',
      type: 'rappel',
      lastUpdated: '2024-03-22',
      version: '1.1',
      status: 'active'
    }
  ]);

  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Marie-Claire Dupont',
      email: 'marie-claire@cpme93.fr',
      role: 'user',
      organizationName: 'CPME Seine-Saint-Denis',
      lastLogin: '2024-05-10 09:30',
      deviceCount: 1
    },
    {
      id: '2',
      name: 'Valérie Martin',
      email: 'valerie@cpme93.fr',
      role: 'admin',
      organizationName: 'CPME Seine-Saint-Denis',
      lastLogin: '2024-05-10 08:15',
      deviceCount: 2
    },
    {
      id: '3',
      name: 'Jean Dubois',
      email: 'jean@cpme94.fr',
      role: 'admin',
      organizationName: 'CPME Val-de-Marne',
      lastLogin: '2024-05-09 16:45',
      deviceCount: 1
    }
  ]);

  // Gestion des licences
  const createLicense = () => {
    // Logique pour créer une nouvelle licence
    toast({
      title: "Licence créée",
      description: "La nouvelle licence a été créée avec succès."
    });
  };

  const revokeLicense = (id: string) => {
    // Logique pour révoquer une licence
    setLicenses(prev => prev.map(license => 
      license.id === id ? { ...license, status: 'expired' } : license
    ));
    
    toast({
      title: "Licence révoquée",
      description: "La licence a été révoquée avec succès."
    });
  };

  // Gestion des templates
  const handleTemplateUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      
      // Vérifier le format du fichier
      if (!file.name.endsWith('.pdf')) {
        toast({
          title: "Format non supporté",
          description: "Veuillez télécharger un fichier PDF.",
          variant: "destructive"
        });
        return;
      }
      
      // Simuler le téléchargement
      toast({
        title: "Template en cours de téléchargement",
        description: "Veuillez patienter pendant le téléchargement du template..."
      });
      
      // Simuler un délai
      setTimeout(() => {
        const newTemplate: Template = {
          id: (templates.length + 1).toString(),
          name: file.name.replace('.pdf', ''),
          type: file.name.toLowerCase().includes('appel') ? 'appel' : 
                file.name.toLowerCase().includes('rappel') ? 'rappel' : 'facture',
          lastUpdated: new Date().toISOString().split('T')[0],
          version: '1.0',
          status: 'draft'
        };
        
        setTemplates(prev => [...prev, newTemplate]);
        
        toast({
          title: "Template ajouté",
          description: "Le template a été ajouté avec succès."
        });
      }, 1500);
    }
  };

  const activateTemplate = (id: string) => {
    setTemplates(prev => prev.map(template => 
      template.id === id ? { ...template, status: 'active' } : template
    ));
    
    toast({
      title: "Template activé",
      description: "Le template est maintenant actif et disponible pour les utilisateurs."
    });
  };

  const deleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(template => template.id !== id));
    
    toast({
      title: "Template supprimé",
      description: "Le template a été supprimé avec succès."
    });
  };

  // Gestion des utilisateurs
  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
    
    toast({
      title: "Utilisateur supprimé",
      description: "L'utilisateur a été supprimé avec succès."
    });
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Administration</h1>
        <p className="text-slate-600 mb-6">
          Gérez les licences, les templates et les utilisateurs
        </p>

        <Tabs defaultValue="licenses">
          <TabsList className="mb-6">
            <TabsTrigger value="licenses" className="flex items-center">
              <Key className="h-4 w-4 mr-2" />
              Licences
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Utilisateurs
            </TabsTrigger>
          </TabsList>
          
          {/* Tab: Licences */}
          <TabsContent value="licenses">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Gestion des licences</CardTitle>
                  <CardDescription>
                    {licenses.length} licences actives
                  </CardDescription>
                </div>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Créer une licence</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Créer une nouvelle licence</DialogTitle>
                      <DialogDescription>
                        Remplissez les informations pour créer une licence pour une nouvelle CPME.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label htmlFor="org-name" className="text-sm font-medium">Nom de l'organisation</label>
                        <Input id="org-name" placeholder="CPME Département" />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="org-id" className="text-sm font-medium">Identifiant département</label>
                        <Input id="org-id" placeholder="XX" />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="admin-email" className="text-sm font-medium">Email administrateur</label>
                        <Input id="admin-email" type="email" placeholder="admin@cpmeXX.fr" />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="user-limit" className="text-sm font-medium">Limite d'utilisateurs</label>
                        <Input id="user-limit" type="number" defaultValue="5" />
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button type="button" variant="outline">Annuler</Button>
                      <Button type="button" onClick={createLicense}>Créer</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Organisation</TableHead>
                        <TableHead>Admin</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Utilisateurs</TableHead>
                        <TableHead>Expiration</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {licenses.map((license) => (
                        <TableRow key={license.id}>
                          <TableCell className="font-medium">
                            {license.organizationName}
                            <div className="text-xs text-slate-500">ID: {license.organizationId}</div>
                          </TableCell>
                          <TableCell>{license.adminEmail}</TableCell>
                          <TableCell>
                            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              license.status === 'active' ? 'bg-green-100 text-green-800' :
                              license.status === 'expired' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {license.status === 'active' ? 'Active' : 
                               license.status === 'expired' ? 'Expirée' : 'En attente'}
                            </div>
                          </TableCell>
                          <TableCell>{license.currentUsers} / {license.userLimit}</TableCell>
                          <TableCell>{license.expiryDate}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm">
                                Renouveler
                              </Button>
                              {license.status === 'active' && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-red-500 hover:text-red-700"
                                  onClick={() => revokeLicense(license.id)}
                                >
                                  Révoquer
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Tab: Templates */}
          <TabsContent value="templates">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Gestion des templates</CardTitle>
                  <CardDescription>
                    {templates.length} templates disponibles
                  </CardDescription>
                </div>
                
                <div>
                  <Button className="flex items-center gap-2" asChild>
                    <label>
                      <Upload className="h-4 w-4" />
                      Importer un template
                      <input
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={handleTemplateUpload}
                      />
                    </label>
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Version</TableHead>
                        <TableHead>Dernière mise à jour</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {templates.map((template) => (
                        <TableRow key={template.id}>
                          <TableCell className="font-medium">
                            {template.name}
                          </TableCell>
                          <TableCell>
                            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              template.type === 'appel' ? 'bg-blue-100 text-blue-800' :
                              template.type === 'rappel' ? 'bg-amber-100 text-amber-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {template.type === 'appel' ? 'Appel de cotisation' : 
                               template.type === 'rappel' ? 'Rappel de cotisation' : 'Facture'}
                            </div>
                          </TableCell>
                          <TableCell>v{template.version}</TableCell>
                          <TableCell>{template.lastUpdated}</TableCell>
                          <TableCell>
                            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              template.status === 'active' ? 'bg-green-100 text-green-800' :
                              'bg-slate-100 text-slate-800'
                            }`}>
                              {template.status === 'active' ? 'Actif' : 'Brouillon'}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                              
                              {template.status === 'draft' && (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => activateTemplate(template.id)}
                                  className="text-green-500 hover:text-green-700"
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                </Button>
                              )}
                              
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => deleteTemplate(template.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Tab: Utilisateurs */}
          <TabsContent value="users">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Gestion des utilisateurs</CardTitle>
                  <CardDescription>
                    {users.length} utilisateurs enregistrés
                  </CardDescription>
                </div>
                
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Rechercher un utilisateur..."
                    className="max-w-xs"
                  />
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Rôle</TableHead>
                        <TableHead>Organisation</TableHead>
                        <TableHead>Dernière connexion</TableHead>
                        <TableHead>Appareils</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            {user.name}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                            </div>
                          </TableCell>
                          <TableCell>{user.organizationName}</TableCell>
                          <TableCell>{user.lastLogin}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {user.deviceCount} / 3
                              {user.deviceCount === 3 && (
                                <AlertTriangle className="h-4 w-4 text-amber-500 ml-1" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm">
                                Détails
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-500 hover:text-red-700"
                                onClick={() => deleteUser(user.id)}
                              >
                                Supprimer
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default SuperAdmin;
