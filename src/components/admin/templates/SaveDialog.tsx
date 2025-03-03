
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Template } from './types';

interface SaveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templateToSave: Template | null;
  handleSaveTemplatePermanently: () => void;
}

const SaveDialog: React.FC<SaveDialogProps> = ({
  open,
  onOpenChange,
  templateToSave,
  handleSaveTemplatePermanently,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sauvegarder définitivement</DialogTitle>
          <DialogDescription>
            Ce modèle sera disponible pour tous les utilisateurs et ne pourra plus être supprimé facilement.
          </DialogDescription>
        </DialogHeader>
        
        {templateToSave && (
          <div className="py-4">
            <p className="font-medium">{templateToSave.name}</p>
            <p className="text-sm text-slate-500">
              Type: {templateToSave.type === 'facture' ? 'Facture' : 
                    templateToSave.type === 'appel' ? 'Appel de cotisation' :
                    templateToSave.type === 'rappel' ? 'Rappel de cotisation' : 'Autre'}
            </p>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button variant="default" onClick={handleSaveTemplatePermanently}>
            Sauvegarder définitivement
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveDialog;
