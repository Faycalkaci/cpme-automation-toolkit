
import React from 'react';
import { Table } from '@/components/ui/table';
import { DataTableProvider } from './DataTableContext';
import TableSearch from './TableSearch';
import TableSelectionControls from './TableSelectionControls';
import TableActions from './TableActions';
import TableFooter from './TableFooter';
import DataTableHeader from './DataTableHeader';
import DataTableBody from './DataTableBody';
import { useDataTableOperations } from './DataTableOperations';
import { useDataTable } from './DataTableContext';

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
  return (
    <DataTableProvider
      data={data}
      headers={headers}
      onGeneratePdf={onGeneratePdf}
      onSendEmail={onSendEmail}
    >
      <DataTableContent />
    </DataTableProvider>
  );
};

const DataTableContent: React.FC = () => {
  return (
    <div className="space-y-4">
      <DataTableControls />
      
      <div className="rounded-md border">
        <div className="relative overflow-x-auto">
          <Table>
            <DataTableHeader />
            <DataTableBody />
          </Table>
        </div>
      </div>
      
      <DataTableFooter />
    </div>
  );
};

const DataTableControls: React.FC = () => {
  const { 
    searchTerm, 
    setSearchTerm, 
    allSelected, 
    toggleSelectAll,
    selectedCount
  } = useDataTable();
  
  const operations = useDataTableOperations();
  const { handleGeneratePdf, handleSendEmail, handleExportCsv } = operations;
  
  return (
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
  );
};

const DataTableFooter: React.FC = () => {
  const { 
    data, 
    filteredData, 
    selectedCount 
  } = useDataTable();
  
  const operations = useDataTableOperations();
  const { handleGeneratePdf, handleSendEmail, handleExportCsv } = operations;
  
  if (filteredData.length === 0) {
    return null;
  }
  
  return (
    <TableFooter 
      totalCount={data.length}
      filteredCount={filteredData.length}
      selectedCount={selectedCount}
      onGeneratePdf={handleGeneratePdf}
      onSendEmail={handleSendEmail}
      onExportCsv={handleExportCsv}
    />
  );
};

export default DataTable;
