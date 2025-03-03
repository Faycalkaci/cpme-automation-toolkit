
import React from 'react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DEFAULT_FIELD_MAPPINGS } from '@/services/pdfMappingService';
import { getFileType } from './utils/fileHelpers';
import FileDropArea from './FileDropArea';
import DocumentTypeSelector from './DocumentTypeSelector';
import MappedFieldsDisplay from './MappedFieldsDisplay';

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
  // Get the field names for display
  const defaultFieldNames = DEFAULT_FIELD_MAPPINGS.map(field => field.name);
  const fileType = getFileType(selectedFile);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau modèle</DialogTitle>
          <DialogDescription>
            Téléchargez un fichier PDF ou Word qui servira de modèle pour la génération de documents.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="template-name" className="text-sm font-medium">
              Nom du modèle
            </label>
            <Input
              id="template-name"
              placeholder="Ex: Appel de cotisation 2024"
              value={newTemplateName}
              onChange={(e) => setNewTemplateName(e.target.value)}
            />
          </div>
          
          <DocumentTypeSelector 
            documentType={newTemplateType} 
            setDocumentType={setNewTemplateType} 
          />
          
          <div className="space-y-2">
            <label htmlFor="template-file" className="text-sm font-medium">
              Fichier PDF ou Word
            </label>
            <FileDropArea
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              handleFileSelect={handleFileSelect}
              handleDragOver={handleDragOver}
              handleDragLeave={handleDragLeave}
              handleDrop={handleDrop}
            />
            {selectedFile && fileType === 'unknown' && (
              <p className="text-xs text-yellow-600 mt-1">
                Type de fichier non reconnu. Veuillez utiliser un fichier PDF, DOC ou DOCX.
              </p>
            )}
          </div>
          
          <MappedFieldsDisplay fieldNames={defaultFieldNames} />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => {
            onOpenChange(false);
            setSelectedFile(null);
          }}>
            Annuler
          </Button>
          <Button onClick={handleUpload} disabled={!newTemplateName || !selectedFile || fileType === 'unknown'}>
            Ajouter le modèle
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDialog;
