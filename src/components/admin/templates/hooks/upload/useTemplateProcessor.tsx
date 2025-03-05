
import { useState } from 'react';
import { toast } from 'sonner';
import { Template } from '../../types';
import { useAuth } from '@/contexts/auth/AuthContext';
import { pdfMappingService, DEFAULT_FIELD_MAPPINGS } from '@/services/pdfMappingService';
import { useTemplates } from '@/hooks/useTemplates';

export const useTemplateProcessor = () => {
  const { user } = useAuth();
  const { saveTemplate, loadTemplates } = useTemplates(true);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  
  const handleUpload = async (
    selectedFile: File | null, 
    newTemplateName: string, 
    newTemplateType: 'facture' | 'appel' | 'rappel' | 'autre',
    setShowUploadDialog: (show: boolean) => void,
    setSelectedFile: (file: File | null) => void,
    setNewTemplateName: (name: string) => void,
    setNewTemplateType: (type: 'facture' | 'appel' | 'rappel' | 'autre') => void
  ) => {
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
      console.log('Processing template upload for:', newTemplateName);
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

      const templateId = Date.now().toString();
      const newTemplate: Template = {
        id: templateId,
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
      
      console.log('Saving template:', newTemplate.name, 'Type:', documentType);
      
      // Créer une URL temporaire pour le fichier avant l'upload
      if (documentType === 'pdf') {
        try {
          const objectUrl = URL.createObjectURL(selectedFile);
          newTemplate.fileUrl = objectUrl;
          console.log('Created temporary object URL:', objectUrl);
        } catch (urlError) {
          console.error('Error creating object URL:', urlError);
        }
      }
      
      // Sauvegarder le template (cela tentera d'abord Firestore, puis localStorage)
      const saved = await saveTemplate(newTemplate);
      
      if (!saved) {
        toast.error('Erreur lors de la sauvegarde du modèle', {
          description: 'Veuillez réessayer ou contacter l\'administrateur.'
        });
        return;
      }
      
      // Fermer la boîte de dialogue et réinitialiser les champs
      setShowUploadDialog(false);
      setNewTemplateName('');
      setNewTemplateType('autre');
      setSelectedFile(null);
      
      if (Object.keys(mappingConfig).length > 0) {
        try {
          const mappingsMap = new Map(Object.entries(mappingConfig));
          await pdfMappingService.saveTemplateMapping(newTemplate.id, mappingsMap);
        } catch (mappingError) {
          console.error('Error saving template mapping:', mappingError);
        }
      }
      
      // Recharger les templates pour actualiser la liste
      await loadTemplates();
      
      toast.success('Modèle ajouté avec succès', {
        description: `Le modèle "${newTemplateName}" a été ajouté à votre bibliothèque.`
      });
    } catch (error) {
      console.error('Error processing template:', error);
      toast.error('Erreur lors du traitement du modèle', {
        description: error instanceof Error ? error.message : 'Une erreur est survenue'
      });
    }
  };

  return {
    showUploadDialog,
    setShowUploadDialog,
    handleUpload,
    loadTemplates
  };
};
