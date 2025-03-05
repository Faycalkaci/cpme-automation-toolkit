
import { useFileHandling } from './upload/useFileHandling';
import { useTemplateProcessor } from './upload/useTemplateProcessor';

export const useTemplateUpload = () => {
  const {
    selectedFile,
    setSelectedFile,
    newTemplateName,
    setNewTemplateName,
    newTemplateType,
    setNewTemplateType,
    handleFileSelect,
    handleDragOver,
    handleDragLeave,
    handleDrop
  } = useFileHandling();

  const {
    showUploadDialog,
    setShowUploadDialog,
    handleUpload: processUpload,
    loadTemplates
  } = useTemplateProcessor();

  const handleUpload = async () => {
    await processUpload(
      selectedFile,
      newTemplateName,
      newTemplateType,
      setShowUploadDialog,
      setSelectedFile,
      setNewTemplateName,
      setNewTemplateType
    );
  };

  return {
    showUploadDialog,
    setShowUploadDialog,
    newTemplateName,
    setNewTemplateName,
    newTemplateType,
    setNewTemplateType,
    selectedFile,
    setSelectedFile,
    handleFileSelect,
    handleUpload,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    loadTemplates
  };
};
