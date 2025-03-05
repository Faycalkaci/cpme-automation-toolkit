
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

export const CorsErrorAlert: React.FC = () => {
  return (
    <Alert variant="destructive" className="mt-4">
      <InfoIcon className="h-4 w-4" />
      <AlertTitle>Erreur CORS détectée</AlertTitle>
      <AlertDescription>
        Une erreur de sécurité navigateur empêche la connexion. Essayez de désactiver les extensions de blocage
        ou utilisez un autre navigateur.
      </AlertDescription>
    </Alert>
  );
};
