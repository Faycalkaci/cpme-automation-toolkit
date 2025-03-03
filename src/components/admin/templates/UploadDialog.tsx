
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileUp, X, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau modèle</DialogTitle>
          <DialogDescription>
            Téléchargez un fichier PDF qui servira de modèle pour la génération de documents.
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
              Fichier PDF
            </label>
            <div 
              className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
                selectedFile ? 'border-green-500 bg-green-50' : 'border-slate-200 hover:border-primary/50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="text-center">
                {selectedFile ? (
                  <>
                    <Check className="h-8 w-8 mx-auto text-green-500" />
                    <p className="mt-2 text-sm font-medium text-green-700">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
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
                      Glissez-déposez votre fichier PDF ici ou cliquez pour parcourir
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
                      accept=".pdf" 
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => {
            onOpenChange(false);
            setSelectedFile(null);
          }}>
            Annuler
          </Button>
          <Button onClick={handleUpload} disabled={!newTemplateName || !selectedFile}>
            Ajouter le modèle
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDialog;
