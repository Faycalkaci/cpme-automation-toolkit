
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { AlertTriangle, Check, KeyRound, MailIcon, Shield, Smartphone, User } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const Settings = () => {
  const { toast } = useToast();
  const { user, enableTwoFactorAuth, verifyTwoFactorCode, isTwoFactorEnabled, getDeviceCount, MAX_DEVICES } = useAuth();
  
  const [fullname, setFullname] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showTwoFactorDialog, setShowTwoFactorDialog] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  
  // Obtenir les initiales de l'utilisateur pour l'avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  const handleSaveProfile = () => {
    toast({
      title: "Profil mis à jour",
      description: "Vos informations de profil ont été mises à jour avec succès."
    });
  };
  
  const handleChangePassword = () => {
    if (!currentPassword || !newPassword) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Mot de passe modifié",
      description: "Votre mot de passe a été modifié avec succès."
    });
    
    setCurrentPassword('');
    setNewPassword('');
  };
  
  const handleEnableTwoFactor = async () => {
    try {
      await enableTwoFactorAuth();
      setShowTwoFactorDialog(true);
    } catch (error) {
      console.error('Erreur lors de l\'activation 2FA:', error);
    }
  };
  
  const handleVerifyTwoFactorCode = async () => {
    try {
      const isValid = await verifyTwoFactorCode(twoFactorCode);
      
      if (isValid) {
        setShowTwoFactorDialog(false);
        setTwoFactorCode('');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du code:', error);
    }
  };
  
  const deviceCount = getDeviceCount();
  const deviceLimit = MAX_DEVICES;
  
  return (
    <div className="p-6 lg:p-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Paramètres</h1>
        <p className="text-slate-600 mb-6">
          Gérez votre profil, la sécurité et les notifications
        </p>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="profile" className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              Sécurité
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center">
              <MailIcon className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
          </TabsList>
          
          {/* Onglet Profil */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Informations de profil</CardTitle>
                <CardDescription>
                  Mettez à jour vos informations personnelles
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <div className="flex-shrink-0">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="" />
                      <AvatarFallback className="text-xl">
                        {user ? getInitials(user.name) : '?'}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  <div className="space-y-4 flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullname">Nom complet</Label>
                        <Input 
                          id="fullname" 
                          value={fullname} 
                          onChange={(e) => setFullname(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Adresse email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Organisation</Label>
                      <div className="p-2 bg-slate-100 rounded text-slate-700">
                        {user?.organizationName || 'CPME Tool'}
                        {user?.role === 'admin' && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            Administrateur
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-end">
                <Button onClick={handleSaveProfile}>
                  Enregistrer les modifications
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Onglet Sécurité */}
          <TabsContent value="security">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Modification du mot de passe */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <KeyRound className="h-5 w-5 text-slate-500" />
                    <CardTitle>Mot de passe</CardTitle>
                  </div>
                  <CardDescription>
                    Changez votre mot de passe
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Mot de passe actuel</Label>
                    <Input 
                      id="current-password" 
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nouveau mot de passe</Label>
                    <Input 
                      id="new-password" 
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  
                  <div className="text-sm text-slate-500">
                    <p>Votre mot de passe doit contenir :</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Au moins 8 caractères</li>
                      <li>Des lettres majuscules et minuscules</li>
                      <li>Au moins un chiffre</li>
                    </ul>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    onClick={handleChangePassword} 
                    className="w-full"
                  >
                    Modifier le mot de passe
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Authentification à deux facteurs */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-slate-500" />
                    <CardTitle>Authentification à deux facteurs</CardTitle>
                  </div>
                  <CardDescription>
                    Renforcez la sécurité de votre compte
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>État de la 2FA</Label>
                      <p className="text-sm text-slate-500">
                        {isTwoFactorEnabled ? 
                          "L'authentification à deux facteurs est activée" : 
                          "L'authentification à deux facteurs est désactivée"}
                      </p>
                    </div>
                    <Switch checked={isTwoFactorEnabled} onCheckedChange={handleEnableTwoFactor} />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-5 w-5 text-slate-500" />
                      <Label>Appareils connectés</Label>
                    </div>
                    
                    <div className="p-3 rounded-md bg-slate-50">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Limite d'appareils</span>
                        <span className="text-sm">{deviceCount} / {deviceLimit}</span>
                      </div>
                      
                      <div className="h-2 bg-slate-200 rounded-full">
                        <div 
                          className={`h-2 rounded-full ${
                            deviceCount === deviceLimit ? 'bg-red-500' : 'bg-green-500'
                          }`} 
                          style={{ width: `${(deviceCount / deviceLimit) * 100}%` }}
                        ></div>
                      </div>
                      
                      {deviceCount === deviceLimit && (
                        <p className="text-xs text-amber-600 mt-2 flex items-center">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Vous avez atteint la limite d'appareils autorisés
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full"
                  >
                    Gérer les appareils connectés
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            {/* Alerte de sécurité */}
            <Alert className="mt-6 border-yellow-200 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertTitle className="text-yellow-800">Rappel de sécurité</AlertTitle>
              <AlertDescription className="text-yellow-700">
                Pour votre sécurité, ne partagez jamais vos identifiants et activez l'authentification à deux facteurs.
              </AlertDescription>
            </Alert>
          </TabsContent>
          
          {/* Onglet Notifications */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Préférences de notifications</CardTitle>
                <CardDescription>
                  Gérez les notifications que vous recevez
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notifications par email</Label>
                      <p className="text-sm text-slate-500">
                        Recevoir des emails concernant vos activités et documents
                      </p>
                    </div>
                    <Switch 
                      checked={emailNotifications} 
                      onCheckedChange={setEmailNotifications} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Alertes de sécurité</Label>
                      <p className="text-sm text-slate-500">
                        Recevoir des alertes concernant les connexions suspectes
                      </p>
                    </div>
                    <Switch 
                      checked={securityAlerts} 
                      onCheckedChange={setSecurityAlerts} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Rappels d'échéance</Label>
                      <p className="text-sm text-slate-500">
                        Recevoir des rappels pour les échéances importantes
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notifications marketing</Label>
                      <p className="text-sm text-slate-500">
                        Recevoir des informations sur les nouvelles fonctionnalités
                      </p>
                    </div>
                    <Switch defaultChecked={false} />
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button onClick={() => {
                  toast({
                    title: "Préférences enregistrées",
                    description: "Vos préférences de notifications ont été mises à jour."
                  });
                }}>
                  Enregistrer les préférences
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
      
      {/* Dialog pour l'activation de la 2FA */}
      <Dialog open={showTwoFactorDialog} onOpenChange={setShowTwoFactorDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Vérification à deux facteurs</DialogTitle>
            <DialogDescription>
              Nous avons envoyé un code à 6 chiffres à votre adresse email. Veuillez le saisir ci-dessous pour activer l'authentification à deux facteurs.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="verification-code">Code de vérification</Label>
              <Input 
                id="verification-code" 
                placeholder="123456" 
                maxLength={6}
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
              />
              <p className="text-xs text-slate-500">
                Pour cette démo, vous pouvez entrer n'importe quel code à 6 chiffres.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTwoFactorDialog(false)}>
              Annuler
            </Button>
            <Button type="button" onClick={handleVerifyTwoFactorCode}>
              Vérifier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;
