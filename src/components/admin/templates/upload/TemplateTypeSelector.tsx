
import React from 'react';
import { Button } from '@/components/ui/button';

interface TemplateTypeSelectorProps {
  value: 'facture' | 'appel' | 'rappel' | 'autre';
  onChange: (value: 'facture' | 'appel' | 'rappel' | 'autre') => void;
}

export const TemplateTypeSelector: React.FC<TemplateTypeSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Type de document</label>
      <div className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          variant={value === 'facture' ? 'default' : 'outline'}
          onClick={() => onChange('facture')}
          className="justify-start"
        >
          Facture
        </Button>
        <Button
          type="button"
          variant={value === 'appel' ? 'default' : 'outline'}
          onClick={() => onChange('appel')}
          className="justify-start"
        >
          Appel de cotisation
        </Button>
        <Button
          type="button"
          variant={value === 'rappel' ? 'default' : 'outline'}
          onClick={() => onChange('rappel')}
          className="justify-start"
        >
          Rappel
        </Button>
        <Button
          type="button"
          variant={value === 'autre' ? 'default' : 'outline'}
          onClick={() => onChange('autre')}
          className="justify-start"
        >
          Autre
        </Button>
      </div>
    </div>
  );
};
