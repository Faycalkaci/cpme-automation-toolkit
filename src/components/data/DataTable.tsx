
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Download, FileText, Mail, Filter, X, CheckSquare, Square } from 'lucide-react';
import { toast } from 'sonner';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

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
  
  // Update filtered data when data or search term changes
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
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Toggle row selection
  const toggleRowSelection = (index: number) => {
    setSelectedRows(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };
  
  // Toggle select all rows
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
  
  // Count selected rows
  const selectedCount = Object.values(selectedRows).filter(Boolean).length;
  
  // Get selected rows data
  const getSelectedRowsData = () => {
    return filteredData.filter((_, index) => selectedRows[index]);
  };
  
  // Handle generate PDF button click
  const handleGeneratePdf = () => {
    const selectedData = getSelectedRowsData();
    if (selectedData.length === 0) {
      toast.error("Sélection vide", { 
        description: "Veuillez sélectionner au moins une ligne pour générer un PDF." 
      });
      return;
    }
    onGeneratePdf(selectedData);
  };
  
  // Handle send email button click
  const handleSendEmail = () => {
    const selectedData = getSelectedRowsData();
    if (selectedData.length === 0) {
      toast.error("Sélection vide", { 
        description: "Veuillez sélectionner au moins une ligne pour envoyer un email." 
      });
      return;
    }
    onSendEmail(selectedData);
  };
  
  // Handle export to CSV
  const handleExportCsv = () => {
    const selectedData = getSelectedRowsData();
    if (selectedData.length === 0) {
      toast.error("Sélection vide", { 
        description: "Veuillez sélectionner au moins une ligne pour exporter." 
      });
      return;
    }
    
    // Simple CSV export
    const csvContent = [
      headers.join(','),
      ...selectedData.map(row => 
        headers.map(header => {
          const value = row[header] || '';
          // Escape commas and quotes
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
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline"
                disabled={selectedCount === 0}
                className="flex-shrink-0"
              >
                <Filter className="mr-2 h-4 w-4" />
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleGeneratePdf}>
                <FileText className="mr-2 h-4 w-4" />
                Générer des PDF ({selectedCount})
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSendEmail}>
                <Mail className="mr-2 h-4 w-4" />
                Envoyer par email ({selectedCount})
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportCsv}>
                <Download className="mr-2 h-4 w-4" />
                Exporter ({selectedCount})
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
