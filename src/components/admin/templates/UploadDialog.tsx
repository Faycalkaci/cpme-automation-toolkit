
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileUp, X, Check, FileText, File } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DEFAULT_FIELD_MAPPINGS } from '@/services/pdfMappingService';

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const browseFiles = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Détermine le type de fichier
  const getFileType = (file: File | null): 'pdf' | 'doc' | 'docx' | 'unknown' => {
    if (!file) return 'unknown';
    
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    if (extension === 'pdf') return 'pdf';
    if (extension === 'doc') return 'doc';
    if (extension === 'docx') return 'docx';
    
    return 'unknown';
  };
  
  const fileType = getFileType(selectedFile);
  
  // Icon basé sur le type de fichier
  const FileIcon = fileType === 'pdf' ? FileText : File;
  
  // Get the field names for display
  const defaultFieldNames = DEFAULT_FIELD_MAPPINGS.map(field => field.name);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau modèle</DialogTitle>
          <DialogDescription>
            Téléchargez un fichier PDF ou Word qui servira de modèle pour la génération de documents.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4 py-2">
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
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Type de document</label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={newTemplateType === 'facture' ? 'default' : 'outline'}
                  onClick={() => setNewTemplateType('facture')}
                  className="justify-start"
                >
                  Facture
                </Button>
                <Button
                  type="button"
                  variant={newTemplateType === 'appel' ? 'default' : 'outline'}
                  onClick={() => setNewTemplateType('appel')}
                  className="justify-start"
                >
                  Appel de cotisation
                </Button>
                <Button
                  type="button"
                  variant={newTemplateType === 'rappel' ? 'default' : 'outline'}
                  onClick={() => setNewTemplateType('rappel')}
                  className="justify-start"
                >
                  Rappel
                </Button>
                <Button
                  type="button"
                  variant={newTemplateType === 'autre' ? 'default' : 'outline'}
                  onClick={() => setNewTemplateType('autre')}
                  className="justify-start"
                >
                  Autre
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="template-file" className="text-sm font-medium">
                Fichier PDF ou Word
              </label>
              <div 
                className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
                  selectedFile ? (
                    fileType === 'pdf' ? 'border-red-500 bg-red-50' : 
                    fileType === 'unknown' ? 'border-yellow-500 bg-yellow-50' : 
                    'border-blue-500 bg-blue-50'
                  ) : 'border-slate-200 hover:border-primary/50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="text-center">
                  {selectedFile ? (
                    <>
                      <FileIcon className={`h-8 w-8 mx-auto ${
                        fileType === 'pdf' ? 'text-red-500' : 
                        fileType === 'unknown' ? 'text-yellow-500' : 
                        'text-blue-500'
                      }`} />
                      <p className={`mt-2 text-sm font-medium ${
                        fileType === 'pdf' ? 'text-red-700' : 
                        fileType === 'unknown' ? 'text-yellow-700' : 
                        'text-blue-700'
                      }`}>
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-slate-600 mt-1">
                        {Math.round(selectedFile.size / 1024)} Ko
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => setSelectedFile(null)}
                      >
                        <X className="h-3 w-3 mr-1" />
                        Supprimer
                      </Button>
                    </>
                  ) : (
                    <>
                      <FileUp className="h-8 w-8 mx-auto text-slate-400" />
                      <p className="mt-2 text-sm text-slate-600">
                        Glissez-déposez votre fichier PDF ou Word ici ou cliquez pour parcourir
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={browseFiles}
                      >
                        Parcourir
                      </Button>
                      <input 
                        ref={fileInputRef}
                        id="template-file" 
                        type="file" 
                        accept=".pdf,.doc,.docx" 
                        className="hidden"
                        onChange={handleFileSelect}
                      />
                    </>
                  )}
                </div>
              </div>
              {selectedFile && fileType === 'unknown' && (
                <p className="text-xs text-yellow-600 mt-1">
                  Type de fichier non reconnu. Veuillez utiliser un fichier PDF, DOC ou DOCX.
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Champs mappés automatiquement</label>
              <div className="flex flex-wrap gap-1 bg-slate-50 p-2 rounded">
                {defaultFieldNames.map((field) => (
                  <div key={field} className="bg-slate-200 px-2 py-1 rounded text-xs text-slate-700 flex items-center">
                    <Check className="h-3 w-3 mr-1 text-green-600" />
                    {field}
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500">
                Ces champs seront automatiquement mappés avec votre fichier CSV/Excel importé.
              </p>
            </div>
          </div>
        </ScrollArea>
        
        <DialogFooter className="mt-4 pt-2 border-t">
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
