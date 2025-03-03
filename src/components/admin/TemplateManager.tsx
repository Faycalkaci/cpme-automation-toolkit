import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { pdfMappingService, DEFAULT_FIELD_MAPPINGS } from '@/services/pdfMappingService';
import { Template } from './templates/types';
import TemplateHeader from './templates/TemplateHeader';
import TemplateList from './templates/TemplateList';
import UploadDialog from './templates/UploadDialog';
import DeleteDialog from './templates/DeleteDialog';
import SaveDialog from './templates/SaveDialog';
import PreviewDialog from './templates/PreviewDialog';
import { templateStorage } from '@/services/templateStorage';

const TemplateManager: React.FC = () => {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<Template[]>([]);
  
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<Template | null>(null);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [templateToPreview, setTemplateToPreview] = useState<Template | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [templateToSave, setTemplateToSave] = useState<Template | null>(null);
  
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateType, setNewTemplateType] = useState<'facture' | 'appel' | 'rappel' | 'autre'>('autre');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const adminTemplates = await templateStorage.getTemplates(true);
        setTemplates(adminTemplates);
      } catch (error) {
        console.error('Error loading templates:', error);
      }
    };
    
    loadTemplates();
  }, []);
  
  const canSaveTemplate = user && (user.role === 'admin' || user.role === 'super-admin');
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      let documentType: 'pdf' | 'doc' | 'docx' = 'pdf';
      if (file.name.toLowerCase().endsWith('.doc')) {
        documentType = 'doc';
      } else if (file.name.toLowerCase().endsWith('.docx')) {
        documentType = 'docx';
      } else if (!file.name.toLowerCase().endsWith('.pdf')) {
        toast.error('Type de fichier invalide', {
          description: 'Veuillez sélectionner un fichier PDF, DOC ou DOCX.'
        });
        return;
      }
      
      setSelectedFile(file);
      toast.success('Fichier sélectionné', {
        description: `"${file.name}" a été sélectionné.`
      });
      
      if (file.name.toLowerCase().includes('appel')) {
        setNewTemplateType('appel');
      } else if (file.name.toLowerCase().includes('facture')) {
        setNewTemplateType('facture');
      } else if (file.name.toLowerCase().includes('rappel')) {
        setNewTemplateType('rappel');
      }
      
      const nameWithoutExtension = file.name.replace(/\.(pdf|doc|docx)$/i, '');
      setNewTemplateName(nameWithoutExtension);
    }
  };
  
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Fichier manquant', {
        description: 'Veuillez sélectionner un fichier (PDF, DOC ou DOCX).'
      });
      return;
    }
    
    if (!newTemplateName) {
      toast.error('Nom manquant', {
        description: 'Veuillez donner un nom à votre modèle.'
      });
      return;
    }

    try {
      let documentType: 'pdf' | 'doc' | 'docx' = 'pdf';
      if (selectedFile.name.toLowerCase().endsWith('.doc')) {
        documentType = 'doc';
      } else if (selectedFile.name.toLowerCase().endsWith('.docx')) {
        documentType = 'docx';
      }
      
      let mappedFields = DEFAULT_FIELD_MAPPINGS.map(f => f.name);
      let mappingConfig: Record<string, string> = {};
      
      if (documentType === 'pdf' && 
          (newTemplateType === 'appel' || selectedFile.name.toLowerCase().includes('appel'))) {
        
        const fileBuffer = await selectedFile.arrayBuffer();
        const csvHeaders = DEFAULT_FIELD_MAPPINGS.map(f => f.name);
        const mappings = await pdfMappingService.autoMapFields(fileBuffer, csvHeaders);
        
        if (mappings.size > 0) {
          mappedFields = Array.from(mappings.keys());
          mappingConfig = Object.fromEntries(mappings);
          
          toast.success('Champs automatiquement mappés', {
            description: `${mappings.size} champs ont été détectés et mappés.`
          });
        }
      }

      const newTemplate: Template = {
        id: Date.now().toString(),
        name: newTemplateName,
        type: newTemplateType,
        date: new Date().toISOString().split('T')[0],
        fields: mappedFields,
        fileUrl: URL.createObjectURL(selectedFile),
        file: selectedFile,
        savedBy: user?.name || user?.email || 'Anonymous',
        createdBy: user?.name || user?.email || 'Anonymous',
        organizationId: user?.organizationId,
        lastModified: new Date().toISOString(),
        mappingConfig: mappingConfig,
        documentType: documentType,
        permanent: canSaveTemplate,
        createdAt: new Date()
      };
      
      await templateStorage.saveTemplate(newTemplate, true);
      
      setTemplates([...templates, newTemplate]);
      
      setShowUploadDialog(false);
      setNewTemplateName('');
      setNewTemplateType('autre');
      setSelectedFile(null);
      
      if (Object.keys(mappingConfig).length > 0) {
        const mappingsMap = new Map(Object.entries(mappingConfig));
        await pdfMappingService.saveTemplateMapping(newTemplate.id, mappingsMap);
      }
      
      toast.success('Modèle ajouté avec succès', {
        description: `Le modèle "${newTemplateName}" a été ajouté à votre bibliothèque.`
      });
    } catch (error) {
      console.error('Error processing template:', error);
      toast.error('Erreur lors du traitement du modèle');
    }
  };
  
  const handleDeleteTemplate = async () => {
    if (templateToDelete) {
      if (templateToDelete.permanent && templateToDelete.savedBy === 'system') {
        toast.error('Action non autorisée', {
          description: 'Vous ne pouvez pas supprimer un modèle système permanent.'
        });
        setShowDeleteDialog(false);
        setTemplateToDelete(null);
        return;
      }
      
      try {
        await templateStorage.deleteTemplate(templateToDelete.id, true);
        setTemplates(templates.filter(t => t.id !== templateToDelete.id));
        
        toast.success('Modèle supprimé', {
          description: `Le modèle "${templateToDelete.name}" a été supprimé.`
        });
      } catch (error) {
        console.error('Error deleting template:', error);
        toast.error('Erreur lors de la suppression du modèle');
      }
      
      setShowDeleteDialog(false);
      setTemplateToDelete(null);
    }
  };
  
  const handleSaveTemplatePermanently = async () => {
    if (templateToSave) {
      try {
        const updatedTemplate = {
          ...templateToSave,
          permanent: true,
          savedBy: user?.name || user?.email || 'Anonymous',
          lastModified: new Date().toISOString()
        };
        
        await templateStorage.saveTemplate(updatedTemplate, true);
        
        const updatedTemplates = templates.map(template => 
          template.id === templateToSave.id ? updatedTemplate : template
        );
        
        setTemplates(updatedTemplates);
        
        toast.success('Modèle sauvegardé définitivement', {
          description: `Le modèle "${templateToSave.name}" est maintenant disponible pour tous les utilisateurs.`
        });
      } catch (error) {
        console.error('Error saving template permanently:', error);
        toast.error('Erreur lors de la sauvegarde du modèle');
      }
      
      setShowSaveDialog(false);
      setTemplateToSave(null);
    }
  };
  
  const openDeleteDialog = (template: Template) => {
    setTemplateToDelete(template);
    setShowDeleteDialog(true);
  };
  
  const openPreviewDialog = (template: Template) => {
    setTemplateToPreview(template);
    setShowPreviewDialog(true);
  };
  
  const openSaveDialog = (template: Template) => {
    if (!canSaveTemplate) {
      toast.error('Permission refusée', {
        description: 'Vous n\'avez pas les droits pour sauvegarder définitivement un modèle.'
      });
      return;
    }
    
    setTemplateToSave(template);
    setShowSaveDialog(true);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('border-primary', 'bg-primary/5');
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('border-primary', 'bg-primary/5');
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('border-primary', 'bg-primary/5');
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
        
        if (file.name.toLowerCase().includes('appel')) {
          setNewTemplateType('appel');
        } else if (file.name.toLowerCase().includes('facture')) {
          setNewTemplateType('facture');
        } else if (file.name.toLowerCase().includes('rappel')) {
          setNewTemplateType('rappel');
        }
        
        const nameWithoutExtension = file.name.replace('.pdf', '');
        setNewTemplateName(nameWithoutExtension);
        
        toast.success('Fichier sélectionné', {
          description: `"${file.name}" a été sélectionné.`
        });
      } else {
        toast.error('Type de fichier invalide', {
          description: 'Veuillez sélectionner un fichier PDF.'
        });
      }
    }
  };
  
  return (
    <div className="space-y-6">
      <TemplateHeader onAddTemplate={() => setShowUploadDialog(true)} />
      
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
    </div>
  );
};

export default TemplateManager;
