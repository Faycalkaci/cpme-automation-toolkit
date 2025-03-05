
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Template } from './types';

interface TemplateActionsProps {
  templates: Template[];
  onDeleteAll: () => void;
}

const TemplateActions: React.FC<TemplateActionsProps> = ({ templates, onDeleteAll }) => {
  return (
    <div className="flex items-center gap-2 justify-end">
      {templates.length > 0 && (
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={onDeleteAll}
          className="flex items-center gap-1"
        >
          <Trash2 className="h-4 w-4" />
          Supprimer tous
        </Button>
      )}
    </div>
  );
};

export default TemplateActions;
