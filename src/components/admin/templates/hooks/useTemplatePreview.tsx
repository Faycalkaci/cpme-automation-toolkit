
import { useState } from 'react';
import { Template } from '../types';

export const useTemplatePreview = () => {
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [templateToPreview, setTemplateToPreview] = useState<Template | null>(null);
  
  const openPreviewDialog = (template: Template) => {
    setTemplateToPreview(template);
    setShowPreviewDialog(true);
  };
  
  return {
    showPreviewDialog,
    setShowPreviewDialog,
    templateToPreview,
    openPreviewDialog
  };
};
