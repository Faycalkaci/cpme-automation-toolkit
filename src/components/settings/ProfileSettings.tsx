
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { User } from '@/contexts/auth/types';

interface ProfileSettingsProps {
  user: User | null;
}

const ProfileSettings = ({ user }: ProfileSettingsProps) => {
  const { toast } = useToast();
  const [fullname, setFullname] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  
  // Get initials of the user for the avatar fallback
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

  return (
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
  );
};

export default ProfileSettings;
