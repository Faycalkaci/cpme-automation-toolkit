
import { useState } from 'react';
import { toast } from 'sonner';
import { Template } from '../types';
import { useTemplates } from '@/hooks/useTemplates';
import { useAuth } from '@/contexts/AuthContext';

export const useTemplateDelete = () => {
  const { user } = useAuth();
  const { deleteTemplate } = useTemplates(true);
  
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<Template | null>(null);
  
  const openDeleteDialog = (template: Template) => {
    setTemplateToDelete(template);
    setShowDeleteDialog(true);
  };
  
  const handleDeleteTemplate = async () => {
    if (templateToDelete) {
      // Super Admin peut tout supprimer
      const isSuperAdmin = user?.role === 'super-admin';
      
      if (templateToDelete.permanent && templateToDelete.savedBy === 'system' && !isSuperAdmin) {
        toast.error('Action non autorisée', {
          description: 'Vous ne pouvez pas supprimer un modèle système permanent.'
        });
        setShowDeleteDialog(false);
        setTemplateToDelete(null);
        return;
      }
      
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
