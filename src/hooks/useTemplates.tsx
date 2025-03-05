
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
  const [useFirestore, setUseFirestore] = useState(true);
  const { user } = useAuth();

  const loadTemplates = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Loading templates, isAdmin:', isAdmin);
      
      // Tenter de charger depuis Firestore seulement si l'option est activée
      if (useFirestore) {
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
          // Désactiver Firestore après une erreur d'autorisation
          if (firestoreError instanceof Error && 
              firestoreError.message.includes('permission-denied')) {
            console.log('Firestore permission denied, disabling Firestore usage');
            setUseFirestore(false);
          }
          setError(`Erreur Firestore: ${firestoreError instanceof Error ? firestoreError.message : 'Erreur inconnue'}`);
        }
      } else {
        console.log('Firestore usage disabled, skipping Firestore attempt');
      }
      
      console.log('Loading from localStorage');
      // Charger depuis localStorage (toujours comme fallback)
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
      
      // Tenter la migration vers Firestore seulement si l'option est activée
      if (useFirestore && formattedTemplates.length > 0 && user) {
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
    // Si Firestore est désactivé, ne pas tenter la migration
    if (!useFirestore) return;
    
    for (const template of localTemplates) {
      try {
        await firestoreService.templates.saveTemplate(template, isAdmin);
        console.log(`Template ${template.id} migrated to Firestore`);
      } catch (error) {
        console.error(`Error migrating template ${template.id} to Firestore:`, error);
        // Désactiver Firestore après une erreur d'autorisation
        if (error instanceof Error && 
            error.message.includes('permission-denied')) {
          console.log('Firestore permission denied during migration, disabling Firestore usage');
          setUseFirestore(false);
          break; // Arrêter la migration
        }
      }
    }
  };

  const saveTemplate = async (template: Template) => {
    try {
      // Si Firestore est activé, essayer de sauvegarder dans Firestore d'abord
      if (useFirestore) {
        try {
          console.log('Saving template to Firestore:', template.id);
          await firestoreService.templates.saveTemplate(template, isAdmin);
          
          // Recharger les templates depuis Firestore
          await loadTemplates();
          return true;
        } catch (firestoreError) {
          console.error('Error saving to Firestore, falling back to localStorage:', firestoreError);
          // Désactiver Firestore après une erreur d'autorisation
          if (firestoreError instanceof Error && 
              firestoreError.message.includes('permission-denied')) {
            console.log('Firestore permission denied during save, disabling Firestore usage');
            setUseFirestore(false);
          }
        }
      }
      
      // Fallback à localStorage si Firestore échoue ou est désactivé
      console.log('Saving template to localStorage:', template.id);
      const storageTemplate = {
        ...template,
        mappingFields: template.mappingFields || template.fields || [],
        createdAt: template.createdAt || new Date(),
      };
      
      await templateStorage.saveTemplate(storageTemplate, isAdmin);
      await loadTemplates(); // Recharger les templates après la sauvegarde
      return true;
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Erreur lors de la sauvegarde du modèle');
      return false;
    }
  };

  const deleteTemplate = async (templateId: string) => {
    try {
      // Si Firestore est activé, essayer de supprimer dans Firestore d'abord
      if (useFirestore) {
        try {
          console.log('Deleting template from Firestore:', templateId);
          await firestoreService.templates.deleteTemplate(templateId);
          
          // Recharger les templates depuis Firestore
          await loadTemplates();
          return true;
        } catch (firestoreError) {
          console.error('Error deleting from Firestore, falling back to localStorage:', firestoreError);
          // Désactiver Firestore après une erreur d'autorisation
          if (firestoreError instanceof Error && 
              firestoreError.message.includes('permission-denied')) {
            console.log('Firestore permission denied during delete, disabling Firestore usage');
            setUseFirestore(false);
          }
        }
      }
      
      // Fallback au localStorage si Firestore échoue ou est désactivé
      console.log('Deleting template from localStorage:', templateId);
      await templateStorage.deleteTemplate(templateId, isAdmin);
      await loadTemplates(); // Recharger les templates après la suppression
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
