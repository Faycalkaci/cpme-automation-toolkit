
import { useState } from 'react';
import { Template } from '../types';
import { SpreadsheetTemplate } from '@/hooks/useSpreadsheetTemplates';

// Use a union type to support both Template and SpreadsheetTemplate
type TemplateType = Template | SpreadsheetTemplate;

export const useTemplatePreview = () => {
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [templateToPreview, setTemplateToPreview] = useState<TemplateType | null>(null);
  
  const openPreviewDialog = (template: TemplateType) => {
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
