
import React from 'react';
import { TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDataTable } from './DataTableContext';
import '../../styles/scrollbar.css';

const DataTableBody: React.FC = () => {
  const { 
    filteredData, 
    headers, 
    selectedRows, 
    toggleRowSelection 
  } = useDataTable();

  return (
    <TableBody>
      {filteredData.length > 0 ? (
        <div className="relative" style={{ maxHeight: '500px', overflowY: 'auto' }}>
          {filteredData.map((row, rowIndex) => (
            <TableRow key={rowIndex} className={selectedRows[rowIndex] ? 'bg-primary/5' : ''}>
              <TableCell className="text-center sticky left-0 bg-white">
                <Checkbox 
                  checked={selectedRows[rowIndex] || false}
                  onCheckedChange={() => toggleRowSelection(rowIndex)}
                />
              </TableCell>
              {headers.map((header, cellIndex) => (
                <TableCell key={cellIndex}>{row[header] || '-'}</TableCell>
              ))}
            </TableRow>
          ))}
        </div>
      ) : (
        <TableRow>
          <TableCell colSpan={headers.length + 1} className="h-24 text-center">
            Aucun résultat trouvé.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
};

export default DataTableBody;
