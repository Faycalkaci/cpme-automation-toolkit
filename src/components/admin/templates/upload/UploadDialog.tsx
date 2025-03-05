
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TemplateNameField } from './TemplateNameField';
import { TemplateTypeSelector } from './TemplateTypeSelector';
import { FileUploader } from './FileUploader';
import { MappedFieldsPreview } from './MappedFieldsPreview';

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newTemplateName: string;
  setNewTemplateName: (name: string) => void;
  newTemplateType: 'facture' | 'appel' | 'rappel' | 'autre';
  setNewTemplateType: (type: 'facture' | 'appel' | 'rappel' | 'autre') => void;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  handleUpload: () => void;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
}

const UploadDialog: React.FC<UploadDialogProps> = ({
  open,
  onOpenChange,
  newTemplateName,
  setNewTemplateName,
  newTemplateType,
  setNewTemplateType,
  selectedFile,
  setSelectedFile,
  handleUpload,
  handleFileSelect,
  handleDragOver,
  handleDragLeave,
  handleDrop,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[520px] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau modèle</DialogTitle>
          <DialogDescription>
            Téléchargez un fichier PDF ou Word qui servira de modèle pour la génération de documents.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4 py-2">
            <TemplateNameField 
              value={newTemplateName} 
              onChange={setNewTemplateName} 
            />
            
            <TemplateTypeSelector 
              value={newTemplateType} 
              onChange={setNewTemplateType} 
            />
            
            <FileUploader
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              handleFileSelect={handleFileSelect}
              handleDragOver={handleDragOver}
              handleDragLeave={handleDragLeave}
              handleDrop={handleDrop}
            />
            
            <MappedFieldsPreview />
          </div>
        </ScrollArea>
        
        <DialogFooter className="mt-4 pt-2 border-t">
          <Button variant="outline" onClick={() => {
            onOpenChange(false);
            setSelectedFile(null);
          }}>
            Annuler
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={!newTemplateName || !selectedFile || getFileType(selectedFile) === 'unknown'}
          >
            Ajouter le modèle
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Utility function to determine file type
export const getFileType = (file: File | null): 'pdf' | 'doc' | 'docx' | 'unknown' => {
  if (!file) return 'unknown';
  
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  if (extension === 'pdf') return 'pdf';
  if (extension === 'doc') return 'doc';
  if (extension === 'docx') return 'docx';
  
  return 'unknown';
};

export default UploadDialog;
