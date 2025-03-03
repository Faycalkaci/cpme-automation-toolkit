
import React from 'react';
import TemplateHeader from './templates/TemplateHeader';
import TemplateList from './templates/TemplateList';
import UploadDialog from './templates/UploadDialog';
import DeleteDialog from './templates/DeleteDialog';
import SaveDialog from './templates/SaveDialog';
import PreviewDialog from './templates/PreviewDialog';
import { useTemplateManager } from './templates/useTemplateManager';

const TemplateManager: React.FC = () => {
  const {
    templates,
    canSaveTemplate,
    showUploadDialog,
    setShowUploadDialog,
    showDeleteDialog,
    setShowDeleteDialog,
    templateToDelete,
    showPreviewDialog,
    setShowPreviewDialog,
    templateToPreview,
    showSaveDialog,
    setShowSaveDialog,
    templateToSave,
    newTemplateName,
    setNewTemplateName,
    newTemplateType,
    setNewTemplateType,
    selectedFile,
    setSelectedFile,
    handleFileSelect,
    handleUpload,
    handleDeleteTemplate,
    handleSaveTemplatePermanently,
    openDeleteDialog,
    openPreviewDialog,
    openSaveDialog,
    handleDragOver,
    handleDragLeave,
    handleDrop
  } = useTemplateManager();
  
  return (
    <div className="space-y-6">
      <TemplateHeader onAddTemplate={() => setShowUploadDialog(true)} />
      
      <TemplateList 
        templates={templates}
        canSaveTemplate={canSaveTemplate}
        openDeleteDialog={openDeleteDialog}
        openPreviewDialog={openPreviewDialog}
        openSaveDialog={openSaveDialog}
      />
      
      <UploadDialog
        open={showUploadDialog}
        onOpenChange={setShowUploadDialog}
        newTemplateName={newTemplateName}
        setNewTemplateName={setNewTemplateName}
        newTemplateType={newTemplateType}
        setNewTemplateType={setNewTemplateType}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        handleUpload={handleUpload}
        handleFileSelect={handleFileSelect}
        handleDragOver={handleDragOver}
        handleDragLeave={handleDragLeave}
        handleDrop={handleDrop}
      />
      
      <DeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        templateToDelete={templateToDelete}
        handleDeleteTemplate={handleDeleteTemplate}
      />
      
      <SaveDialog
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        templateToSave={templateToSave}
        handleSaveTemplatePermanently={handleSaveTemplatePermanently}
      />
      
      <PreviewDialog
        open={showPreviewDialog}
        onOpenChange={setShowPreviewDialog}
        templateToPreview={templateToPreview}
      />
    </div>
  );
};

export default TemplateManager;
