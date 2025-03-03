
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { KeyRound } from 'lucide-react';

const PasswordManagement = () => {
  const { toast } = useToast();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
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

  return (
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
  );
};

export default PasswordManagement;
