
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Lock, 
  Building, 
  Mail, 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Users, 
  LogOut 
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    organization: user?.organizationName || 'CPME Seine-Saint-Denis',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    documentGenerated: true,
    emailSent: true,
    loginAlerts: true
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (name: string, checked: boolean) => {
    setNotifications(prev => ({ ...prev, [name]: checked }));
  };

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profil mis à jour",
      description: "Vos informations de profil ont été mises à jour avec succès."
    });
  };

  const changePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas.",
        variant: "destructive"
      });
      return;
    }
    
    if (formData.newPassword.length < 6) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 6 caractères.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Mot de passe modifié",
      description: "Votre mot de passe a été modifié avec succès."
    });
    
    setFormData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
  };

  const saveNotifications = () => {
    toast({
      title: "Préférences de notification enregistrées",
      description: "Vos préférences de notification ont été mises à jour avec succès."
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'super-admin';
  const isSuperAdmin = user?.role === 'super-admin';

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Paramètres</h1>
        <p className="text-slate-600 mb-6">
          Gérez votre compte et vos préférences
        </p>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:w-auto">
            <TabsTrigger value="profile" className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center">
              <Lock className="h-4 w-4 mr-2" />
              Sécurité
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="organization" className="flex items-center">
                <Building className="h-4 w-4 mr-2" />
                Organisation
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <form onSubmit={saveProfile}>
                <CardHeader>
                  <CardTitle>Informations du profil</CardTitle>
                  <CardDescription>
                    Modifiez vos informations personnelles
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Adresse email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organization">Organisation</Label>
                    <Input
                      id="organization"
                      name="organization"
                      value={formData.organization}
                      onChange={handleInputChange}
                      disabled={!isAdmin}
                    />
                    {!isAdmin && (
                      <p className="text-xs text-slate-500 mt-1">
                        Seuls les administrateurs peuvent modifier le nom de l'organisation.
                      </p>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" type="button">
                    Annuler
                  </Button>
                  <Button type="submit">
                    Enregistrer
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              <Card>
                <form onSubmit={changePassword}>
                  <CardHeader>
                    <CardTitle>Changer le mot de passe</CardTitle>
                    <CardDescription>
                      Mettez à jour votre mot de passe pour sécuriser votre compte
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full">
                      Changer le mot de passe
                    </Button>
                  </CardFooter>
                </form>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Options de sécurité</CardTitle>
                  <CardDescription>
                    Gérez les paramètres de sécurité de votre compte
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Authentification à deux facteurs</Label>
                      <p className="text-sm text-slate-500">
                        Ajouter une couche de sécurité supplémentaire à votre compte
                      </p>
                    </div>
                    <Button variant="outline">Configurer</Button>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Sessions actives</Label>
                      <p className="text-sm text-slate-500">
                        Gérez les appareils connectés à votre compte
                      </p>
                    </div>
                    <Button variant="outline">Gérer</Button>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Déconnexion</Label>
                      <p className="text-sm text-slate-500">
                        Se déconnecter de toutes les sessions
                      </p>
                    </div>
                    <Button variant="destructive" onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Déconnexion
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Préférences de notification</CardTitle>
                <CardDescription>
                  Choisissez quand et comment vous souhaitez être notifié
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notifications par email</Label>
                    <p className="text-sm text-slate-500">
                      Recevoir des notifications par email
                    </p>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Document généré</Label>
                    <p className="text-sm text-slate-500">
                      Notification lorsqu'un document est généré
                    </p>
                  </div>
                  <Switch
                    checked={notifications.documentGenerated}
                    onCheckedChange={(checked) => handleNotificationChange('documentGenerated', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email envoyé</Label>
                    <p className="text-sm text-slate-500">
                      Notification lorsqu'un email est envoyé
                    </p>
                  </div>
                  <Switch
                    checked={notifications.emailSent}
                    onCheckedChange={(checked) => handleNotificationChange('emailSent', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Alertes de connexion</Label>
                    <p className="text-sm text-slate-500">
                      Notification lors d'une connexion depuis un nouvel appareil
                    </p>
                  </div>
                  <Switch
                    checked={notifications.loginAlerts}
                    onCheckedChange={(checked) => handleNotificationChange('loginAlerts', checked)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  onClick={saveNotifications}
                >
                  Enregistrer les préférences
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {isAdmin && (
            <TabsContent value="organization">
              <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Informations de l'organisation</CardTitle>
                    <CardDescription>
                      Modifier les détails de votre organisation
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="orgName">Nom de l'organisation</Label>
                      <Input
                        id="orgName"
                        defaultValue={user?.organizationName || "CPME Seine-Saint-Denis"}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="orgEmail">Email de contact</Label>
                      <Input
                        id="orgEmail"
                        type="email"
                        defaultValue="contact@cpme93.fr"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="orgAddress">Adresse</Label>
                      <Input
                        id="orgAddress"
                        defaultValue="45 avenue Victor Hugo, 93000 Bobigny"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">
                      Enregistrer les modifications
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>
                      {isSuperAdmin ? "Gestion des licences" : "Information de licence"}
                    </CardTitle>
                    <CardDescription>
                      {isSuperAdmin 
                        ? "Gérez les licences attribuées à cette organisation" 
                        : "Détails de votre licence CPME Tool"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isSuperAdmin ? (
                      <>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Licences actives</Label>
                            <p className="text-sm text-slate-500">
                              Nombre total de licences actives
                            </p>
                          </div>
                          <span className="font-medium text-lg">
                            5 / 10
                          </span>
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Ajouter des licences</Label>
                            <p className="text-sm text-slate-500">
                              Attribuer plus de licences à cette organisation
                            </p>
                          </div>
                          <Button variant="outline">
                            Gérer les licences
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Type de licence</Label>
                              <p className="text-sm text-slate-500">
                                Votre forfait actuel
                              </p>
                            </div>
                            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                              Premium
                            </span>
                          </div>

                          <Separator />

                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Utilisateurs autorisés</Label>
                              <p className="text-sm text-slate-500">
                                Nombre d'utilisateurs inclus dans votre forfait
                              </p>
                            </div>
                            <span className="font-medium">10 utilisateurs</span>
                          </div>

                          <Separator />

                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Date de renouvellement</Label>
                              <p className="text-sm text-slate-500">
                                Votre prochaine facturation
                              </p>
                            </div>
                            <span className="font-medium">15/06/2023</span>
                          </div>
                        </div>

                        <Button variant="outline" className="w-full mt-4">
                          Mettre à niveau mon forfait
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>

                {isAdmin && (
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle>Gestion des utilisateurs</CardTitle>
                      <CardDescription>
                        Gérez les utilisateurs de votre organisation
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="border rounded-md overflow-hidden">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-slate-50 text-left">
                              <th className="p-3 text-slate-500 font-medium text-sm">Utilisateur</th>
                              <th className="p-3 text-slate-500 font-medium text-sm">Email</th>
                              <th className="p-3 text-slate-500 font-medium text-sm">Rôle</th>
                              <th className="p-3 text-slate-500 font-medium text-sm">Statut</th>
                              <th className="p-3 text-slate-500 font-medium text-sm text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-t border-slate-200">
                              <td className="p-3">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                                    <User className="h-4 w-4 text-primary" />
                                  </div>
                                  <span className="font-medium text-slate-900">Jean Dupont</span>
                                </div>
                              </td>
                              <td className="p-3 text-slate-700">jean.dupont@example.com</td>
                              <td className="p-3">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                  Admin
                                </span>
                              </td>
                              <td className="p-3">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Actif
                                </span>
                              </td>
                              <td className="p-3 text-right">
                                <Button variant="ghost" size="sm">
                                  Modifier
                                </Button>
                              </td>
                            </tr>
                            <tr className="border-t border-slate-200">
                              <td className="p-3">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mr-2">
                                    <User className="h-4 w-4 text-slate-500" />
                                  </div>
                                  <span className="font-medium text-slate-900">Marie Martin</span>
                                </div>
                              </td>
                              <td className="p-3 text-slate-700">marie.martin@example.com</td>
                              <td className="p-3">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  Utilisateur
                                </span>
                              </td>
                              <td className="p-3">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Actif
                                </span>
                              </td>
                              <td className="p-3 text-right">
                                <Button variant="ghost" size="sm">
                                  Modifier
                                </Button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="ml-auto">
                        <Users className="h-4 w-4 mr-2" />
                        Ajouter un utilisateur
                      </Button>
                    </CardFooter>
                  </Card>
                )}
              </div>
            </TabsContent>
          )}
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Settings;
