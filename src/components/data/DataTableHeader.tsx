
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { useDataTable } from './DataTableContext';

const DataTableHeader: React.FC = () => {
  const { headers, allSelected, toggleSelectAll } = useDataTable();
  
  return (
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
  );
};

export default DataTableHeader;
