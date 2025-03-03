import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { documentProcessingService } from '@/services/documentProcessingService';
import { Template } from './templates/types';
import TemplateHeader from './templates/TemplateHeader';
import TemplateList from './templates/TemplateList';
import UploadDialog from './templates/UploadDialog';
import DeleteDialog from './templates/DeleteDialog';
import SaveDialog from './templates/SaveDialog';
import PreviewDialog from './templates/PreviewDialog';

const TemplateManager: React.FC = () => {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: '1',
      name: 'Appel de cotisation',
      type: 'appel',
      documentType: 'pdf',
      date: '2023-06-15',
      fields: ['Entreprise', 'Adresse', 'Code Postal', 'Ville', 'Email', 'Montant'],
      fileUrl: '/templates/appel-cotisation.pdf',
      permanent: true,
      savedBy: 'system',
      mappingConfig: {
        'DATE ECHEANCE': '{{DATE ECHEANCE}}',
        'Cotisation': '{{Cotisation}}',
        'N° adh': '{{N° adh}}',
        'SOCIETE': '{{SOCIETE}}',
        'Dirigeant': '{{Dirigeant}}',
        'E MAIL 1': '{{E MAIL 1}}',
        'E Mail 2': '{{E Mail 2}}',
        'Adresse': '{{Adresse}}',
        'ville': '{{ville}}'
      }
    },
    {
      id: '2',
      name: 'Facture standard',
      type: 'facture',
      documentType: 'pdf',
      date: '2023-08-20',
      fields: ['Entreprise', 'Adresse', 'Code Postal', 'Ville', 'Email', 'Référence', 'Date', 'Montant HT', 'TVA', 'Total TTC'],
      fileUrl: '/templates/facture.pdf',
      permanent: true,
      savedBy: 'system'
    },
    {
      id: '3',
      name: 'Rappel de cotisation',
      type: 'rappel',
      documentType: 'pdf',
      date: '2023-09-05',
      fields: ['Entreprise', 'Adresse', 'Code Postal', 'Ville', 'Email', 'Montant', 'Date échéance'],
      fileUrl: '/templates/rappel-cotisation.pdf',
      permanent: true,
      savedBy: 'system'
    }
  ]);
  
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
    const savedTemplates = localStorage.getItem('cpme_templates');
    if (savedTemplates) {
      try {
        const parsedTemplates = JSON.parse(savedTemplates);
        const allTemplates = [...templates];
        
        parsedTemplates.forEach((savedTemplate: Template) => {
          if (!allTemplates.some(t => t.id === savedTemplate.id)) {
            allTemplates.push(savedTemplate);
          }
        });
        
        setTemplates(allTemplates);
      } catch (error) {
        console.error('Error parsing saved templates:', error);
      }
    }
  }, []);
  
  useEffect(() => {
    const userTemplates = templates.filter(t => !t.permanent || t.savedBy !== 'system');
    localStorage.setItem('cpme_templates', JSON.stringify(userTemplates));
  }, [templates]);
  
  const canSaveTemplate = user && (user.role === 'admin' || user.role === 'super-admin');
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf' || 
          file.type === 'application/msword' || 
          file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        
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
      } else {
        toast.error('Type de fichier invalide', {
          description: 'Veuillez sélectionner un fichier PDF, DOC ou DOCX.'
        });
      }
    }
  };
  
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Fichier manquant', {
        description: 'Veuillez sélectionner un fichier.'
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
      if (selectedFile.type === 'application/msword') {
        documentType = 'doc';
      } else if (selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        documentType = 'docx';
      }
      
      const fileBuffer = await selectedFile.arrayBuffer();
      const documentFields = await documentProcessingService.detectFields(fileBuffer, selectedFile.type);
      
      const mappedFields = documentFields.map(f => f.name);
      let mappingConfig: Record<string, string> = {};
      
      if (documentFields.length > 0) {
        documentFields.forEach(field => {
          mappingConfig[field.name] = field.placeholder;
        });
        
        toast.success('Champs automatiquement mappés', {
          description: `${documentFields.length} champs ont été détectés et mappés.`
        });
      } else if (newTemplateType === 'appel') {
        mappingConfig = {
          'DATE ECHEANCE': '{{DATE ECHEANCE}}',
          'Cotisation': '{{Cotisation}}',
          'N° adh': '{{N° adh}}',
          'SOCIETE': '{{SOCIETE}}',
          'Dirigeant': '{{Dirigeant}}',
          'E MAIL 1': '{{E MAIL 1}}',
          'E Mail 2': '{{E Mail 2}}',
          'Adresse': '{{Adresse}}',
          'ville': '{{ville}}'
        };
      }

      const newTemplate: Template = {
        id: Date.now().toString(),
        name: newTemplateName,
        type: newTemplateType,
        documentType: documentType,
        date: new Date().toISOString().split('T')[0],
        fields: mappedFields.length > 0 ? mappedFields : ['Entreprise', 'Adresse', 'Email'],
        fileUrl: URL.createObjectURL(selectedFile),
        file: selectedFile,
        savedBy: user?.name || user?.email || 'Anonymous',
        createdBy: user?.name || user?.email || 'Anonymous',
        organizationId: user?.organizationId,
        lastModified: new Date().toISOString(),
        mappingConfig: mappingConfig
      };
      
      setTemplates([...templates, newTemplate]);
      setShowUploadDialog(false);
      setNewTemplateName('');
      setNewTemplateType('autre');
      setSelectedFile(null);
      
      if (Object.keys(mappingConfig).length > 0) {
        await documentProcessingService.saveTemplateMapping(newTemplate.id, mappingConfig);
      }
      
      toast.success('Modèle ajouté avec succès', {
        description: `Le modèle "${newTemplateName}" a été ajouté à votre bibliothèque.`
      });
    } catch (error) {
      console.error('Error processing template:', error);
      toast.error('Erreur lors du traitement du modèle');
    }
  };
  
  const handleDeleteTemplate = () => {
    if (templateToDelete) {
      if (templateToDelete.permanent && templateToDelete.savedBy === 'system') {
        toast.error('Action non autorisée', {
          description: 'Vous ne pouvez pas supprimer un modèle système permanent.'
        });
        setShowDeleteDialog(false);
        setTemplateToDelete(null);
        return;
      }
      
      setTemplates(templates.filter(t => t.id !== templateToDelete.id));
      setShowDeleteDialog(false);
      setTemplateToDelete(null);
      
      toast.success('Modèle supprimé', {
        description: `Le modèle "${templateToDelete.name}" a été supprimé.`
      });
    }
  };
  
  const handleSaveTemplatePermanently = () => {
    if (templateToSave) {
      const updatedTemplates = templates.map(template => 
        template.id === templateToSave.id 
          ? { 
              ...template, 
              permanent: true, 
              savedBy: user?.name || user?.email || 'Anonymous',
              lastModified: new Date().toISOString()
            } 
          : template
      );
      
      setTemplates(updatedTemplates);
      setShowSaveDialog(false);
      setTemplateToSave(null);
      
      toast.success('Modèle sauvegardé définitivement', {
        description: `Le modèle "${templateToSave.name}" est maintenant disponible pour tous les utilisateurs.`
      });
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
      if (file.type === 'application/pdf' || 
          file.type === 'application/msword' || 
          file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        
        setSelectedFile(file);
        
        if (file.name.toLowerCase().includes('appel')) {
          setNewTemplateType('appel');
        } else if (file.name.toLowerCase().includes('facture')) {
          setNewTemplateType('facture');
        } else if (file.name.toLowerCase().includes('rappel')) {
          setNewTemplateType('rappel');
        }
        
        const nameWithoutExtension = file.name.replace(/\.(pdf|doc|docx)$/i, '');
        setNewTemplateName(nameWithoutExtension);
        
        toast.success('Fichier sélectionné', {
          description: `"${file.name}" a été sélectionné.`
        });
      } else {
        toast.error('Type de fichier invalide', {
          description: 'Veuillez sélectionner un fichier PDF, DOC ou DOCX.'
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
