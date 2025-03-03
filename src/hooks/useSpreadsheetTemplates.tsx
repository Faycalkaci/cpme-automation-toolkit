
import { useState, useEffect } from 'react';
import { templateStorage } from '@/services/templateStorage';

export interface Template {
  id: string;
  name: string;
  mappingFields?: string[];
  type?: string;
  fields?: string[];
}

export const useSpreadsheetTemplates = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        // Charger les templates depuis le stockage partagé
        const storedTemplates = await templateStorage.getTemplates(false);
        if (storedTemplates.length > 0) {
          setTemplates(storedTemplates);
        } else {
          // Fallback aux templates par défaut
          setTemplates([
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
          ]);
        }
      } catch (error) {
        console.error('Error loading templates:', error);
        // Utiliser les templates par défaut en cas d'erreur
        setTemplates([
          { id: 'appel', name: 'Appel de cotisation' },
          { id: 'facture', name: 'Facture standard' },
          { id: 'rappel', name: 'Rappel de cotisation' }
        ]);
      }
    };
    
    loadTemplates();
  }, []);
  
  return {
    templates,
    selectedTemplate,
    setSelectedTemplate
  };
};
