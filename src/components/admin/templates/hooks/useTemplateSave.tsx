
import { useState } from 'react';
import { toast } from 'sonner';
import { Template } from '../types';
import { useAuth } from '@/contexts/AuthContext';
import { useTemplates } from '@/hooks/useTemplates';

export const useTemplateSave = () => {
  const { user } = useAuth();
  const { saveTemplate } = useTemplates(true);
  
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [templateToSave, setTemplateToSave] = useState<Template | null>(null);
  
  const canSaveTemplate = user && (user.role === 'admin' || user.role === 'super-admin');
  
  const openSaveDialog = (template: Template) => {
    if (!canSaveTemplate) {
      toast.error('Permission refusée', {
        description: 'Vous n\'avez pas les droits pour sauvegarder définitivement un modèle.'
      });
      return;
    }
    
    setTemplateToSave(template);
    setShowSaveDialog(true);
  };
  
  const handleSaveTemplatePermanently = async () => {
    if (templateToSave) {
      try {
        const updatedTemplate = {
          ...templateToSave,
          permanent: true,
          savedBy: user?.name || user?.email || 'Anonymous',
          lastModified: new Date().toISOString()
        };
        
        await saveTemplate(updatedTemplate);
        
        toast.success('Modèle sauvegardé définitivement', {
          description: `Le modèle "${templateToSave.name}" est maintenant disponible pour tous les utilisateurs.`
        });
      } catch (error) {
        console.error('Error saving template permanently:', error);
        toast.error('Erreur lors de la sauvegarde du modèle');
      }
      
      setShowSaveDialog(false); // Fixed: using the correct variable name
      setTemplateToSave(null);
    }
  };
  
  return {
    showSaveDialog,
    setShowSaveDialog,
    templateToSave,
    canSaveTemplate,
    openSaveDialog,
    handleSaveTemplatePermanently
  };
};
