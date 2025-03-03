
import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TemplateSelector from './TemplateSelector';
import TemplateFieldsPreview from './TemplateFieldsPreview';
import PdfGenerationError from './PdfGenerationError';
import PdfPreview from './PdfPreview';
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
  const [activeTab, setActiveTab] = useState('config');
  const [previewData, setPreviewData] = useState<Record<string, string> | undefined>(
    selectedRows.length > 0 ? selectedRows[0] : undefined
  );
  
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
  
  // Update preview data when selected rows change
  React.useEffect(() => {
    if (selectedRows.length > 0) {
      setPreviewData(selectedRows[0]);
    }
  }, [selectedRows]);
  
  const confirmGeneration = () => {
    generatePdfs(selectedRows);
  };
  
  const handlePreviewRow = (index: number) => {
    if (selectedRows.length > index) {
      setPreviewData(selectedRows[index]);
      setActiveTab('preview');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Générer des documents PDF</DialogTitle>
          <DialogDescription>
            Sélectionnez un modèle, prévisualisez et générez vos documents.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="config">Configuration</TabsTrigger>
            <TabsTrigger value="preview">Aperçu</TabsTrigger>
          </TabsList>
          
          <TabsContent value="config" className="py-4">
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
              
              {selectedRows.length > 1 && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-md">
                  <h4 className="text-sm font-medium text-blue-700">Options d'aperçu</h4>
                  <p className="text-xs text-blue-600 mt-1 mb-2">
                    Prévisualisez le document pour un destinataire spécifique :
                  </p>
                  <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                    {selectedRows.slice(0, 5).map((row, index) => {
                      const company = row.SOCIETE || row.societe || row.Société || row.société || `Entreprise ${index + 1}`;
                      return (
                        <Button 
                          key={index} 
                          variant="outline" 
                          size="sm"
                          onClick={() => handlePreviewRow(index)}
                        >
                          {company}
                        </Button>
                      );
                    })}
                    {selectedRows.length > 5 && (
                      <span className="text-xs text-slate-500 flex items-center">
                        +{selectedRows.length - 5} autres
                      </span>
                    )}
                  </div>
                </div>
              )}
              
              <PdfGenerationError error={generationError} />
            </div>
          </TabsContent>
          
          <TabsContent value="preview" className="py-4">
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-100 rounded-md p-3 mb-4">
                <p className="text-sm text-amber-700">
                  Aperçu pour: <strong>{previewData?.SOCIETE || previewData?.societe || "Document"}</strong>
                </p>
              </div>
              
              <PdfPreview 
                selectedTemplate={selectedTemplate}
                templates={templates}
                previewData={previewData}
              />
            </div>
          </TabsContent>
        </Tabs>
        
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
