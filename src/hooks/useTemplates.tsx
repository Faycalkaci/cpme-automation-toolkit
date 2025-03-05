
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { templateStorage } from '@/services/templateStorage';
import { Template } from '@/components/admin/templates/types';
import { firestoreService } from '@/services/firebase/firestore';
import { useAuth } from '@/contexts/auth/AuthContext';

export const useTemplates = (isAdmin: boolean = true) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const loadTemplates = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Loading templates, isAdmin:', isAdmin);
      
      // Essayer d'abord de charger depuis Firestore
      try {
        console.log('Attempting to load templates from Firestore');
        const firestoreTemplates = await firestoreService.templates.getTemplates(isAdmin);
        
        console.log('Firestore templates loaded:', firestoreTemplates.length);
        if (firestoreTemplates.length > 0) {
          setTemplates(firestoreTemplates);
          setIsLoading(false);
          return;
        }
      } catch (firestoreError) {
        console.error('Error loading from Firestore, error details:', firestoreError);
        setError(`Erreur Firestore: ${firestoreError instanceof Error ? firestoreError.message : 'Erreur inconnue'}`);
      }
      
      console.log('Falling back to localStorage');
      // Fallback au localStorage si Firestore échoue ou ne renvoie rien
      const storedTemplates = await templateStorage.getTemplates(isAdmin);
      console.log('Local storage templates loaded:', storedTemplates.length);
      
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
      
      // Si on a chargé depuis localStorage et que l'utilisateur est connecté,
      // on peut migrer les templates vers Firestore en arrière-plan
      if (formattedTemplates.length > 0 && user) {
        try {
          console.log('Migrating templates to Firestore');
          migrateLocalTemplatesToFirestore(formattedTemplates, isAdmin);
        } catch (migrationError) {
          console.error('Error migrating templates to Firestore:', migrationError);
        }
      }
    } catch (error) {
      console.error('Error loading templates:', error);
      setError(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
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
      // D'abord essayer de sauvegarder dans Firestore
      try {
        console.log('Saving template to Firestore:', template.id);
        await firestoreService.templates.saveTemplate(template, isAdmin);
        
        // Recharger les templates depuis Firestore
        await loadTemplates();
        return true;
      } catch (firestoreError) {
        console.error('Error saving to Firestore, falling back to localStorage:', firestoreError);
      }
      
      // Fallback au localStorage si Firestore échoue
      // Convert to templateStorage.Template format
      console.log('Saving template to localStorage:', template.id);
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
      // D'abord essayer de supprimer dans Firestore
      try {
        console.log('Deleting template from Firestore:', templateId);
        await firestoreService.templates.deleteTemplate(templateId);
        
        // Recharger les templates depuis Firestore
        await loadTemplates();
        return true;
      } catch (firestoreError) {
        console.error('Error deleting from Firestore, falling back to localStorage:', firestoreError);
      }
      
      // Fallback au localStorage si Firestore échoue
      console.log('Deleting template from localStorage:', templateId);
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
    error,
    loadTemplates,
    saveTemplate,
    deleteTemplate
  };
};
