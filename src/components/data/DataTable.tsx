
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

// Import refactored components
import TableSearch from './TableSearch';
import TableSelectionControls from './TableSelectionControls';
import TableActions from './TableActions';
import TableFooter from './TableFooter';

// Import utility functions
import { generateAndDownloadPdf, validateRequiredFields } from '@/utils/pdfUtils';
import { getValidEmailsFromData, displayEmailResults, displayEmailAddresses } from '@/utils/emailUtils';
import { exportToCsv } from '@/utils/exportUtils';

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
    
    const hasMissingFields = validateRequiredFields(selectedData);
    
    if (hasMissingFields) {
      toast.warning("Données incomplètes", { 
        description: "Certaines lignes sélectionnées n'ont pas toutes les données requises (SOCIETE, N° adh, Cotisation)." 
      });
    }
    
    onGeneratePdf(selectedData);
    generateAndDownloadPdf(selectedData, headers);
  };
  
  const handleSendEmail = () => {
    const selectedData = getSelectedRowsData();
    if (selectedData.length === 0) {
      toast.error("Sélection vide", { 
        description: "Veuillez sélectionner au moins une ligne pour envoyer un email." 
      });
      return;
    }
    
    const emailData = getValidEmailsFromData(selectedData);
    const isValid = displayEmailResults(emailData);
    
    if (!isValid) return;
    
    onSendEmail(selectedData);
    
    const allValidEmails = emailData.emailsByRow.flatMap(item => item.emails);
    displayEmailAddresses(allValidEmails);
  };
  
  const handleExportCsv = () => {
    const selectedData = getSelectedRowsData();
    exportToCsv(selectedData, headers);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <TableSearch 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
        />
        
        <div className="flex gap-2">
          <TableSelectionControls 
            allSelected={allSelected} 
            toggleSelectAll={toggleSelectAll}
          />
          
          <TableActions 
            selectedCount={selectedCount}
            onGeneratePdf={handleGeneratePdf}
            onSendEmail={handleSendEmail}
            onExportCsv={handleExportCsv}
          />
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
        <TableFooter 
          totalCount={data.length}
          filteredCount={filteredData.length}
          selectedCount={selectedCount}
          onGeneratePdf={handleGeneratePdf}
          onSendEmail={handleSendEmail}
          onExportCsv={handleExportCsv}
        />
      )}
    </div>
  );
};

export default DataTable;
