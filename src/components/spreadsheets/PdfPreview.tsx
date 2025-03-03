
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { pdfService } from '@/services/pdf/pdfService';
import { SpreadsheetTemplate } from '@/hooks/useSpreadsheetTemplates';

interface PdfPreviewProps {
  selectedTemplate: string;
  templates: SpreadsheetTemplate[];
  previewData?: Record<string, string>;
}

const PdfPreview: React.FC<PdfPreviewProps> = ({
  selectedTemplate,
  templates,
  previewData = {}
}) => {
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const generatePreview = async () => {
      if (!selectedTemplate) {
        setPreviewUrl(null);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const template = templates.find(t => t.id === selectedTemplate);
        if (!template) {
          throw new Error("Template not found");
        }
        
        // Get template bytes
        let templateBytes: ArrayBuffer;
        
        if (template.file && typeof template.file.arrayBuffer === 'function') {
          templateBytes = await template.file.arrayBuffer();
        } else if (template.fileUrl) {
          const response = await fetch(template.fileUrl);
          templateBytes = await response.arrayBuffer();
        } else {
          templateBytes = await pdfService.createDefaultPdf();
        }
        
        // Get mapping configuration
        const mappings = await pdfService.getTemplateMapping(selectedTemplate);
        
        // Generate preview with sample or provided data
        const sampleData = previewData && Object.keys(previewData).length > 0 
          ? previewData 
          : createSampleData();
        
        const pdfBytes = await pdfService.generateFilledPDF(
          templateBytes,
          sampleData,
          mappings
        );
        
        // Create blob URL for preview
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        
        setPreviewUrl(url);
      } catch (error) {
        console.error("Error generating preview:", error);
        setError("Impossible de générer l'aperçu du document");
      } finally {
        setLoading(false);
      }
    };
    
    generatePreview();
    
    // Cleanup function
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [selectedTemplate, templates, previewData]);
  
  const createSampleData = (): Record<string, string> => {
    return {
      "DATE ECHEANCE": "31/12/2023",
      "Cotisation": "500€",
      "N° adh": "ADH123456",
      "SOCIETE": "Entreprise Exemple",
      "Dirigeant": "Jean Dupont",
      "E MAIL 1": "contact@exemple.fr",
      "E Mail 2": "direction@exemple.fr",
      "Adresse": "123 Avenue des Exemples",
      "ville": "Paris"
    };
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 bg-slate-50 rounded-lg h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-sm text-slate-600">Génération de l'aperçu en cours...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center p-8 bg-slate-50 rounded-lg h-[400px]">
        <div className="text-center">
          <p className="text-sm text-red-500">{error}</p>
          <p className="mt-2 text-xs text-slate-500">
            Veuillez vérifier que le modèle est valide et réessayer.
          </p>
        </div>
      </div>
    );
  }
  
  if (!previewUrl) {
    return (
      <div className="flex items-center justify-center p-8 bg-slate-50 rounded-lg h-[400px]">
        <p className="text-sm text-slate-500">
          Sélectionnez un modèle pour générer un aperçu
        </p>
      </div>
    );
  }
  
  return (
    <div className="h-[400px] border rounded-lg overflow-hidden">
      <iframe 
        src={previewUrl} 
        className="w-full h-full"
        title="Aperçu du document"
        aria-label="Aperçu du document PDF"
      />
    </div>
  );
};

export default PdfPreview;
