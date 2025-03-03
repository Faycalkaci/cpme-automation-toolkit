
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { AlertTriangle, KeyRound, Shield, Smartphone } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const SecuritySettings = () => {
  const { toast } = useToast();
  const { 
    enableTwoFactorAuth, 
    verifyTwoFactorCode, 
    isTwoFactorEnabled, 
    getDeviceCount, 
    MAX_DEVICES 
  } = useAuth();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showTwoFactorDialog, setShowTwoFactorDialog] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  
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
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Password Change Card */}
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
        
        {/* Two-Factor Auth Card */}
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
      
      {/* Security Alert */}
      <Alert className="mt-6 border-yellow-200 bg-yellow-50">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertTitle className="text-yellow-800">Rappel de sécurité</AlertTitle>
        <AlertDescription className="text-yellow-700">
          Pour votre sécurité, ne partagez jamais vos identifiants et activez l'authentification à deux facteurs.
        </AlertDescription>
      </Alert>

      {/* Two-Factor Dialog */}
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
    </>
  );
};

export default SecuritySettings;
