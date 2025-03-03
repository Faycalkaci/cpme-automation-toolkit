
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { Template } from '@/components/admin/templates/types';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';
import mammoth from 'mammoth';

export interface DocumentField {
  name: string;
  placeholder: string;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
    page: number;
  };
}

export const documentProcessingService = {
  // Extract text content from PDF
  extractPdfText: async (pdfBytes: ArrayBuffer): Promise<string> => {
    try {
      // This is a simple implementation. In a production environment,
      // you would use a more robust library like pdf.js
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pageCount = pdfDoc.getPageCount();
      
      // For this demo, we'll just return a placeholder message
      return `PDF document with ${pageCount} pages loaded successfully`;
    } catch (error) {
      console.error('Error extracting PDF text:', error);
      toast.error('Erreur lors de l\'extraction du texte du PDF');
      return '';
    }
  },
  
  // Extract text content from DOC/DOCX
  extractDocText: async (docBytes: ArrayBuffer): Promise<string> => {
    try {
      const result = await mammoth.extractRawText({ arrayBuffer: docBytes });
      return result.value;
    } catch (error) {
      console.error('Error extracting DOC text:', error);
      toast.error('Erreur lors de l\'extraction du texte du document Word');
      return '';
    }
  },
  
  // Auto-detect fields in a document based on common patterns
  detectFields: async (fileBuffer: ArrayBuffer, fileType: string): Promise<DocumentField[]> => {
    try {
      const detectedFields: DocumentField[] = [];
      
      if (fileType === 'application/pdf') {
        // Read the PDF and look for placeholder patterns like {{...}}
        const pdfText = await documentProcessingService.extractPdfText(fileBuffer);
        
        // Regular expression to find placeholders in the format {{placeholder}}
        const placeholderRegex = /\{\{([^}]+)\}\}/g;
        let match;
        
        while ((match = placeholderRegex.exec(pdfText)) !== null) {
          detectedFields.push({
            name: match[1],
            placeholder: match[0]
          });
        }
      } else if (fileType === 'application/msword' || fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        // Extract text from DOC/DOCX
        const docText = await documentProcessingService.extractDocText(fileBuffer);
        
        // Regular expression to find placeholders in the format {{placeholder}}
        const placeholderRegex = /\{\{([^}]+)\}\}/g;
        let match;
        
        while ((match = placeholderRegex.exec(docText)) !== null) {
          detectedFields.push({
            name: match[1],
            placeholder: match[0]
          });
        }
      }
      
      return detectedFields;
    } catch (error) {
      console.error('Error detecting fields:', error);
      toast.error('Erreur lors de la détection automatique des champs');
      return [];
    }
  },
  
  // Parse CSV/Excel file and extract headers
  extractCsvHeaders: async (fileBuffer: ArrayBuffer): Promise<string[]> => {
    try {
      const workbook = XLSX.read(fileBuffer, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      
      // Convert sheet to JSON
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      // Get the headers (first row)
      if (data && data.length > 0) {
        return data[0] as string[];
      }
      
      return [];
    } catch (error) {
      console.error('Error extracting CSV headers:', error);
      toast.error('Erreur lors de l\'extraction des en-têtes CSV');
      return [];
    }
  },
  
  // Match CSV headers with document fields
  mapCsvToDocumentFields: (csvHeaders: string[], documentFields: DocumentField[]): Record<string, string> => {
    const mapping: Record<string, string> = {};
    
    documentFields.forEach(field => {
      // Try to find an exact match first
      const exactMatch = csvHeaders.find(header => header === field.name);
      if (exactMatch) {
        mapping[field.name] = field.placeholder;
        return;
      }
      
      // Try a case-insensitive match
      const caseInsensitiveMatch = csvHeaders.find(
        header => header.toLowerCase() === field.name.toLowerCase()
      );
      if (caseInsensitiveMatch) {
        mapping[caseInsensitiveMatch] = field.placeholder;
        return;
      }
      
      // Try a fuzzy match (contains)
      const fuzzyMatch = csvHeaders.find(
        header => field.name.toLowerCase().includes(header.toLowerCase()) || 
                  header.toLowerCase().includes(field.name.toLowerCase())
      );
      if (fuzzyMatch) {
        mapping[fuzzyMatch] = field.placeholder;
      }
    });
    
    return mapping;
  },
  
  // Generate a filled document by replacing placeholders with values
  fillDocument: async (
    templateBuffer: ArrayBuffer,
    documentType: 'pdf' | 'doc' | 'docx',
    mappingConfig: Record<string, string>,
    data: Record<string, string>
  ): Promise<ArrayBuffer> => {
    try {
      if (documentType === 'pdf') {
        // Load the PDF document
        const pdfDoc = await PDFDocument.load(templateBuffer);
        const pages = pdfDoc.getPages();
        
        // Create a new PDF with the same dimensions
        const newPdf = await PDFDocument.create();
        const helveticaFont = await newPdf.embedFont(StandardFonts.Helvetica);
        
        // For each page in the original PDF
        for (const page of pages) {
          const { width, height } = page.getSize();
          const newPage = newPdf.addPage([width, height]);
          
          // In a real implementation, we would transfer content and replace text
          // For this demo, we'll just add the filled fields at the top of the page
          let yPosition = height - 50;
          
          for (const [fieldName, placeholder] of Object.entries(mappingConfig)) {
            const value = data[fieldName] || '';
            if (value) {
              newPage.drawText(`${fieldName}: ${value}`, {
                x: 50,
                y: yPosition,
                size: 12,
                font: helveticaFont
              });
              yPosition -= 20;
            }
          }
        }
        
        // Save the PDF
        return await newPdf.save();
      } else if (documentType === 'doc' || documentType === 'docx') {
        // For DOC/DOCX processing, we would use a library like docx-templates
        // For this demo, we'll just return the original buffer
        // (In a real implementation, you would use proper DOC/DOCX manipulation)
        toast.warning('Le remplissage de documents Word est une fonctionnalité en développement');
        return templateBuffer;
      }
      
      return templateBuffer;
    } catch (error) {
      console.error('Error filling document:', error);
      toast.error('Erreur lors du remplissage du document');
      throw error;
    }
  },
  
  // Save a template mapping configuration
  saveTemplateMapping: async (templateId: string, mappingConfig: Record<string, string>): Promise<boolean> => {
    try {
      localStorage.setItem(`template_mapping_${templateId}`, JSON.stringify(mappingConfig));
      toast.success('Configuration de mappage sauvegardée');
      return true;
    } catch (error) {
      console.error('Error saving template mapping:', error);
      toast.error('Erreur lors de la sauvegarde du mappage');
      return false;
    }
  },
  
  // Get a template mapping configuration
  getTemplateMapping: async (templateId: string): Promise<Record<string, string>> => {
    try {
      const mappingJson = localStorage.getItem(`template_mapping_${templateId}`);
      if (!mappingJson) return {};
      return JSON.parse(mappingJson);
    } catch (error) {
      console.error('Error retrieving template mapping:', error);
      return {};
    }
  }
};
