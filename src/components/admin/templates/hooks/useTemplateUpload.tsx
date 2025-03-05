
import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { Template } from '../types';
import { useAuth } from '@/contexts/AuthContext';
import { pdfMappingService, DEFAULT_FIELD_MAPPINGS } from '@/services/pdfMappingService';
import { useTemplates } from '@/hooks/useTemplates';
import { firestoreService } from '@/services/firebase/firestore';

export const useTemplateUpload = () => {
  const { user } = useAuth();
  const { saveTemplate, loadTemplates } = useTemplates(true);
  
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateType, setNewTemplateType] = useState<'facture' | 'appel' | 'rappel' | 'autre'>('autre');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
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
        fileUrl: '', // Sera mis à jour après le téléchargement sur Firebase Storage
        file: selectedFile,
        savedBy: user?.name || user?.email || 'Anonymous',
        createdBy: user?.name || user?.email || 'Anonymous',
        organizationId: user?.organizationId,
        lastModified: new Date().toISOString(),
        mappingConfig: mappingConfig,
        documentType: documentType,
        permanent: false,
        createdAt: new Date(),
        mappingFields: mappedFields,
      };
      
      // Sauvegarder le template (avec Firebase Storage pour le fichier)
      await saveTemplate(newTemplate);
      
      // Fermer la boîte de dialogue et réinitialiser les champs
      setShowUploadDialog(false);
      setNewTemplateName('');
      setNewTemplateType('autre');
      setSelectedFile(null);
      
      if (Object.keys(mappingConfig).length > 0) {
        const mappingsMap = new Map(Object.entries(mappingConfig));
        await pdfMappingService.saveTemplateMapping(newTemplate.id, mappingsMap);
      }
      
      // Recharger les templates pour actualiser la liste
      await loadTemplates();
      
      toast.success('Modèle ajouté avec succès', {
        description: `Le modèle "${newTemplateName}" a été ajouté à votre bibliothèque et sauvegardé dans le cloud.`
      });
    } catch (error) {
      console.error('Error processing template:', error);
      toast.error('Erreur lors du traitement du modèle');
    }
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
          file.name.toLowerCase().endsWith('.doc') || 
          file.name.toLowerCase().endsWith('.docx')) {
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

  return {
    showUploadDialog,
    setShowUploadDialog,
    newTemplateName,
    setNewTemplateName,
    newTemplateType,
    setNewTemplateType,
    selectedFile,
    setSelectedFile,
    handleFileSelect,
    handleUpload,
    handleDragOver,
    handleDragLeave,
    handleDrop
  };
};
