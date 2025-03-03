
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface PdfGenerationErrorProps {
  error: string | null;
}

const PdfGenerationError: React.FC<PdfGenerationErrorProps> = ({ error }) => {
  if (!error) return null;

  return (
    <Alert variant="destructive" className="mt-4">
      <AlertTitle>Erreur de génération</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
};

export default PdfGenerationError;
