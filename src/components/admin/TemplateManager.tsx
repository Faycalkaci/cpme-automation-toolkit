
import React from 'react';
import TemplateHeader from './templates/TemplateHeader';
import TemplateActions from './templates/TemplateActions';
import TemplateList from './templates/TemplateList';
import UploadDialog from './templates/upload';
import DeleteDialog from './templates/DeleteDialog';
import SaveDialog from './templates/SaveDialog';
import PreviewDialog from './templates/PreviewDialog';
import DeleteAllDialog from './templates/DeleteAllDialog';
import { useTemplateManager } from './templates/useTemplateManager';
import { useDeleteAllTemplates } from './templates/hooks/useDeleteAllTemplates';
import { useTemplates } from '@/hooks/useTemplates';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';

const TemplateManager: React.FC = () => {
  const {
    templates,
    isLoading,
    error,
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
    handleDrop,
    loadTemplates
  } = useTemplateManager();

  const {
    showDeleteAllDialog,
    setShowDeleteAllDialog,
    isDeleting,
    handleDeleteAllTemplates
  } = useDeleteAllTemplates(templates, loadTemplates);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between">
        <TemplateHeader onAddTemplate={() => setShowUploadDialog(true)} />
        <TemplateActions 
          templates={templates} 
          onDeleteAll={() => setShowDeleteAllDialog(true)} 
        />
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur lors du chargement des modèles</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      ) : (
        <TemplateList 
          templates={templates}
          canSaveTemplate={canSaveTemplate}
          openDeleteDialog={openDeleteDialog}
          openPreviewDialog={openPreviewDialog}
          openSaveDialog={openSaveDialog}
        />
      )}
      
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
      
      <DeleteAllDialog
        open={showDeleteAllDialog}
        onOpenChange={setShowDeleteAllDialog}
        isDeleting={isDeleting}
        templates={templates}
        onDeleteAll={handleDeleteAllTemplates}
      />
    </div>
  );
};

export default TemplateManager;
