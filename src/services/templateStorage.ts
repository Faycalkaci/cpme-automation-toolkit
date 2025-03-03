import { toast } from 'sonner';

// Template interface - aligned with components/admin/templates/types.ts
export interface Template {
  id: string;
  name: string;
  file?: File;
  previewUrl?: string;
  mappingFields: string[];
  createdAt: Date;
  createdBy?: string;
  lastUpdated?: Date;
  type?: 'facture' | 'appel' | 'rappel' | 'autre';
  permanent?: boolean;
  fileUrl?: string;
  fields?: string[];
  savedBy?: string;
  organizationId?: string;
  documentType?: 'pdf' | 'doc' | 'docx';
  mappingConfig?: Record<string, string>;
  // Added for compatibility with admin templates type
  date?: string;
}

// Storage keys
const TEMPLATES_KEY = 'cpme_pdf_templates';
const ADMIN_TEMPLATES_KEY = 'cpme_admin_templates';

/**
 * Service for storing and retrieving PDF templates
 * This uses localStorage for a simple implementation, but could be
 * extended to use Firebase, IndexedDB, or another persistent storage solution
 */
export const templateStorage = {
  /**
   * Save a template to storage (shared across the application)
   */
  saveTemplate: async (template: Template, adminTemplate: boolean = false): Promise<Template> => {
    try {
      // Get existing templates
      const templates = await templateStorage.getTemplates(adminTemplate);
      
      // Check if template with same ID already exists
      const existingIndex = templates.findIndex(t => t.id === template.id);
      if (existingIndex >= 0) {
        // Update existing template
        templates[existingIndex] = {
          ...template,
          lastUpdated: new Date()
        };
      } else {
        // Add new template
        templates.push(template);
      }
      
      // Save to localStorage
      const storageKey = adminTemplate ? ADMIN_TEMPLATES_KEY : TEMPLATES_KEY;
      localStorage.setItem(storageKey, JSON.stringify(templates));
      
      // Also save to the shared templates if it's an admin template
      if (adminTemplate && template.permanent) {
        await templateStorage.saveToSharedTemplates(template);
      }
      
      return template;
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Erreur lors de la sauvegarde du modèle');
      throw error;
    }
  },
  
  /**
   * Save admin template to the shared templates store
   */
  saveToSharedTemplates: async (template: Template): Promise<void> => {
    try {
      const sharedTemplates = await templateStorage.getTemplates(false);
      const existingIndex = sharedTemplates.findIndex(t => t.id === template.id);
      
      if (existingIndex >= 0) {
        // Update existing template
        sharedTemplates[existingIndex] = {
          ...template,
          lastUpdated: new Date()
        };
      } else {
        // Add new template
        sharedTemplates.push(template);
      }
      
      localStorage.setItem(TEMPLATES_KEY, JSON.stringify(sharedTemplates));
    } catch (error) {
      console.error('Error saving to shared templates:', error);
    }
  },
  
  /**
   * Get all templates from storage
   */
  getTemplates: async (adminTemplates: boolean = false): Promise<Template[]> => {
    try {
      const storageKey = adminTemplates ? ADMIN_TEMPLATES_KEY : TEMPLATES_KEY;
      const templatesJson = localStorage.getItem(storageKey);
      if (!templatesJson) return [];
      
      // Parse templates from localStorage
      const templates = JSON.parse(templatesJson) as Template[];
      
      // Convert date strings to Date objects
      return templates.map(template => ({
        ...template,
        createdAt: new Date(template.createdAt),
        lastUpdated: template.lastUpdated ? new Date(template.lastUpdated) : undefined
      }));
    } catch (error) {
      console.error('Error retrieving templates:', error);
      toast.error('Erreur lors de la récupération des modèles');
      return [];
    }
  },
  
  /**
   * Get a specific template by ID
   */
  getTemplateById: async (templateId: string, adminTemplate: boolean = false): Promise<Template | null> => {
    try {
      const templates = await templateStorage.getTemplates(adminTemplate);
      const template = templates.find(t => t.id === templateId);
      
      if (!template) {
        // If not found in the requested storage, try the other storage
        if (!adminTemplate) {
          const adminTemplates = await templateStorage.getTemplates(true);
          return adminTemplates.find(t => t.id === templateId) || null;
        }
        return null;
      }
      
      return template;
    } catch (error) {
      console.error('Error retrieving template by ID:', error);
      toast.error('Erreur lors de la récupération du modèle');
      return null;
    }
  },
  
  /**
   * Delete a template from storage
   */
  deleteTemplate: async (templateId: string, adminTemplate: boolean = false): Promise<void> => {
    try {
      const templates = await templateStorage.getTemplates(adminTemplate);
      const updatedTemplates = templates.filter(t => t.id !== templateId);
      
      const storageKey = adminTemplate ? ADMIN_TEMPLATES_KEY : TEMPLATES_KEY;
      localStorage.setItem(storageKey, JSON.stringify(updatedTemplates));
      
      // Also delete from shared templates if needed
      if (adminTemplate) {
        const sharedTemplates = await templateStorage.getTemplates(false);
        const updatedSharedTemplates = sharedTemplates.filter(t => t.id !== templateId);
        localStorage.setItem(TEMPLATES_KEY, JSON.stringify(updatedSharedTemplates));
      }
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Erreur lors de la suppression du modèle');
      throw error;
    }
  },
  
  /**
   * Clear all templates (admin use only)
   */
  clearTemplates: async (adminTemplates: boolean = false): Promise<void> => {
    try {
      const storageKey = adminTemplates ? ADMIN_TEMPLATES_KEY : TEMPLATES_KEY;
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error('Error clearing templates:', error);
      toast.error('Erreur lors de la suppression des modèles');
      throw error;
    }
  }
};
