
import { PDFDocument } from 'pdf-lib';
import { toast } from 'sonner';

export interface TemplateField {
  name: string;
  placeholder: string;
}

export const DEFAULT_FIELD_MAPPINGS: TemplateField[] = [
  { name: "DATE ECHEANCE", placeholder: "{{DATE ECHEANCE}}" },
  { name: "Cotisation", placeholder: "{{Cotisation}}" },
  { name: "N° adh", placeholder: "{{N° adh}}" },
  { name: "SOCIETE", placeholder: "{{SOCIETE}}" },
  { name: "Dirigeant", placeholder: "{{Dirigeant}}" },
  { name: "E MAIL 1", placeholder: "{{E MAIL 1}}" },
  { name: "E Mail 2", placeholder: "{{E Mail 2}}" },
  { name: "Adresse", placeholder: "{{Adresse}}" },
  { name: "ville", placeholder: "{{ville}}" }
];

export const pdfMappingService = {
  // Auto-detect fields in template and match with CSV columns
  autoMapFields: async (pdfBytes: ArrayBuffer, csvHeaders: string[]) => {
    try {
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pages = pdfDoc.getPages();
      
      // Create mappings based on CSV headers that match our predefined fields
      const mappings = new Map<string, string>();
      
      DEFAULT_FIELD_MAPPINGS.forEach(field => {
        if (csvHeaders.includes(field.name)) {
          mappings.set(field.name, field.placeholder);
        }
      });
      
      return mappings;
    } catch (error) {
      console.error('Error mapping fields:', error);
      toast.error('Erreur lors du mappage automatique des champs');
      return new Map<string, string>();
    }
  },

  // Generate final PDF with replaced values
  generateFilledPDF: async (
    templateBytes: ArrayBuffer, 
    data: Record<string, string>,
    mappings: Map<string, string>
  ) => {
    try {
      // Load the PDF document
      const pdfDoc = await PDFDocument.load(templateBytes);
      const pages = pdfDoc.getPages();
      
      // This is a simplified approach. In a real implementation,
      // we would need to use a PDF modification library that supports
      // text replacement with proper positioning.
      // For demonstration purposes, we'll create a new PDF with the data
      
      // Create a new PDF with the same dimensions
      const newPdf = await PDFDocument.create();
      
      // For each page in the original PDF
      for (const page of pages) {
        const { width, height } = page.getSize();
        const newPage = newPdf.addPage([width, height]);
        
        // Draw the original page content (simplified)
        // In a real implementation, we would properly transfer all content
        
        // Apply text replacements
        let yOffset = 50;
        mappings.forEach((placeholder, fieldName) => {
          const value = data[fieldName] || '';
          if (value) {
            // This is simplified - in a real implementation we would place text at correct positions
            newPage.drawText(`${fieldName}: ${value}`, {
              x: 50,
              y: height - yOffset,
              size: 12
            });
            yOffset += 20;
          }
        });
      }
      
      // Save the PDF
      const pdfBytes = await newPdf.save();
      return pdfBytes;
    } catch (error) {
      console.error('Error generating filled PDF:', error);
      toast.error('Erreur lors de la génération du PDF');
      throw error;
    }
  },
  
  // Save a template with its mapping configuration
  saveTemplateMapping: async (templateId: string, mappings: Map<string, string>) => {
    try {
      // This would typically save to a database
      // For now, we'll use localStorage
      const mappingsObj = Object.fromEntries(mappings);
      localStorage.setItem(`template_mapping_${templateId}`, JSON.stringify(mappingsObj));
      
      toast.success('Configuration de mappage sauvegardée');
      return true;
    } catch (error) {
      console.error('Error saving template mapping:', error);
      toast.error('Erreur lors de la sauvegarde du mappage');
      return false;
    }
  },
  
  // Get the mapping configuration for a template
  getTemplateMapping: async (templateId: string): Promise<Map<string, string>> => {
    try {
      const mappingsJson = localStorage.getItem(`template_mapping_${templateId}`);
      if (!mappingsJson) return new Map();
      
      const mappingsObj = JSON.parse(mappingsJson);
      return new Map(Object.entries(mappingsObj));
    } catch (error) {
      console.error('Error retrieving template mapping:', error);
      return new Map();
    }
  }
};
