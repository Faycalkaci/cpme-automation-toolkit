
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { templateStorage } from '@/services/templateStorage';
import { Template } from '@/components/admin/templates/types';

export const useTemplates = (isAdmin: boolean = true) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTemplates = async () => {
    try {
      setIsLoading(true);
      const storedTemplates = await templateStorage.getTemplates(isAdmin);
      
      // Convert templateStorage.Template to admin/templates/types.Template
      const formattedTemplates: Template[] = storedTemplates.map(t => ({
        ...t,
        id: t.id,
        name: t.name,
        type: t.type || 'autre',
        date: t.date || (t.createdAt ? t.createdAt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]),
        fields: t.fields || t.mappingFields || [],
        fileUrl: t.fileUrl || '',
        documentType: t.documentType || 'pdf',
        mappingFields: t.mappingFields || [],
        createdAt: t.createdAt,
      }));
      
      setTemplates(formattedTemplates);
    } catch (error) {
      console.error('Error loading templates:', error);
      toast.error('Erreur lors du chargement des modèles');
    } finally {
      setIsLoading(false);
    }
  };

  const saveTemplate = async (template: Template) => {
    try {
      // Convert to templateStorage.Template format
      const storageTemplate = {
        ...template,
        mappingFields: template.mappingFields || template.fields || [],
        createdAt: template.createdAt || new Date(),
      };
      
      await templateStorage.saveTemplate(storageTemplate, isAdmin);
      await loadTemplates(); // Reload templates after saving
      return true;
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Erreur lors de la sauvegarde du modèle');
      return false;
    }
  };

  const deleteTemplate = async (templateId: string) => {
    try {
      await templateStorage.deleteTemplate(templateId, isAdmin);
      await loadTemplates(); // Reload templates after deletion
      return true;
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Erreur lors de la suppression du modèle');
      return false;
    }
  };

  useEffect(() => {
    loadTemplates();
  }, [isAdmin]);

  return {
    templates,
    isLoading,
    loadTemplates,
    saveTemplate,
    deleteTemplate
  };
};
