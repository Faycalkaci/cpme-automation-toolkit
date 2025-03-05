
import { useState } from 'react';
import { toast } from 'sonner';
import { Template } from '../../types';
import { useTemplates } from '@/hooks/useTemplates';
import { firestoreService } from '@/services/firebase/firestore';

export const useDeleteTemplatesOperation = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteTemplate } = useTemplates(true);

  const deleteAllTemplates = async (templates: Template[], onSuccess: () => Promise<void>) => {
    setIsDeleting(true);
    let hasErrors = false;
    
    try {
      // Create an array to track deletion success/failure
      const deletionResults = await Promise.allSettled(
        templates.map(async (template) => {
          try {
            await firestoreService.templates.deleteTemplate(template.id);
            return { id: template.id, success: true };
          } catch (firestoreError) {
            console.error(`Error deleting template ${template.id} from Firestore:`, firestoreError);
            
            // Attempt localStorage fallback
            try {
              await deleteTemplate(template.id);
              return { id: template.id, success: true };
            } catch (localStorageError) {
              console.error(`Error deleting template ${template.id} from localStorage:`, localStorageError);
              return { id: template.id, success: false };
            }
          }
        })
      );
      
      // Count success/failures
      const successCount = deletionResults.filter(
        result => result.status === 'fulfilled' && (result.value as any).success
      ).length;
      
      const failureCount = templates.length - successCount;
      hasErrors = failureCount > 0;

      // Always call the success callback to refresh the template list
      await onSuccess();
      
      if (successCount > 0) {
        if (hasErrors) {
          toast.success(`Suppression partielle des modèles`, {
            description: `${successCount} modèles supprimés. ${failureCount} modèles n'ont pas pu être supprimés.`
          });
        } else {
          toast.success('Tous les modèles ont été supprimés', {
            description: `${templates.length} modèles ont été supprimés avec succès.`
          });
        }
      } else {
        throw new Error('Aucun modèle n\'a pu être supprimé');
      }
      
      return !hasErrors;
    } catch (error) {
      console.error('Error deleting all templates:', error);
      toast.error('Erreur lors de la suppression des modèles', {
        description: 'Une erreur est survenue lors de la suppression des modèles. Veuillez réessayer.'
      });
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isDeleting,
    deleteAllTemplates
  };
};
