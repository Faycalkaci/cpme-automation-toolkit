
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

const SecurityAlert = () => {
  return (
    <Alert className="border-yellow-200 bg-yellow-50">
      <AlertTriangle className="h-4 w-4 text-yellow-600" />
      <AlertTitle className="text-yellow-800">Rappel de sécurité</AlertTitle>
      <AlertDescription className="text-yellow-700">
        Pour votre sécurité, ne partagez jamais vos identifiants et activez l'authentification à deux facteurs.
      </AlertDescription>
    </Alert>
  );
};

export default SecurityAlert;
