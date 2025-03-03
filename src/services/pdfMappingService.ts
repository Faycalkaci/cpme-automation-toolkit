
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
      
      // pdf-lib doesn't have getTextContent directly, so we'll map fields based on CSV headers
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
      let pdfContent = new TextDecoder().decode(new Uint8Array(templateBytes));
      
      // Replace all mapped fields with actual values
      mappings.forEach((placeholder, fieldName) => {
        const value = data[fieldName] || '';
        const regex = new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        pdfContent = pdfContent.replace(regex, value);
      });
      
      // Convert back to PDF
      const pdfDoc = await PDFDocument.load(new TextEncoder().encode(pdfContent));
      return await pdfDoc.save();
    } catch (error) {
      console.error('Error generating filled PDF:', error);
      toast.error('Erreur lors de la génération du PDF');
      throw error;
    }
  }
};
