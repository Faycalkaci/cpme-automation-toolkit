
import { toast } from 'sonner';
import { TemplateField } from './pdfTypes';

/**
 * Service responsible for mapping fields between templates and data
 */
export const pdfMapper = {
  /**
   * Auto-detect fields in template and match with CSV columns
   */
  autoMapFields: async (
    pdfBytes: ArrayBuffer, 
    csvHeaders: string[], 
    defaultFields: TemplateField[]
  ): Promise<Map<string, string>> => {
    try {
      // Create mappings based on CSV headers that match our predefined fields
      const mappings = new Map<string, string>();
      
      // Always include all default fields, regardless of detection
      defaultFields.forEach(field => {
        // Try to match with CSV headers using exact match or case-insensitive match
        const matchingHeader = csvHeaders.find(header => 
          header === field.name || 
          header.toLowerCase() === field.name.toLowerCase() ||
          header.normalize('NFD').replace(/[\u0300-\u036f]/g, '') === 
          field.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        );
        
        // Add to mappings - use the exact CSV header name if found, otherwise use the default field name
        mappings.set(matchingHeader || field.name, field.placeholder);
      });
      
      return mappings;
    } catch (error) {
      console.error('Error mapping fields:', error);
      toast.error('Erreur lors du mappage automatique des champs');
      return new Map<string, string>();
    }
  },

  /**
   * Save a template with its mapping configuration
   */
  saveTemplateMapping: async (templateId: string, mappings: Map<string, string>): Promise<boolean> => {
    try {
      // This would typically save to a database
      // For now, we'll use localStorage
      const mappingsObj = Object.fromEntries(mappings);
      localStorage.setItem(`template_mapping_${templateId}`, JSON.stringify(mappingsObj));
      
      toast.success('Configuration de mappage sauvegardée');
      return true;
    } catch (error) {
      console.error('Error saving template mapping:', error);
      toast.error('Erreur lors de la sauvegarde du mappage');
      return false;
    }
  },
  
  /**
   * Get the mapping configuration for a template
   */
  getTemplateMapping: async (templateId: string, defaultFields: TemplateField[]): Promise<Map<string, string>> => {
    try {
      const mappingsJson = localStorage.getItem(`template_mapping_${templateId}`);
      if (!mappingsJson) {
        // If no mapping exists, return default mappings
        return new Map(defaultFields.map(field => [field.name, field.placeholder]));
      }
      
      const mappingsObj = JSON.parse(mappingsJson);
      return new Map(Object.entries(mappingsObj));
    } catch (error) {
      console.error('Error retrieving template mapping:', error);
      // Return default mappings on error
      return new Map(defaultFields.map(field => [field.name, field.placeholder]));
    }
  }
};

// Helper function to find field values case-insensitively
export const findValueCaseInsensitive = (data: Record<string, string>, field: string): string | undefined => {
  // Try exact match first
  if (data[field] !== undefined) {
    return data[field];
  }
  
  // Try case-insensitive match
  const lowerField = field.toLowerCase();
  for (const key in data) {
    if (key.toLowerCase() === lowerField) {
      return data[key];
    }
  }
  
  return undefined;
};
