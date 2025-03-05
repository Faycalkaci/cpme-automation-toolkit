
import { useState } from 'react';
import { toast } from 'sonner';
import { Template } from '../types';
import { useTemplates } from '@/hooks/useTemplates';
import { firestoreService } from '@/services/firebase/firestore';

export const useDeleteAllTemplates = (templates: Template[], loadTemplates: () => Promise<void>) => {
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteTemplate } = useTemplates(true);

  const handleDeleteAllTemplates = async () => {
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

      await loadTemplates();
      
      toast.success('Tous les modèles ont été supprimés', {
        description: `${templates.length} modèles ont été supprimés avec succès.`
      });
      
      setShowDeleteAllDialog(false);
    } catch (error) {
      console.error('Error deleting all templates:', error);
      toast.error('Erreur lors de la suppression des modèles', {
        description: 'Une erreur est survenue lors de la suppression des modèles. Veuillez réessayer.'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    showDeleteAllDialog,
    setShowDeleteAllDialog,
    isDeleting,
    handleDeleteAllTemplates
  };
};
