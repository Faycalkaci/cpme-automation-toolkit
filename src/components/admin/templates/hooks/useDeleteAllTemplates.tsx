
import { useState } from 'react';
import { Template } from '../types';
import { useDeleteTemplatesOperation } from './deleteTemplates/useDeleteTemplatesOperation';

export const useDeleteAllTemplates = (templates: Template[], loadTemplates: () => Promise<void>) => {
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);
  const { isDeleting, deleteAllTemplates } = useDeleteTemplatesOperation();

  const handleDeleteAllTemplates = async () => {
    try {
      const success = await deleteAllTemplates(templates, loadTemplates);
      if (success) {
        setShowDeleteAllDialog(false);
      }
    } catch (error) {
      console.error("Error in handleDeleteAllTemplates:", error);
      // Error is already handled in useDeleteTemplatesOperation
    }
  };

  return {
    showDeleteAllDialog,
    setShowDeleteAllDialog,
    isDeleting,
    handleDeleteAllTemplates
  };
};
