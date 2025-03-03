
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface EmailActionsProps {
  selectedEmailsCount: number;
  totalEmailCount: number;
  bulkDelete: () => void;
}

const EmailActions: React.FC<EmailActionsProps> = ({ 
  selectedEmailsCount, 
  totalEmailCount, 
  bulkDelete 
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 className="text-lg font-semibold">Historique des emails</h2>
        <p className="text-sm text-muted-foreground">
          {totalEmailCount} email(s) - {selectedEmailsCount} sélectionné(s)
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={bulkDelete}
          disabled={selectedEmailsCount === 0}
          className="flex items-center text-red-500 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Supprimer
        </Button>
      </div>
    </div>
  );
};

export default EmailActions;
