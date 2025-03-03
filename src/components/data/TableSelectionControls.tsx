
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckSquare, Square } from 'lucide-react';

interface TableSelectionControlsProps {
  allSelected: boolean;
  toggleSelectAll: () => void;
}

const TableSelectionControls: React.FC<TableSelectionControlsProps> = ({ 
  allSelected, 
  toggleSelectAll 
}) => {
  return (
    <Button 
      variant="outline" 
      onClick={toggleSelectAll}
      className="flex-shrink-0"
    >
      {allSelected ? <CheckSquare className="mr-2 h-4 w-4" /> : <Square className="mr-2 h-4 w-4" />}
      {allSelected ? 'Désélectionner tout' : 'Sélectionner tout'}
    </Button>
  );
};

export default TableSelectionControls;
