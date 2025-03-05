
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

export const DomainErrorAlert: React.FC = () => {
  return (
    <Alert variant="destructive" className="mt-4">
      <InfoIcon className="h-4 w-4" />
      <AlertTitle>Domaine non autorisé</AlertTitle>
      <AlertDescription>
        Le domaine actuel n'est pas autorisé dans les paramètres de votre projet Firebase. 
        Ajoutez "{window.location.hostname}" dans la liste des domaines autorisés de votre console Firebase.
      </AlertDescription>
    </Alert>
  );
};
