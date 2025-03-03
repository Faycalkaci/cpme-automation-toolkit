
import React from 'react';
import { Table } from '@/components/ui/table';
import { DataTableProvider } from './DataTableContext';
import TableSearch from './TableSearch';
import TableSelectionControls from './TableSelectionControls';
import TableActions from './TableActions';
import TableFooter from './TableFooter';
import DataTableHeader from './DataTableHeader';
import DataTableBody from './DataTableBody';
import DataTableOperations from './DataTableOperations';

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
  const useOperations = DataTableOperations();
  
  return (
    <div className="space-y-4">
      <DataTableControls useOperations={useOperations} />
      
      <div className="rounded-md border">
        <div className="relative overflow-x-auto">
          <Table>
            <DataTableHeader />
            <DataTableBody />
          </Table>
        </div>
      </div>
      
      <DataTableFooter useOperations={useOperations} />
    </div>
  );
};

const DataTableControls: React.FC<{ useOperations: any }> = ({ useOperations }) => {
  const { 
    searchTerm, 
    setSearchTerm, 
    allSelected, 
    toggleSelectAll,
    selectedCount
  } = useDataTable();
  
  const { handleGeneratePdf, handleSendEmail, handleExportCsv } = useOperations;
  
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

const DataTableFooter: React.FC<{ useOperations: any }> = ({ useOperations }) => {
  const { 
    data, 
    filteredData, 
    selectedCount 
  } = useDataTable();
  
  const { handleGeneratePdf, handleSendEmail, handleExportCsv } = useOperations;
  
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
