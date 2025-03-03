
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { toast } from 'sonner';
import { DEFAULT_FIELD_MAPPINGS } from './pdfTypes';

/**
 * Service responsible for creating PDF documents
 */
export const pdfCreator = {
  /**
   * Create a default PDF when no template is available
   */
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
      toast.error("Erreur lors de la création du PDF par défaut");
      throw error;
    }
  }
};
