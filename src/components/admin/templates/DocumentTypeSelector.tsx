
import React from 'react';
import { Button } from '@/components/ui/button';

interface DocumentTypeSelectorProps {
  documentType: 'facture' | 'appel' | 'rappel' | 'autre';
  setDocumentType: (type: 'facture' | 'appel' | 'rappel' | 'autre') => void;
}

const DocumentTypeSelector: React.FC<DocumentTypeSelectorProps> = ({
  documentType,
  setDocumentType
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Type de document</label>
      <div className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          variant={documentType === 'facture' ? 'default' : 'outline'}
          onClick={() => setDocumentType('facture')}
          className="justify-start"
        >
          Facture
        </Button>
        <Button
          type="button"
          variant={documentType === 'appel' ? 'default' : 'outline'}
          onClick={() => setDocumentType('appel')}
          className="justify-start"
        >
          Appel de cotisation
        </Button>
        <Button
          type="button"
          variant={documentType === 'rappel' ? 'default' : 'outline'}
          onClick={() => setDocumentType('rappel')}
          className="justify-start"
        >
          Rappel
        </Button>
        <Button
          type="button"
          variant={documentType === 'autre' ? 'default' : 'outline'}
          onClick={() => setDocumentType('autre')}
          className="justify-start"
        >
          Autre
        </Button>
      </div>
    </div>
  );
};

export default DocumentTypeSelector;
