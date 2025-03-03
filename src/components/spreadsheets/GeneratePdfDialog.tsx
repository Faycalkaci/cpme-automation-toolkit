import React, { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { v4 as uuidv4 } from 'uuid';
import { documentStorage } from '@/services/documentStorage';
import { pdfMappingService } from '@/services/pdfMappingService';
import { templateStorage } from '@/services/templateStorage';

interface Template {
  id: string;
  name: string;
  mappingFields?: string[];
  fileUrl?: string;
  file?: File;
}

interface GeneratePdfDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRows: any[];
  selectedTemplate: string;
  setSelectedTemplate: (value: string) => void;
  templates: Template[];
}

const GeneratePdfDialog: React.FC<GeneratePdfDialogProps> = ({
  open,
  onOpenChange,
  selectedRows,
  selectedTemplate,
  setSelectedTemplate,
  templates
}) => {
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
        if (template.file) {
          const arrayBuffer = await template.file.arrayBuffer();
          setTemplateBytes(arrayBuffer);
          return;
        }
        
        // Otherwise, try to fetch it from the fileUrl
        if (template.fileUrl) {
          // Get the template from templateStorage
          const storedTemplate = await templateStorage.getTemplateById(template.id);
          
          if (storedTemplate && storedTemplate.file) {
            const arrayBuffer = await storedTemplate.file.arrayBuffer();
            setTemplateBytes(arrayBuffer);
            return;
          }
          
          // If we couldn't get it from storage, try to fetch it
          const response = await fetch(template.fileUrl);
          const arrayBuffer = await response.arrayBuffer();
          setTemplateBytes(arrayBuffer);
        }
      } catch (error) {
        console.error("Error loading template file:", error);
        toast.error("Erreur lors du chargement du modèle");
        setTemplateBytes(null);
      }
    };
    
    loadTemplateFile();
  }, [selectedTemplate, templates]);
  
  const confirmGeneration = async () => {
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
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error generating PDF', error);
      setGenerationError("Une erreur est survenue lors de la génération du PDF. Veuillez vérifier que toutes les données sont présentes.");
      setIsGenerating(false);
      toast.error('Erreur de génération', {
        description: 'Une erreur est survenue lors de la génération du PDF.'
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Générer des documents PDF</DialogTitle>
          <DialogDescription>
            Sélectionnez un modèle et mappez les champs pour générer vos documents.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <p className="mb-4">
            Vous êtes sur le point de générer {selectedRows.length} {selectedRows.length > 1 ? 'documents' : 'document'}.
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Modèle de document</label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un modèle" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map(template => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedTemplate === 'appel' && (
              <div className="mt-4 p-3 bg-slate-50 rounded-md border border-slate-200">
                <h4 className="text-sm font-medium mb-2">Champs à mapper pour "Appel de cotisation"</h4>
                <div className="grid grid-cols-2 gap-2">
                  {templates.find(t => t.id === 'appel')?.mappingFields?.map((field, index) => (
                    <div key={index} className="text-xs bg-white p-2 rounded border border-slate-100 flex items-center">
                      <span className="bg-primary/10 text-primary text-[10px] px-1 rounded mr-1">{`{{${field}}}`}</span>
                      <span className="truncate">{field}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {generationError && (
              <Alert variant="destructive" className="mt-4">
                <AlertTitle>Erreur de génération</AlertTitle>
                <AlertDescription>{generationError}</AlertDescription>
              </Alert>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isGenerating}>
            Annuler
          </Button>
          <Button 
            onClick={confirmGeneration} 
            disabled={!selectedTemplate || isGenerating || !templateBytes}
            className={isGenerating ? "opacity-80" : ""}
          >
            <FileText className="mr-2 h-4 w-4" />
            {isGenerating ? "Génération en cours..." : "Générer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GeneratePdfDialog;
