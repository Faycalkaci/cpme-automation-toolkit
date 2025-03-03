
import { useState } from 'react';

export interface Template {
  id: string;
  name: string;
  mappingFields?: string[];
}

export const useSpreadsheetTemplates = () => {
  const templates: Template[] = [
    { 
      id: 'appel', 
      name: 'Appel de cotisation',
      mappingFields: [
        'DATE ECHEANCE',
        'Cotisation',
        'N° adh',
        'SOCIETE',
        'Dirigeant',
        'E MAIL 1',
        'E Mail 2',
        'Adresse',
        'ville'
      ]
    },
    { id: 'facture', name: 'Facture standard' },
    { id: 'rappel', name: 'Rappel de cotisation' }
  ];
  
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  
  return {
    templates,
    selectedTemplate,
    setSelectedTemplate
  };
};
