
import { useTemplates } from '@/hooks/useTemplates';
import { useTemplateUpload } from './hooks/useTemplateUpload';
import { useTemplateDelete } from './hooks/useTemplateDelete';
import { useTemplateSave } from './hooks/useTemplateSave';
import { useTemplatePreview } from './hooks/useTemplatePreview';

export const useTemplateManager = () => {
  // Utiliser useTemplates avec isAdmin=true pour obtenir les templates administratifs
  const { templates, loadTemplates, isLoading, error } = useTemplates(true);
  
  const uploadHook = useTemplateUpload();
  const deleteHook = useTemplateDelete();
  const saveHook = useTemplateSave();
  const previewHook = useTemplatePreview();
  
  return {
    // Template data
    templates,
    loadTemplates,
    isLoading,
    error,
    canSaveTemplate: saveHook.canSaveTemplate,
    
    // Upload dialog and functionality
    ...uploadHook,
    
    // Delete dialog and functionality
    ...deleteHook,
    
    // Preview dialog and functionality
    ...previewHook,
    
    // Save dialog and functionality
    ...saveHook
  };
};
