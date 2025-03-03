
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileUp } from 'lucide-react';

interface TemplateHeaderProps {
  onAddTemplate: () => void;
}

const TemplateHeader: React.FC<TemplateHeaderProps> = ({ onAddTemplate }) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">Gestion des modèles PDF</h2>
      <Button onClick={onAddTemplate}>
        <FileUp className="mr-2 h-4 w-4" /> Ajouter un modèle
      </Button>
    </div>
  );
};

export default TemplateHeader;
