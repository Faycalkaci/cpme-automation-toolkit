
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Lock } from 'lucide-react';

interface LoginBlockedAlertProps {
  timeRemaining: string;
}

export const LoginBlockedAlert: React.FC<LoginBlockedAlertProps> = ({ timeRemaining }) => {
  return (
    <Alert variant="destructive">
      <Lock className="h-4 w-4" />
      <AlertTitle>Compte temporairement bloqué</AlertTitle>
      <AlertDescription>
        Trop de tentatives de connexion. Veuillez réessayer dans {timeRemaining}.
      </AlertDescription>
    </Alert>
  );
};
