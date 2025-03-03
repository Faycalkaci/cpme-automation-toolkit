
import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface SuperAdminControlsProps {
  onClearTemplates: () => Promise<void>;
}

const SuperAdminControls: React.FC<SuperAdminControlsProps> = ({ onClearTemplates }) => {
  const handleClearTemplates = async () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer tous les modèles ? Cette action est irréversible.')) {
      await onClearTemplates();
      toast.success('Tous les modèles ont été supprimés');
    }
  };

  return (
    <div className="mt-8 p-4 border rounded-lg bg-slate-50">
      <h2 className="text-lg font-medium mb-2">Contrôles administrateur</h2>
      <div className="flex space-x-2">
        <Button 
          variant="destructive" 
          onClick={handleClearTemplates}
        >
          Supprimer tous les modèles
        </Button>
      </div>
    </div>
  );
};

export default SuperAdminControls;
