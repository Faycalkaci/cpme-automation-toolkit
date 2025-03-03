
import { pdfMappingService, DEFAULT_FIELD_MAPPINGS } from '@/services/pdfMappingService';

export async function generateFilledPDFFromTemplate(
  templateFile: File,
  csvData: Record<string, string>
) {
  try {
    const templateBytes = await templateFile.arrayBuffer();
    const mappings = new Map(DEFAULT_FIELD_MAPPINGS.map(f => [f.name, f.placeholder]));
    
    const filledPDFBytes = await pdfMappingService.generateFilledPDF(
      templateBytes,
      csvData,
      mappings
    );
    
    // Create and download the filled PDF
    const blob = new Blob([filledPDFBytes], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `document_${Date.now()}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error generating filled PDF:', error);
    throw error;
  }
}
