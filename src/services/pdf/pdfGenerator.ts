
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { toast } from 'sonner';
import { findValueCaseInsensitive } from './pdfMapper';

/**
 * Service responsible for generating PDF documents with data
 */
export const pdfGenerator = {
  /**
   * Generate final PDF with replaced values
   */
  generateFilledPDF: async (
    templateBytes: ArrayBuffer, 
    data: Record<string, string>,
    mappings: Map<string, string>
  ): Promise<Uint8Array> => {
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
  }
};
