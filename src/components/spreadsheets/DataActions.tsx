
import React from 'react';
import { Download } from 'lucide-react';

interface DataActionsProps {
  data: any[];
  onGeneratePdf: (data: any[]) => void;
  onSendEmail: (data: any[]) => void;
  onExport: () => void;
  isProcessing?: boolean;
}

const DataActions: React.FC<DataActionsProps> = ({ 
  data, 
  onExport,
  isProcessing = false
}) => {
  if (data.length === 0) return null;
  
  return (
    <div className="mb-4 flex space-x-2">
      {/* Buttons have been removed as requested */}
    </div>
  );
};

export default DataActions;
