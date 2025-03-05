
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { templateStorage } from '@/services/templateStorage';
import { Template } from '@/components/admin/templates/types';
import { firestoreService } from '@/services/firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';

export const useTemplates = (isAdmin: boolean = true) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const [useLocalStorageOnly, setUseLocalStorageOnly] = useState(false);

  const loadTemplates = async () => {
    try {
      setIsLoading(true);
      
      // Skip Firestore if we've already determined we don't have permissions
      if (!useLocalStorageOnly) {
        try {
          const firestoreTemplates = await firestoreService.templates.getTemplates(isAdmin);
          
          if (firestoreTemplates.length > 0) {
            setTemplates(firestoreTemplates);
            setIsLoading(false);
            return;
          }
        } catch (firestoreError: any) {
          console.error('Error loading from Firestore, falling back to localStorage:', firestoreError);
          
          // If this is a permissions error, set the flag to avoid future Firestore calls
          if (firestoreError.code === 'permission-denied' || 
              firestoreError.message?.includes('Missing or insufficient permissions')) {
            setUseLocalStorageOnly(true);
            console.info('Switching to localStorage-only mode due to Firestore permission issues');
          }
        }
      }
      
      // Fallback to localStorage
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
      
      // Only attempt migration if we have permission to Firestore
      if (formattedTemplates.length > 0 && user && !useLocalStorageOnly) {
        try {
          migrateLocalTemplatesToFirestore(formattedTemplates, isAdmin);
        } catch (migrationError) {
          console.error('Error migrating templates to Firestore:', migrationError);
        }
      }
    } catch (error) {
      console.error('Error loading templates:', error);
      toast.error('Erreur lors du chargement des modèles');
    } finally {
      setIsLoading(false);
    }
  };

  const migrateLocalTemplatesToFirestore = async (localTemplates: Template[], isAdmin: boolean) => {
    for (const template of localTemplates) {
      try {
        await firestoreService.templates.saveTemplate(template, isAdmin);
        console.log(`Template ${template.id} migrated to Firestore`);
      } catch (error) {
        console.error(`Error migrating template ${template.id} to Firestore:`, error);
      }
    }
  };

  const saveTemplate = async (template: Template) => {
    try {
      // Skip Firestore if we've already determined we don't have permissions
      if (!useLocalStorageOnly) {
        try {
          await firestoreService.templates.saveTemplate(template, isAdmin);
          
          // Recharger les templates depuis Firestore
          await loadTemplates();
          return true;
        } catch (firestoreError: any) {
          console.error('Error saving to Firestore, falling back to localStorage:', firestoreError);
          
          // If this is a permissions error, set the flag to avoid future Firestore calls
          if (firestoreError.code === 'permission-denied' || 
              firestoreError.message?.includes('Missing or insufficient permissions')) {
            setUseLocalStorageOnly(true);
          }
        }
      }
      
      // Fallback to localStorage
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
      // Skip Firestore if we've already determined we don't have permissions
      if (!useLocalStorageOnly) {
        try {
          await firestoreService.templates.deleteTemplate(templateId);
          
          // Recharger les templates depuis Firestore
          await loadTemplates();
          return true;
        } catch (firestoreError: any) {
          console.error('Error deleting from Firestore, falling back to localStorage:', firestoreError);
          
          // If this is a permissions error, set the flag to avoid future Firestore calls
          if (firestoreError.code === 'permission-denied' || 
              firestoreError.message?.includes('Missing or insufficient permissions')) {
            setUseLocalStorageOnly(true);
          }
        }
      }
      
      // Fallback to localStorage
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
  }, [isAdmin, user]);

  return {
    templates,
    isLoading,
    loadTemplates,
    saveTemplate,
    deleteTemplate,
    isUsingLocalStorage: useLocalStorageOnly
  };
};
