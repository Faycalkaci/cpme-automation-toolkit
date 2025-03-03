
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface LicenseHeaderProps {
  onAddLicense: () => void;
}

const LicenseHeader: React.FC<LicenseHeaderProps> = ({ onAddLicense }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold">Gestion des Licences</h2>
      <Button onClick={onAddLicense}>
        <Plus className="mr-2 h-4 w-4" /> Ajouter une licence
      </Button>
    </div>
  );
};

export default LicenseHeader;
