
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ErrorAlertProps {
  error: string;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ error }) => {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Erreur de connexion</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
};
