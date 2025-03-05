
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileUp } from 'lucide-react';

interface TemplateHeaderProps {
  onAddTemplate?: () => void;
}

const TemplateHeader: React.FC<TemplateHeaderProps> = ({ onAddTemplate }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold">Gestion des modèles PDF</h2>
    </div>
  );
};

export default TemplateHeader;
