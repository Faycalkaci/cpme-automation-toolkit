
import { useState } from 'react';
import { Template } from '../types';
import { useDeleteTemplatesOperation } from './deleteTemplates/useDeleteTemplatesOperation';

export const useDeleteAllTemplates = (templates: Template[], loadTemplates: () => Promise<void>) => {
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);
  const { isDeleting, deleteAllTemplates } = useDeleteTemplatesOperation();

  const handleDeleteAllTemplates = async () => {
    const success = await deleteAllTemplates(templates, loadTemplates);
    if (success) {
      setShowDeleteAllDialog(false);
    }
  };

  return {
    showDeleteAllDialog,
    setShowDeleteAllDialog,
    isDeleting,
    handleDeleteAllTemplates
  };
};
