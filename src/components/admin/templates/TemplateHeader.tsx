
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileUp } from 'lucide-react';

interface TemplateHeaderProps {
  onAddTemplate?: () => void;
}

const TemplateHeader: React.FC<TemplateHeaderProps> = ({ onAddTemplate }) => {
  return (
    <div className="flex items-center justify-between w-full">
      <h2 className="text-2xl font-bold">Gestion des modèles PDF</h2>
      {onAddTemplate && (
        <Button onClick={onAddTemplate} className="flex items-center gap-1">
          <FileUp className="h-4 w-4" />
          Ajouter un modèle
        </Button>
      )}
    </div>
  );
};

export default TemplateHeader;
