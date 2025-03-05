import React, { useState } from 'react';
import TemplateHeader from './templates/TemplateHeader';
import TemplateList from './templates/TemplateList';
import UploadDialog from './templates/upload';
import DeleteDialog from './templates/DeleteDialog';
import SaveDialog from './templates/SaveDialog';
import PreviewDialog from './templates/PreviewDialog';
import { useTemplateManager } from './templates/useTemplateManager';
import { Button } from '@/components/ui/button';
import { Trash2, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useTemplates } from '@/hooks/useTemplates';
import { firestoreService } from '@/services/firebase/firestore';

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

  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteTemplate, loadTemplates } = useTemplates(true);

  const handleDeleteAllTemplates = async () => {
    setIsDeleting(true);
    try {
      for (const template of templates) {
        try {
          await firestoreService.templates.deleteTemplate(template.id);
        } catch (firestoreError) {
          console.error(`Error deleting template ${template.id} from Firestore:`, firestoreError);
          await deleteTemplate(template.id);
        }
      }

      await loadTemplates();
      
      toast.success('Tous les modèles ont été supprimés', {
        description: `${templates.length} modèles ont été supprimés avec succès.`
      });
      
      setShowDeleteAllDialog(false);
    } catch (error) {
      console.error('Error deleting all templates:', error);
      toast.error('Erreur lors de la suppression des modèles', {
        description: 'Une erreur est survenue lors de la suppression des modèles. Veuillez réessayer.'
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between">
        <TemplateHeader onAddTemplate={() => setShowUploadDialog(true)} />
        
        <div className="flex items-center gap-2 justify-end">
          {templates.length > 0 && (
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => setShowDeleteAllDialog(true)}
              className="flex items-center gap-1"
            >
              <Trash2 className="h-4 w-4" />
              Supprimer tous
            </Button>
          )}
        </div>
      </div>
      
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
      
      <Dialog open={showDeleteAllDialog} onOpenChange={setShowDeleteAllDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Supprimer tous les modèles
            </DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer tous les modèles ? Cette action est irréversible et supprimera
              également les modèles archivés et permanents.
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-destructive/10 p-4 rounded-md border border-destructive/30 my-2">
            <p className="text-sm text-destructive">
              <strong>Attention :</strong> Cette action va supprimer {templates.length} modèles, y compris les modèles utilisés
              pour la génération de documents. Assurez-vous d'avoir une sauvegarde si nécessaire.
            </p>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteAllDialog(false)}
              disabled={isDeleting}
            >
              Annuler
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteAllTemplates}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Suppression...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Tout supprimer
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TemplateManager;
