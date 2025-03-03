
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useDataTable } from './DataTableContext';

const DataTableHeader: React.FC = () => {
  const { headers } = useDataTable();
  
  return (
    <TableHeader>
      <TableRow className="bg-primary/20">
        <TableHead className="w-12 text-center font-semibold sticky left-0 z-10 bg-primary/20">
          {/* Empty header cell for checkbox column */}
        </TableHead>
        {headers.map((header, index) => (
          <TableHead 
            key={index} 
            className="font-semibold text-slate-800 whitespace-nowrap py-3"
          >
            {header}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
};

export default DataTableHeader;
