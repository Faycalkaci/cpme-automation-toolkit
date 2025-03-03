import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Download, FileText, Mail, X, CheckSquare, Square } from 'lucide-react';
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';

interface DataTableProps {
  data: any[];
  headers: string[];
  onGeneratePdf: (selectedRows: any[]) => void;
  onSendEmail: (selectedRows: any[]) => void;
}

const DataTable: React.FC<DataTableProps> = ({ 
  data, 
  headers, 
  onGeneratePdf, 
  onSendEmail 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(data);
  const [selectedRows, setSelectedRows] = useState<{[key: number]: boolean}>({});
  const [allSelected, setAllSelected] = useState(false);
  
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredData(data);
    } else {
      const lowercasedTerm = searchTerm.toLowerCase();
      const filtered = data.filter(item => {
        return Object.values(item).some(
          value => 
            value && 
            typeof value === 'string' && 
            value.toLowerCase().includes(lowercasedTerm)
        );
      });
      setFilteredData(filtered);
    }
  }, [data, searchTerm]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const toggleRowSelection = (index: number) => {
    setSelectedRows(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };
  
  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedRows({});
    } else {
      const newSelection: {[key: number]: boolean} = {};
      filteredData.forEach((_, index) => {
        newSelection[index] = true;
      });
      setSelectedRows(newSelection);
    }
    setAllSelected(!allSelected);
  };
  
  const selectedCount = Object.values(selectedRows).filter(Boolean).length;
  
  const getSelectedRowsData = () => {
    return filteredData.filter((_, index) => selectedRows[index]);
  };
  
  const handleGeneratePdf = () => {
    const selectedData = getSelectedRowsData();
    if (selectedData.length === 0) {
      toast.error("Sélection vide", { 
        description: "Veuillez sélectionner au moins une ligne pour générer un PDF." 
      });
      return;
    }
    
    onGeneratePdf(selectedData);
    
    generateAndDownloadPdf(selectedData);
  };
  
  const generateAndDownloadPdf = (data: any[]) => {
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
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error("Erreur lors de la génération du PDF", { 
        description: "Une erreur est survenue pendant la génération du PDF." 
      });
    }
  };
  
  const handleSendEmail = () => {
    const selectedData = getSelectedRowsData();
    if (selectedData.length === 0) {
      toast.error("Sélection vide", { 
        description: "Veuillez sélectionner au moins une ligne pour envoyer un email." 
      });
      return;
    }
    
    const hasEmailColumns = selectedData.some(row => 
      (row['E MAIL 1'] && row['E MAIL 1'].includes('@')) || 
      (row['E Mail 2'] && row['E Mail 2'].includes('@'))
    );
    
    if (!hasEmailColumns) {
      toast.error("Adresses email manquantes", { 
        description: "Les colonnes 'E MAIL 1' ou 'E Mail 2' sont vides ou ne contiennent pas d'adresses email valides." 
      });
      return;
    }
    
    onSendEmail(selectedData);
    
    const emailAddresses = selectedData.reduce((emails: string[], row) => {
      if (row['E MAIL 1'] && row['E MAIL 1'].includes('@')) {
        emails.push(row['E MAIL 1']);
      }
      if (row['E Mail 2'] && row['E Mail 2'].includes('@')) {
        emails.push(row['E Mail 2']);
      }
      return emails;
    }, []);
    
    if (emailAddresses.length > 0) {
      toast.info(`Adresses email détectées (${emailAddresses.length})`, {
        description: emailAddresses.length > 3 
          ? `${emailAddresses.slice(0, 3).join(', ')} et ${emailAddresses.length - 3} autres adresses`
          : emailAddresses.join(', ')
      });
    }
  };
  
  const handleExportCsv = () => {
    const selectedData = getSelectedRowsData();
    if (selectedData.length === 0) {
      toast.error("Sélection vide", { 
        description: "Veuillez sélectionner au moins une ligne pour exporter." 
      });
      return;
    }
    
    const csvContent = [
      headers.join(','),
      ...selectedData.map(row => 
        headers.map(header => {
          const value = row[header] || '';
          return `"${String(value).replace(/"/g, '""')}"`; 
        }).join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'exported_data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Export réussi", { 
      description: `${selectedData.length} lignes exportées au format CSV.` 
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={toggleSelectAll}
            className="flex-shrink-0"
          >
            {allSelected ? <CheckSquare className="mr-2 h-4 w-4" /> : <Square className="mr-2 h-4 w-4" />}
            {allSelected ? 'Désélectionner tout' : 'Sélectionner tout'}
          </Button>
          
          <Button 
            onClick={handleGeneratePdf}
            disabled={selectedCount === 0}
            className="flex-shrink-0"
          >
            <FileText className="mr-2 h-4 w-4" />
            Générer PDF
          </Button>
          
          <Button 
            onClick={handleSendEmail}
            disabled={selectedCount === 0}
            className="flex-shrink-0"
            variant="outline"
          >
            <Mail className="mr-2 h-4 w-4" />
            Envoyer email
          </Button>
          
          <Button 
            onClick={handleExportCsv}
            disabled={selectedCount === 0}
            className="flex-shrink-0"
            variant="outline"
          >
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border">
        <div className="relative overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 text-center">
                  <Checkbox 
                    checked={allSelected} 
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                {headers.map((header, index) => (
                  <TableHead key={index}>{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((row, rowIndex) => (
                  <TableRow key={rowIndex} className={selectedRows[rowIndex] ? 'bg-primary/5' : ''}>
                    <TableCell className="text-center">
                      <Checkbox 
                        checked={selectedRows[rowIndex] || false}
                        onCheckedChange={() => toggleRowSelection(rowIndex)}
                      />
                    </TableCell>
                    {headers.map((header, cellIndex) => (
                      <TableCell key={cellIndex}>{row[header] || '-'}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={headers.length + 1} className="h-24 text-center">
                    Aucun résultat trouvé.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {filteredData.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            {filteredData.length} résultats sur {data.length} {data.length > 1 ? 'adhérents' : 'adhérent'}
          </p>
          
          <div className="flex gap-2">
            <Button 
              onClick={handleGeneratePdf}
              disabled={selectedCount === 0}
              className="flex-shrink-0"
            >
              <FileText className="mr-2 h-4 w-4" />
              Générer PDF ({selectedCount})
            </Button>
            <Button 
              variant="outline"
              onClick={handleSendEmail}
              disabled={selectedCount === 0}
              className="flex-shrink-0"
            >
              <Mail className="mr-2 h-4 w-4" />
              Envoyer par email
            </Button>
            <Button 
              variant="outline"
              onClick={handleExportCsv}
              disabled={selectedCount === 0}
              className="flex-shrink-0"
            >
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
