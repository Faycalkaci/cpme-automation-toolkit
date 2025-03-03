
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Mail, Download } from 'lucide-react';

interface TableActionsProps {
  selectedCount: number;
  onGeneratePdf: () => void;
  onSendEmail: () => void;
  onExportCsv: () => void;
}

const TableActions: React.FC<TableActionsProps> = ({
  selectedCount,
  onGeneratePdf,
  onSendEmail,
  onExportCsv
}) => {
  return (
    <div className="flex gap-2">
      <Button 
        onClick={onGeneratePdf}
        disabled={selectedCount === 0}
        className="flex-shrink-0"
      >
        <FileText className="mr-2 h-4 w-4" />
        Générer PDF {selectedCount > 0 && `(${selectedCount})`}
      </Button>
      
      <Button 
        onClick={onSendEmail}
        disabled={selectedCount === 0}
        className="flex-shrink-0"
        variant="outline"
      >
        <Mail className="mr-2 h-4 w-4" />
        Envoyer email
      </Button>
      
      <Button 
        onClick={onExportCsv}
        disabled={selectedCount === 0}
        className="flex-shrink-0"
        variant="outline"
      >
        <Download className="mr-2 h-4 w-4" />
        Exporter
      </Button>
    </div>
  );
};

export default TableActions;
