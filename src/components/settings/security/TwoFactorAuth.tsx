
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import DeviceManager from './DeviceManager';

const TwoFactorAuth = () => {
  const { 
    enableTwoFactorAuth, 
    verifyTwoFactorCode, 
    isTwoFactorEnabled
  } = useAuth();
  
  const [showTwoFactorDialog, setShowTwoFactorDialog] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  
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

  return (
    <>
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
          
          <DeviceManager />
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

export default TwoFactorAuth;
