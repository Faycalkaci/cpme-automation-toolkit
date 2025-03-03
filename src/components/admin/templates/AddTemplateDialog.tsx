
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Plus, Trash2, Upload, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';

interface AddTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveTemplate: (templateData: {
    name: string;
    file: File;
    mappingFields: string[];
  }) => void;
}

const AddTemplateDialog: React.FC<AddTemplateDialogProps> = ({
  open,
  onOpenChange,
  onSaveTemplate,
}) => {
  const [newTemplate, setNewTemplate] = useState<{
    name: string;
    file?: File;
    previewUrl?: string;
    mappingFields: string[];
  }>({
    name: '',
    mappingFields: []
  });
  const [newField, setNewField] = useState('');

  // File dropzone configuration
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        // Create a preview URL for the dropped file
        const previewUrl = URL.createObjectURL(file);
        
        setNewTemplate({
          ...newTemplate,
          file,
          previewUrl
        });
      }
    }
  });

  // Add a field to the template mapping
  const addField = () => {
    if (newField.trim() && !newTemplate.mappingFields.includes(newField.trim())) {
      setNewTemplate({
        ...newTemplate,
        mappingFields: [...newTemplate.mappingFields, newField.trim()]
      });
      setNewField('');
    }
  };

  // Remove a field from the template mapping
  const removeField = (field: string) => {
    setNewTemplate({
      ...newTemplate,
      mappingFields: newTemplate.mappingFields.filter(f => f !== field)
    });
  };

  // Reset form state
  const resetForm = () => {
    setNewTemplate({ name: '', mappingFields: [] });
    setNewField('');
  };

  // Handle form submission
  const handleSubmit = () => {
    if (newTemplate.file) {
      onSaveTemplate({
        name: newTemplate.name,
        file: newTemplate.file,
        mappingFields: newTemplate.mappingFields
      });
      resetForm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) resetForm();
      onOpenChange(newOpen);
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un modèle</DialogTitle>
          <DialogDescription>
            Téléchargez un fichier PDF et définissez les champs à remplacer.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Nom du modèle
            </label>
            <Input
              id="name"
              value={newTemplate.name}
              onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
              placeholder="Appel de cotisation"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Fichier PDF
            </label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-primary/50'
              }`}
            >
              <input {...getInputProps()} />
              
              {newTemplate.file ? (
                <div className="flex items-center justify-center space-x-2">
                  <FileText className="h-6 w-6 text-primary" />
                  <span className="font-medium">{newTemplate.file.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="ml-2 h-7 w-7 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      setNewTemplate({ ...newTemplate, file: undefined, previewUrl: undefined });
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div>
                  <Upload className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                  <p className="text-sm">
                    Glissez-déposez votre fichier PDF ici ou cliquez pour le sélectionner
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Format accepté: PDF
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Champs à mapper
            </label>
            <div className="flex space-x-2">
              <Input
                value={newField}
                onChange={(e) => setNewField(e.target.value)}
                placeholder="Nom du champ (ex: DATE ECHEANCE)"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addField();
                  }
                }}
              />
              <Button type="button" onClick={addField}>Ajouter</Button>
            </div>
            
            <div className="mt-3 flex flex-wrap gap-2">
              {newTemplate.mappingFields.map((field, index) => (
                <div
                  key={index}
                  className="bg-slate-100 px-3 py-1 rounded-full text-sm flex items-center"
                >
                  <span>{field}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="ml-1 h-5 w-5 p-0"
                    onClick={() => removeField(field)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
            
            {newTemplate.mappingFields.length === 0 && (
              <p className="text-xs text-muted-foreground mt-2">
                Ajoutez les noms des champs de vos fichiers Excel que vous souhaitez remplacer dans le PDF.
              </p>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              resetForm();
              onOpenChange(false);
            }}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!newTemplate.name || !newTemplate.file || newTemplate.mappingFields.length === 0}
          >
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTemplateDialog;
