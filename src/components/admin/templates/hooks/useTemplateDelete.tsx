
import { useState } from 'react';
import { toast } from 'sonner';
import { Template } from '../types';
import { useTemplates } from '@/hooks/useTemplates';

export const useTemplateDelete = () => {
  const { deleteTemplate } = useTemplates(true);
  
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<Template | null>(null);
  
  const openDeleteDialog = (template: Template) => {
    setTemplateToDelete(template);
    setShowDeleteDialog(true);
  };
  
  const handleDeleteTemplate = async () => {
    if (templateToDelete) {
      try {
        await deleteTemplate(templateToDelete.id);
        
        toast.success('Modèle supprimé', {
          description: `Le modèle "${templateToDelete.name}" a été supprimé.`
        });
      } catch (error) {
        console.error('Error deleting template:', error);
        toast.error('Erreur lors de la suppression du modèle');
      }
      
      setShowDeleteDialog(false);
      setTemplateToDelete(null);
    }
  };
  
  return {
    showDeleteDialog,
    setShowDeleteDialog,
    templateToDelete,
    openDeleteDialog,
    handleDeleteTemplate
  };
};
