
import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Plus, Trash2, Download, FileText, X, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { templateStorage, Template } from '@/services/templateStorage';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Templates = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newTemplate, setNewTemplate] = useState<Partial<Template>>({
    name: '',
    mappingFields: []
  });
  const [newField, setNewField] = useState('');
  
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'super-admin';

  // Load templates from storage on component mount
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const storedTemplates = await templateStorage.getTemplates();
        setTemplates(storedTemplates);
      } catch (error) {
        console.error('Error loading templates:', error);
        toast.error('Erreur lors du chargement des modèles');
      }
    };
    
    loadTemplates();
  }, []);

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
    if (newField.trim() && !newTemplate.mappingFields?.includes(newField.trim())) {
      setNewTemplate({
        ...newTemplate,
        mappingFields: [...(newTemplate.mappingFields || []), newField.trim()]
      });
      setNewField('');
    }
  };

  // Remove a field from the template mapping
  const removeField = (field: string) => {
    setNewTemplate({
      ...newTemplate,
      mappingFields: newTemplate.mappingFields?.filter(f => f !== field) || []
    });
  };

  // Save the new template
  const saveTemplate = async () => {
    if (!newTemplate.name?.trim()) {
      toast.error('Veuillez donner un nom au modèle');
      return;
    }

    if (!newTemplate.file) {
      toast.error('Veuillez ajouter un fichier PDF');
      return;
    }

    if (!newTemplate.mappingFields?.length) {
      toast.error('Veuillez ajouter au moins un champ de mapping');
      return;
    }

    try {
      // Create a complete template object
      const completeTemplate: Template = {
        id: `template-${Date.now()}`,
        name: newTemplate.name,
        file: newTemplate.file,
        previewUrl: newTemplate.previewUrl,
        mappingFields: newTemplate.mappingFields || [],
        createdAt: new Date(),
        createdBy: user?.id
      };

      // Save to storage
      await templateStorage.saveTemplate(completeTemplate);
      
      // Update the local state
      setTemplates([...templates, completeTemplate]);
      
      // Reset the form and close the dialog
      setNewTemplate({ name: '', mappingFields: [] });
      setShowAddDialog(false);
      
      toast.success('Modèle ajouté avec succès');
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Erreur lors de la sauvegarde du modèle');
    }
  };

  // Delete a template
  const deleteTemplate = async (templateId: string) => {
    try {
      await templateStorage.deleteTemplate(templateId);
      setTemplates(templates.filter(t => t.id !== templateId));
      toast.success('Modèle supprimé avec succès');
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Erreur lors de la suppression du modèle');
    }
  };

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Modèles de documents</h1>
          <p className="text-muted-foreground mt-1">
            Gérez les modèles de documents utilisés pour générer vos PDF
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un modèle
        </Button>
      </div>

      {templates.length === 0 ? (
        <div className="border border-dashed rounded-lg p-12 text-center space-y-4">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="text-lg font-medium">Aucun modèle disponible</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Ajoutez des modèles de documents PDF pour pouvoir générer des documents personnalisés à partir de vos données.
          </p>
          <Button variant="outline" onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un modèle
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {templates.map((template) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="border rounded-lg overflow-hidden shadow-sm"
              >
                <div className="bg-slate-100 h-48 flex items-center justify-center">
                  <FileText className="h-16 w-16 text-slate-400" />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-lg mb-1">{template.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {template.mappingFields.length} champs mappés
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {template.mappingFields.slice(0, 5).map((field, index) => (
                      <span key={index} className="text-xs bg-slate-100 px-2 py-1 rounded">
                        {field}
                      </span>
                    ))}
                    {template.mappingFields.length > 5 && (
                      <span className="text-xs bg-slate-100 px-2 py-1 rounded">
                        +{template.mappingFields.length - 5}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteTemplate(template.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add Template Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
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
                {newTemplate.mappingFields?.map((field, index) => (
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
              
              {newTemplate.mappingFields?.length === 0 && (
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
                setNewTemplate({ name: '', mappingFields: [] });
                setShowAddDialog(false);
              }}
            >
              Annuler
            </Button>
            <Button onClick={saveTemplate}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Super Admin Controls (only shown for super admin users) */}
      {isSuperAdmin && (
        <div className="mt-8 p-4 border rounded-lg bg-slate-50">
          <h2 className="text-lg font-medium mb-2">Contrôles administrateur</h2>
          <div className="flex space-x-2">
            <Button 
              variant="destructive" 
              onClick={async () => {
                if (confirm('Êtes-vous sûr de vouloir supprimer tous les modèles ? Cette action est irréversible.')) {
                  await templateStorage.clearTemplates();
                  setTemplates([]);
                  toast.success('Tous les modèles ont été supprimés');
                }
              }}
            >
              Supprimer tous les modèles
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Templates;
