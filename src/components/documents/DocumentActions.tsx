
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Mail, Trash2 } from 'lucide-react';

interface DocumentActionsProps {
  selectedDocsCount: number;
  onBulkDownload: () => void;
  onBulkEmail: () => void;
  onBulkDelete: () => void;
}

const DocumentActions: React.FC<DocumentActionsProps> = ({
  selectedDocsCount,
  onBulkDownload,
  onBulkEmail,
  onBulkDelete
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onBulkDownload}
        disabled={selectedDocsCount === 0}
        className="flex items-center"
      >
        <Download className="h-4 w-4 mr-2" />
        Télécharger
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onBulkEmail}
        disabled={selectedDocsCount === 0}
        className="flex items-center"
      >
        <Mail className="h-4 w-4 mr-2" />
        Envoyer
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onBulkDelete}
        disabled={selectedDocsCount === 0}
        className="flex items-center text-red-500 hover:text-red-600"
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Supprimer
      </Button>
    </div>
  );
};

export default DocumentActions;
