
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { documentStorage } from '@/services/documentStorage';
import { pdfMappingService } from '@/services/pdfMappingService';
import { templateStorage } from '@/services/templateStorage';
import { SpreadsheetTemplate } from '@/hooks/useSpreadsheetTemplates';

export const usePdfGeneration = (
  selectedTemplate: string,
  templates: SpreadsheetTemplate[],
  onComplete: () => void
) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [templateBytes, setTemplateBytes] = useState<ArrayBuffer | null>(null);
  
  // Load the template file when the selected template changes
  useEffect(() => {
    const loadTemplateFile = async () => {
      if (!selectedTemplate) return;
      
      const template = templates.find(t => t.id === selectedTemplate);
      if (!template) return;
      
      try {
        // If we have a File object in the template, use it
        if (template.file && typeof template.file.arrayBuffer === 'function') {
          const arrayBuffer = await template.file.arrayBuffer();
          setTemplateBytes(arrayBuffer);
          return;
        }
        
        // Otherwise, try to fetch it from the fileUrl
        if (template.fileUrl) {
          // Get the template from templateStorage
          const storedTemplate = await templateStorage.getTemplateById(template.id);
          
          if (storedTemplate && storedTemplate.file && typeof storedTemplate.file.arrayBuffer === 'function') {
            const arrayBuffer = await storedTemplate.file.arrayBuffer();
            setTemplateBytes(arrayBuffer);
            return;
          }
          
          // If we couldn't get it from storage, try to fetch it
          const response = await fetch(template.fileUrl);
          const arrayBuffer = await response.arrayBuffer();
          setTemplateBytes(arrayBuffer);
        } else {
          // Create a default PDF if no template is available
          console.log("No template file available, creating default PDF");
          const defaultPdfBuffer = await pdfMappingService.createDefaultPdf();
          setTemplateBytes(defaultPdfBuffer);
        }
      } catch (error) {
        console.error("Error loading template file:", error);
        toast.error("Erreur lors du chargement du modèle");
        
        // Create a default PDF as fallback
        try {
          const defaultPdfBuffer = await pdfMappingService.createDefaultPdf();
          setTemplateBytes(defaultPdfBuffer);
        } catch (fallbackError) {
          console.error("Error creating default PDF:", fallbackError);
          setTemplateBytes(null);
        }
      }
    };
    
    loadTemplateFile();
  }, [selectedTemplate, templates]);

  const generatePdfs = async (selectedRows: any[]) => {
    if (!selectedTemplate) {
      toast.error('Sélection requise', {
        description: 'Veuillez sélectionner un modèle de document.'
      });
      return;
    }
    
    if (!templateBytes) {
      toast.error('Modèle non disponible', {
        description: 'Le fichier modèle n\'a pas pu être chargé. Veuillez réessayer.'
      });
      return;
    }
    
    const templateObj = templates.find(t => t.id === selectedTemplate);
    
    if (templateObj && templateObj.mappingFields && templateObj.mappingFields.length > 0) {
      toast.info('Champs mappés', {
        description: `Les champs suivants seront utilisés: ${templateObj.mappingFields.join(', ')}`
      });
    }
    
    setIsGenerating(true);
    setGenerationError(null);
    
    toast.success('Génération en cours', {
      description: `${selectedRows.length} documents sont en cours de génération.`
    });
    
    try {
      // Get mapping configuration for the template
      const mappings = await pdfMappingService.getTemplateMapping(selectedTemplate);
      
      // Generate PDFs for each selected row
      for (let i = 0; i < selectedRows.length; i++) {
        const row = selectedRows[i];
        
        // Generate the filled PDF
        const pdfBytes = await pdfMappingService.generateFilledPDF(
          templateBytes,
          row,
          mappings
        );
        
        // Create a blob and download link
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        
        // Create a filename based on the company name or a timestamp
        const companyName = row.SOCIETE || row.societe || row.Société || row.société || 'document';
        const sanitizedName = companyName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        link.download = `${sanitizedName}_cpme.pdf`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      // Créer des entrées pour les documents générés
      const currentDate = new Date();
      const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`;
      
      const generatedDocuments = selectedRows.map(row => {
        const company = row.SOCIETE || row.societe || row.Société || row.société || 'Entreprise';
        const type = templateObj?.name || 'Document';
        const size = Math.floor(Math.random() * 20) + 40 + ' Ko'; // Taille aléatoire entre 40 et 60 Ko
        
        return {
          id: uuidv4(),
          name: `${type} - ${company}.pdf`,
          type,
          date: formattedDate,
          size,
          sent: false,
          company
        };
      });
      
      // Sauvegarder les documents générés
      documentStorage.saveDocuments(generatedDocuments)
        .then(() => {
          console.log(`${generatedDocuments.length} documents sauvegardés avec succès`);
        })
        .catch(error => {
          console.error('Erreur lors de la sauvegarde des documents:', error);
        });
      
      setIsGenerating(false);
      toast.success('Génération terminée', {
        description: `${selectedRows.length} documents ont été générés avec succès.`
      });
      
      onComplete();
    } catch (error) {
      console.error('Error generating PDF', error);
      setGenerationError("Une erreur est survenue lors de la génération du PDF. Veuillez vérifier que toutes les données sont présentes.");
      setIsGenerating(false);
      toast.error('Erreur de génération', {
        description: 'Une erreur est survenue lors de la génération du PDF.'
      });
    }
  };

  return {
    isGenerating,
    generationError,
    templateBytes,
    generatePdfs
  };
};
