
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import FieldMappingSection from './FieldMappingSection';
import TemplateFileDropzone from './TemplateFileDropzone';

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

  // Add a field to the template mapping
  const addField = (field: string) => {
    setNewTemplate({
      ...newTemplate,
      mappingFields: [...newTemplate.mappingFields, field]
    });
  };

  // Remove a field from the template mapping
  const removeField = (field: string) => {
    setNewTemplate({
      ...newTemplate,
      mappingFields: newTemplate.mappingFields.filter(f => f !== field)
    });
  };

  // Handle file change
  const handleFileChange = (file?: File) => {
    setNewTemplate({
      ...newTemplate,
      file,
      previewUrl: file ? URL.createObjectURL(file) : undefined
    });
  };

  // Reset form state
  const resetForm = () => {
    setNewTemplate({ name: '', mappingFields: [] });
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
          
          <TemplateFileDropzone 
            file={newTemplate.file}
            onFileChange={handleFileChange}
            previewUrl={newTemplate.previewUrl}
          />
          
          <FieldMappingSection 
            mappingFields={newTemplate.mappingFields}
            onAddField={addField}
            onRemoveField={removeField}
          />
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
