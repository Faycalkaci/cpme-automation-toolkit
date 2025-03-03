
import { jsPDF } from 'jspdf';
import { toast } from 'sonner';

export const generateAndDownloadPdf = (data: any[], headers: string[]) => {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    doc.setFontSize(18);
    doc.text('Données exportées', pageWidth / 2, 15, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, pageWidth / 2, 22, { align: 'center' });
    
    const maxColumnWidth = 25;
    let columnWidths: number[] = [];
    let startX = 10;
    const startY = 30;
    const rowHeight = 10;
    
    headers.forEach((header, index) => {
      const width = Math.min(header.length * 2 + 6, maxColumnWidth);
      columnWidths.push(width);
      
      doc.rect(startX, startY, width, rowHeight, 'FD');
      doc.text(header, startX + 2, startY + 6);
      
      startX += width;
    });
    
    data.forEach((row, rowIndex) => {
      const y = startY + (rowIndex + 1) * rowHeight;
      
      if (y + rowHeight > doc.internal.pageSize.getHeight() - 10) {
        doc.addPage();
        return;
      }
      
      let x = 10;
      
      headers.forEach((header, colIndex) => {
        const width = columnWidths[colIndex];
        const value = String(row[header] || '');
        
        doc.setDrawColor(200, 200, 200);
        doc.rect(x, y, width, rowHeight);
        
        const truncatedValue = value.length > width / 2 ? value.substring(0, Math.floor(width / 2)) + '...' : value;
        doc.text(truncatedValue, x + 2, y + 6);
        
        x += width;
      });
    });
    
    doc.save('donnees_exportees.pdf');
    
    toast.success("PDF généré et téléchargé", { 
      description: `${data.length} lignes exportées au format PDF.` 
    });
    
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    toast.error("Erreur lors de la génération du PDF", { 
      description: "Une erreur est survenue pendant la génération du PDF." 
    });
    return false;
  }
};

export const validateRequiredFields = (data: any[]) => {
  const requiredFields = ['SOCIETE', 'N° adh', 'Cotisation'];
  return data.some(row => 
    requiredFields.some(field => !row[field] && !row[field.toLowerCase()])
  );
};
