
import { useState, useEffect } from 'react';
import { templateStorage } from '@/services/templateStorage';
import { Template } from '@/components/admin/templates/types';
import { DEFAULT_FIELD_MAPPINGS } from '@/services/pdfMappingService';

export interface SpreadsheetTemplate {
  id: string;
  name: string;
  mappingFields?: string[];
  type?: string;
  fields?: string[];
  file?: File;
  fileUrl?: string;
}

export const useSpreadsheetTemplates = () => {
  const [templates, setTemplates] = useState<SpreadsheetTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setIsLoading(true);
        // Charger les templates depuis le stockage partagé
        const storedTemplates = await templateStorage.getTemplates(false);
        
        if (storedTemplates.length > 0) {
          // Map to proper format for spreadsheet use
          setTemplates(storedTemplates.map(template => ({
            id: template.id,
            name: template.name,
            mappingFields: template.mappingFields || template.fields || DEFAULT_FIELD_MAPPINGS.map(f => f.name),
            type: template.type,
            fields: template.fields,
            file: template.file,
            fileUrl: template.fileUrl
          })));
          
          // Automatically select the first template if none is selected
          if (!selectedTemplate && storedTemplates.length > 0) {
            setSelectedTemplate(storedTemplates[0].id);
          }
        } else {
          // Fallback aux templates par défaut
          setTemplates([
            { 
              id: 'appel', 
              name: 'Appel de cotisation',
              mappingFields: DEFAULT_FIELD_MAPPINGS.map(f => f.name)
            },
            { id: 'facture', name: 'Facture standard' },
            { id: 'rappel', name: 'Rappel de cotisation' }
          ]);
          
          if (!selectedTemplate) {
            setSelectedTemplate('appel');
          }
        }
      } catch (error) {
        console.error('Error loading templates:', error);
        // Utiliser les templates par défaut en cas d'erreur
        setTemplates([
          { 
            id: 'appel', 
            name: 'Appel de cotisation',
            mappingFields: DEFAULT_FIELD_MAPPINGS.map(f => f.name)
          },
          { id: 'facture', name: 'Facture standard' },
          { id: 'rappel', name: 'Rappel de cotisation' }
        ]);
        
        if (!selectedTemplate) {
          setSelectedTemplate('appel');
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTemplates();
  }, [selectedTemplate]);
  
  return {
    templates,
    selectedTemplate,
    setSelectedTemplate,
    isLoading
  };
};
