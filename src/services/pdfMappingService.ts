
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
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
  // Create a default PDF when no template is available
  createDefaultPdf: async (): Promise<ArrayBuffer> => {
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595, 842]); // A4 size
      
      // Set up font
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      
      // Add header
      page.drawText("CPME - Appel de cotisation", {
        x: 50,
        y: page.getHeight() - 50,
        size: 18,
        font: boldFont,
        color: rgb(0, 0.3, 0.6),
      });
      
      // Add space for fields
      let yPosition = page.getHeight() - 100;
      const lineHeight = 25;
      
      DEFAULT_FIELD_MAPPINGS.forEach(field => {
        page.drawText(`${field.name}: `, {
          x: 50,
          y: yPosition,
          size: 12,
          font: font,
          color: rgb(0.2, 0.2, 0.2),
        });
        
        page.drawText(`[${field.placeholder}]`, {
          x: 200,
          y: yPosition,
          size: 12,
          font: font, 
          color: rgb(0.5, 0.5, 0.5),
        });
        
        yPosition -= lineHeight;
      });
      
      // Add footer
      page.drawText("Document généré automatiquement", {
        x: 50,
        y: 50,
        size: 10,
        font: font,
        color: rgb(0.5, 0.5, 0.5),
      });
      
      const pdfBytes = await pdfDoc.save();
      return pdfBytes.buffer;
    } catch (error) {
      console.error("Error creating default PDF:", error);
      throw error;
    }
  },

  // Auto-detect fields in template and match with CSV columns
  autoMapFields: async (pdfBytes: ArrayBuffer, csvHeaders: string[]) => {
    try {
      const pdfDoc = await PDFDocument.load(pdfBytes);
      
      // Create mappings based on CSV headers that match our predefined fields
      const mappings = new Map<string, string>();
      
      // Always include all default fields, regardless of detection
      DEFAULT_FIELD_MAPPINGS.forEach(field => {
        // Try to match with CSV headers using exact match or case-insensitive match
        const matchingHeader = csvHeaders.find(header => 
          header === field.name || 
          header.toLowerCase() === field.name.toLowerCase() ||
          header.normalize('NFD').replace(/[\u0300-\u036f]/g, '') === 
          field.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        );
        
        // Add to mappings - use the exact CSV header name if found, otherwise use the default field name
        mappings.set(matchingHeader || field.name, field.placeholder);
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
      // Load the original PDF document
      const pdfDoc = await PDFDocument.load(templateBytes);
      const pages = pdfDoc.getPages();
      const page = pages[0]; // Assuming we're working with the first page
      
      // Set up font
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontSize = 12;
      
      // Set the document title
      page.drawText(`Appel de cotisation CPME`, {
        x: 50,
        y: page.getHeight() - 50,
        size: 16,
        font
      });
      
      // Define y position start and offset
      let yPosition = page.getHeight() - 80;
      const lineHeight = 25;
      
      // Define field formatting
      const fieldTextFormat = {
        DATE_ECHEANCE: (value: string) => `DATE ECHEANCE: ${value}`,
        Cotisation: (value: string) => `Cotisation: ${value}`,
        'N° adh': (value: string) => `N° adh: ${value}`,
        SOCIETE: (value: string) => `SOCIETE: ${value}`,
        Dirigeant: (value: string) => `Dirigeant: ${value}`,
        'E MAIL 1': (value: string) => `E MAIL 1: ${value}`,
        'E Mail 2': (value: string) => `E Mail 2: ${value}`,
        Adresse: (value: string) => `Adresse: ${value}`,
        ville: (value: string) => `ville: ${value}`
      };
      
      // Draw each mapped field on the PDF
      mappings.forEach((placeholder, fieldName) => {
        // Find the value in the data using case-insensitive matching
        const value = findValueCaseInsensitive(data, fieldName) || '-';
        
        // Format the field text
        const formatter = fieldTextFormat[fieldName as keyof typeof fieldTextFormat] || 
                         ((v: string) => `${fieldName}: ${v}`);
        const text = formatter(value);
        
        // Draw text on the PDF
        page.drawText(text, {
          x: 50,
          y: yPosition,
          size: fontSize,
          font
        });
        
        // Update Y position for next field
        yPosition -= lineHeight;
      });
      
      // Save the PDF
      const pdfBytes = await pdfDoc.save();
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
      if (!mappingsJson) {
        // If no mapping exists, return default mappings
        return new Map(DEFAULT_FIELD_MAPPINGS.map(field => [field.name, field.placeholder]));
      }
      
      const mappingsObj = JSON.parse(mappingsJson);
      return new Map(Object.entries(mappingsObj));
    } catch (error) {
      console.error('Error retrieving template mapping:', error);
      // Return default mappings on error
      return new Map(DEFAULT_FIELD_MAPPINGS.map(field => [field.name, field.placeholder]));
    }
  }
};

// Helper function to find field values case-insensitively
function findValueCaseInsensitive(data: Record<string, string>, field: string): string | undefined {
  // Try exact match first
  if (data[field] !== undefined) {
    return data[field];
  }
  
  // Try case-insensitive match
  const lowerField = field.toLowerCase();
  for (const key in data) {
    if (key.toLowerCase() === lowerField) {
      return data[key];
    }
  }
  
  return undefined;
}
