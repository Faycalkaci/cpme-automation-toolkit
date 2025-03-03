
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Mail, Download } from 'lucide-react';

interface TableFooterProps {
  totalCount: number;
  filteredCount: number;
  selectedCount: number;
  onGeneratePdf: () => void;
  onSendEmail: () => void;
  onExportCsv: () => void;
}

const TableFooter: React.FC<TableFooterProps> = ({
  totalCount,
  filteredCount,
  selectedCount,
  onGeneratePdf,
  onSendEmail,
  onExportCsv
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <p className="text-sm text-slate-500">
        {filteredCount} résultats sur {totalCount} {totalCount > 1 ? 'adhérents' : 'adhérent'}
      </p>
      
      <div className="flex gap-2">
        <Button 
          onClick={onGeneratePdf}
          disabled={selectedCount === 0}
          className="flex-shrink-0"
        >
          <FileText className="mr-2 h-4 w-4" />
          Générer PDF ({selectedCount})
        </Button>
        <Button 
          variant="outline"
          onClick={onSendEmail}
          disabled={selectedCount === 0}
          className="flex-shrink-0"
        >
          <Mail className="mr-2 h-4 w-4" />
          Envoyer par email
        </Button>
        <Button 
          variant="outline"
          onClick={onExportCsv}
          disabled={selectedCount === 0}
          className="flex-shrink-0"
        >
          <Download className="mr-2 h-4 w-4" />
          Exporter
        </Button>
      </div>
    </div>
  );
};

export default TableFooter;
