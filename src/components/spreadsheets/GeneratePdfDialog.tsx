
import React from 'react';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import TemplateSelector from './TemplateSelector';
import TemplateFieldsPreview from './TemplateFieldsPreview';
import PdfGenerationError from './PdfGenerationError';
import { usePdfGeneration } from '@/hooks/usePdfGeneration';
import { SpreadsheetTemplate } from '@/hooks/useSpreadsheetTemplates';

interface GeneratePdfDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRows: any[];
  selectedTemplate: string;
  setSelectedTemplate: (value: string) => void;
  templates: SpreadsheetTemplate[];
}

const GeneratePdfDialog: React.FC<GeneratePdfDialogProps> = ({
  open,
  onOpenChange,
  selectedRows,
  selectedTemplate,
  setSelectedTemplate,
  templates
}) => {
  const { 
    isGenerating, 
    generationError, 
    templateBytes, 
    generatePdfs 
  } = usePdfGeneration(
    selectedTemplate, 
    templates, 
    () => onOpenChange(false)
  );
  
  const confirmGeneration = () => {
    generatePdfs(selectedRows);
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
            <TemplateSelector 
              templates={templates}
              selectedTemplate={selectedTemplate}
              setSelectedTemplate={setSelectedTemplate}
            />
            
            <TemplateFieldsPreview 
              templateId={selectedTemplate}
              templates={templates}
            />
            
            <PdfGenerationError error={generationError} />
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
