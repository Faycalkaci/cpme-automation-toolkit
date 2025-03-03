
import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface Template {
  id: string;
  name: string;
  mappingFields?: string[];
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
  
  const confirmGeneration = () => {
    if (!selectedTemplate) {
      toast.error('Sélection requise', {
        description: 'Veuillez sélectionner un modèle de document.'
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
    
    setTimeout(() => {
      try {
        const doc = new jsPDF();
        
        doc.setFontSize(16);
        doc.text(`${templateObj?.name || 'Document'} CPME`, 10, 20);
        
        let yPos = 30;
        
        selectedRows.forEach((row, index) => {
          if (index > 0) {
            doc.addPage();
            yPos = 30;
            doc.text(`${templateObj?.name || 'Document'} CPME`, 10, 20);
          }
          
          if (templateObj && templateObj.mappingFields) {
            templateObj.mappingFields.forEach(field => {
              // Check if the field exists in the row data (case insensitive)
              const fieldValue = row[field] || findCaseInsensitiveField(row, field) || '-';
              doc.setFontSize(12);
              doc.text(`${field}: ${fieldValue}`, 10, yPos);
              yPos += 10;
            });
          } else {
            Object.entries(row).forEach(([key, value]) => {
              if (value) {
                doc.setFontSize(12);
                doc.text(`${key}: ${value}`, 10, yPos);
                yPos += 10;
              }
            });
          }
        });
        
        doc.save(`${templateObj?.id || 'document'}_cpme.pdf`);
        
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
    }, 1000);
  };
  
  // Helper function to find field values case-insensitively
  const findCaseInsensitiveField = (row: any, fieldName: string): string | undefined => {
    const lowerFieldName = fieldName.toLowerCase();
    
    for (const [key, value] of Object.entries(row)) {
      if (key.toLowerCase() === lowerFieldName) {
        return value as string;
      }
    }
    
    return undefined;
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
            disabled={!selectedTemplate || isGenerating}
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
