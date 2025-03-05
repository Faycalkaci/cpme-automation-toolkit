
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
    try {
      for (const template of templates) {
        try {
          await firestoreService.templates.deleteTemplate(template.id);
        } catch (firestoreError) {
          console.error(`Error deleting template ${template.id} from Firestore:`, firestoreError);
          await deleteTemplate(template.id);
        }
      }

      await onSuccess();
      
      toast.success('Tous les modèles ont été supprimés', {
        description: `${templates.length} modèles ont été supprimés avec succès.`
      });
      
      return true;
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
