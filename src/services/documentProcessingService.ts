
import { PDFDocument } from 'pdf-lib';
import mammoth from 'mammoth';
import { toast } from 'sonner';
import { saveAs } from 'file-saver';

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

export const documentProcessingService = {
  // Détecte le type de document (PDF, DOC, DOCX)
  detectDocumentType: (file: File): 'pdf' | 'doc' | 'docx' | 'unknown' => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    if (extension === 'pdf') return 'pdf';
    if (extension === 'doc') return 'doc';
    if (extension === 'docx') return 'docx';
    
    return 'unknown';
  },
  
  // Auto-detect fields in template and match with CSV columns
  autoMapFields: async (file: File, csvHeaders: string[]) => {
    try {
      const documentType = documentProcessingService.detectDocumentType(file);
      const fileBuffer = await file.arrayBuffer();
      
      let textContent = '';
      
      // Extract text content based on document type
      if (documentType === 'pdf') {
        const pdfDoc = await PDFDocument.load(fileBuffer);
        // PDF text extraction is limited in pdf-lib 
        // In a real implementation, we would use a more robust PDF text extraction library
        textContent = "PDF content"; // Placeholder
      } else if (documentType === 'doc' || documentType === 'docx') {
        const result = await mammoth.extractRawText({ arrayBuffer: fileBuffer });
        textContent = result.value;
      } else {
        throw new Error("Format de document non pris en charge");
      }
      
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

  // Generate final document with replaced values
  generateFilledDocument: async (
    templateFile: File,
    data: Record<string, string>,
    mappings: Map<string, string>
  ) => {
    try {
      const documentType = documentProcessingService.detectDocumentType(templateFile);
      const fileBuffer = await templateFile.arrayBuffer();
      
      if (documentType === 'pdf') {
        return await documentProcessingService.generateFilledPDF(fileBuffer, data, mappings);
      } else if (documentType === 'doc' || documentType === 'docx') {
        return await documentProcessingService.generateFilledDOCX(fileBuffer, data, mappings);
      } else {
        throw new Error("Format de document non pris en charge");
      }
    } catch (error) {
      console.error('Error generating document:', error);
      toast.error('Erreur lors de la génération du document');
      throw error;
    }
  },

  // Generate filled PDF document
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
      
      // Apply text replacements
      // Note: This is a placeholder. In a real implementation,
      // we would properly replace text at the correct positions
      
      // Save the PDF
      const pdfBytes = await pdfDoc.save();
      return pdfBytes;
    } catch (error) {
      console.error('Error generating filled PDF:', error);
      toast.error('Erreur lors de la génération du PDF');
      throw error;
    }
  },
  
  // Generate filled DOCX document
  generateFilledDOCX: async (
    templateBytes: ArrayBuffer,
    data: Record<string, string>,
    mappings: Map<string, string>
  ) => {
    try {
      // Note: This is a placeholder for DOCX generation logic
      // In a real implementation, we would use a library like docxtemplater
      // to replace placeholders in the DOCX file
      
      // Return the modified document
      // For now, we'll just return the original bytes
      return templateBytes;
    } catch (error) {
      console.error('Error generating filled DOCX:', error);
      toast.error('Erreur lors de la génération du document Word');
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
  },
  
  // Exporter le document généré
  exportDocument: async (documentBytes: ArrayBuffer, filename: string, type: 'pdf' | 'doc' | 'docx') => {
    try {
      let mimeType = 'application/octet-stream';
      
      if (type === 'pdf') {
        mimeType = 'application/pdf';
        filename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
      } else if (type === 'doc') {
        mimeType = 'application/msword';
        filename = filename.endsWith('.doc') ? filename : `${filename}.doc`;
      } else if (type === 'docx') {
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        filename = filename.endsWith('.docx') ? filename : `${filename}.docx`;
      }
      
      const blob = new Blob([documentBytes], { type: mimeType });
      saveAs(blob, filename);
      
      toast.success('Document exporté avec succès');
      return true;
    } catch (error) {
      console.error('Error exporting document:', error);
      toast.error('Erreur lors de l\'exportation du document');
      return false;
    }
  }
};
