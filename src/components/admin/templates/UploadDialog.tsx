
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileUp, FileText, File, X, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { documentProcessingService } from '@/services/documentProcessingService';
import { toast } from 'sonner';

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
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedFields, setDetectedFields] = useState<string[]>([]);

  const browseFiles = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const analyzeFile = async () => {
    if (!selectedFile) return;
    
    setIsAnalyzing(true);
    try {
      const fileBuffer = await selectedFile.arrayBuffer();
      const documentFields = await documentProcessingService.detectFields(
        fileBuffer, 
        selectedFile.type
      );
      
      const fieldNames = documentFields.map(field => field.name);
      setDetectedFields(fieldNames);
      
      if (fieldNames.length > 0) {
        toast.success(`${fieldNames.length} champs détectés automatiquement`);
      } else {
        toast.info('Aucun champ détecté automatiquement');
      }
    } catch (error) {
      console.error('Error analyzing file:', error);
      toast.error('Erreur lors de l\'analyse du fichier');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getFileIcon = () => {
    if (!selectedFile) return <FileUp className="h-8 w-8 mx-auto text-slate-400" />;
    
    if (selectedFile.type === 'application/pdf') {
      return <FileText className="h-8 w-8 mx-auto text-red-500" />;
    } else if (
      selectedFile.type === 'application/msword' || 
      selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      return <File className="h-8 w-8 mx-auto text-blue-500" />;
    }
    
    return <FileUp className="h-8 w-8 mx-auto text-slate-400" />;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau modèle</DialogTitle>
          <DialogDescription>
            Téléchargez un fichier PDF ou DOC qui servira de modèle pour la génération de documents.
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
              Fichier (PDF, DOC ou DOCX)
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
                    {getFileIcon()}
                    <p className="mt-2 text-sm font-medium text-green-700">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      {Math.round(selectedFile.size / 1024)} Ko
                    </p>
                    <div className="flex justify-center mt-2 space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                          setDetectedFields([]);
                        }}
                      >
                        <X className="h-3 w-3 mr-1" />
                        Supprimer
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          analyzeFile();
                        }}
                        disabled={isAnalyzing}
                      >
                        {isAnalyzing ? (
                          <div className="h-3 w-3 mr-1 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                        ) : (
                          <Check className="h-3 w-3 mr-1" />
                        )}
                        Analyser
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <FileUp className="h-8 w-8 mx-auto text-slate-400" />
                    <p className="mt-2 text-sm text-slate-600">
                      Glissez-déposez votre fichier ici ou cliquez pour parcourir
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Formats acceptés: PDF, DOC, DOCX
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
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
          
          {detectedFields.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Champs détectés</label>
              <div className="border rounded-md p-3 bg-slate-50">
                <div className="flex flex-wrap gap-2">
                  {detectedFields.map((field, index) => (
                    <div key={index} className="bg-white border px-2 py-1 rounded-md text-xs">
                      {field}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => {
            onOpenChange(false);
            setSelectedFile(null);
            setDetectedFields([]);
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
