
import React from 'react';
import { TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { useDataTable } from './DataTableContext';
import { ScrollArea } from '@/components/ui/scroll-area';
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
        <ScrollArea className="h-[500px]">
          {filteredData.map((row, rowIndex) => (
            <TableRow 
              key={rowIndex} 
              className={selectedRows[rowIndex] ? 'bg-primary/5' : 'hover:bg-slate-50'}
            >
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
        </ScrollArea>
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
