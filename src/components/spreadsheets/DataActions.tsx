
import React from 'react';
import { FileText, Mail, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DataActionsProps {
  data: any[];
  onGeneratePdf: (data: any[]) => void;
  onSendEmail: (data: any[]) => void;
  onExport: () => void;
  isProcessing?: boolean;
}

const DataActions: React.FC<DataActionsProps> = ({ 
  data, 
  onGeneratePdf, 
  onSendEmail, 
  onExport,
  isProcessing = false
}) => {
  if (data.length === 0) return null;
  
  return (
    <div className="mb-4 flex space-x-2">
      <Button onClick={() => onGeneratePdf(data)}>
        <FileText className="mr-2 h-4 w-4" />
        Générer des PDF
      </Button>
      <Button onClick={() => onSendEmail(data)}>
        <Mail className="mr-2 h-4 w-4" />
        Envoyer par email
      </Button>
      <Button 
        variant="outline" 
        onClick={onExport} 
        disabled={isProcessing}
      >
        <Download className="mr-2 h-4 w-4" />
        {isProcessing ? 'Exportation...' : 'Exporter'}
      </Button>
    </div>
  );
};

export default DataActions;
