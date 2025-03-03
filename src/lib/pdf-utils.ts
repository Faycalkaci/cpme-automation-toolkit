
import { jsPDF } from 'jspdf';
import { ParsedRow } from './csv-utils';

export interface TemplateField {
  id: string;
  label: string;
  csvField: string;
  x: number;
  y: number;
  fontSize?: number;
  isBold?: boolean;
}

export interface PDFTemplate {
  id: string;
  name: string;
  description: string;
  baseTemplate: string; // base64 encoded PDF
  fields: TemplateField[];
}

/**
 * Generate a PDF from a CSV row using a template
 */
export const generatePDF = async (
  row: ParsedRow, 
  template: PDFTemplate
): Promise<Blob> => {
  // Create a new jsPDF instance
  const doc = new jsPDF();
  
  // Load the base template if provided
  if (template.baseTemplate) {
    doc.addPage();
    // In a real implementation, we would add the base PDF here
    // For this demo, we'll create a simple page with a header
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(template.name, 105, 20, { align: 'center' });
    doc.setDrawColor(0);
    doc.line(20, 25, 190, 25);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
  }
  
  // Add field values to the PDF
  template.fields.forEach(field => {
    const value = row[field.csvField] || '';
    const fontSize = field.fontSize || 12;
    
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', field.isBold ? 'bold' : 'normal');
    doc.text(value, field.x, field.y);
  });
  
  // Return as blob
  return doc.output('blob');
};

/**
 * Generate multiple PDFs from CSV rows using a template
 */
export const generateBulkPDFs = async (
  rows: ParsedRow[], 
  template: PDFTemplate
): Promise<Blob[]> => {
  const promises = rows.map(row => generatePDF(row, template));
  return Promise.all(promises);
};

/**
 * Merge multiple PDF blobs into a single PDF
 * In a real implementation, you'd use a library like pdf-lib
 * For this demo, we'll simulate the merge
 */
export const mergePDFs = async (pdfBlobs: Blob[]): Promise<Blob> => {
  // This is a simplified mock of PDF merging
  // In a real app, you'd use pdf-lib or similar
  
  const doc = new jsPDF();
  
  // Just return the first PDF for demo purposes
  if (pdfBlobs.length > 0) {
    return pdfBlobs[0];
  }
  
  return doc.output('blob');
};

/**
 * Download a PDF blob
 */
export const downloadPDF = (blob: Blob, filename: string = 'document.pdf') => {
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
