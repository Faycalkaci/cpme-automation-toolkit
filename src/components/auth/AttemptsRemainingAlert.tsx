
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Shield } from 'lucide-react';

interface AttemptsRemainingAlertProps {
  attemptsLeft: number;
}

export const AttemptsRemainingAlert: React.FC<AttemptsRemainingAlertProps> = ({ attemptsLeft }) => {
  return (
    <Alert>
      <Shield className="h-4 w-4" />
      <AlertTitle>Attention</AlertTitle>
      <AlertDescription>
        Il vous reste {attemptsLeft} tentative{attemptsLeft > 1 ? 's' : ''} avant le blocage temporaire du compte.
      </AlertDescription>
    </Alert>
  );
};
