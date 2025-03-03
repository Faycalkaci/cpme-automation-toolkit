
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';

const NotificationSettings = () => {
  const { toast } = useToast();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);

  const handleSavePreferences = () => {
    toast({
      title: "Préférences enregistrées",
      description: "Vos préférences de notifications ont été mises à jour."
    });
  };

  return (
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
        <Button onClick={handleSavePreferences}>
          Enregistrer les préférences
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NotificationSettings;
