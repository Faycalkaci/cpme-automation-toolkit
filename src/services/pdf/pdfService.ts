
import { pdfCreator } from './pdfCreator';
import { pdfMapper } from './pdfMapper';
import { pdfGenerator } from './pdfGenerator';
import { DEFAULT_FIELD_MAPPINGS } from './pdfTypes';

/**
 * Main PDF service that acts as a facade for all PDF-related operations
 */
export const pdfService = {
  // Create default PDF
  createDefaultPdf: pdfCreator.createDefaultPdf,
  
  // Map fields
  autoMapFields: async (pdfBytes: ArrayBuffer, csvHeaders: string[]) => {
    return pdfMapper.autoMapFields(pdfBytes, csvHeaders, DEFAULT_FIELD_MAPPINGS);
  },
  
  // Generate filled PDF
  generateFilledPDF: pdfGenerator.generateFilledPDF,
  
  // Save template mapping
  saveTemplateMapping: pdfMapper.saveTemplateMapping,
  
  // Get template mapping
  getTemplateMapping: async (templateId: string) => {
    return pdfMapper.getTemplateMapping(templateId, DEFAULT_FIELD_MAPPINGS);
  }
};

export { DEFAULT_FIELD_MAPPINGS } from './pdfTypes';
export type { TemplateField } from './pdfTypes';
