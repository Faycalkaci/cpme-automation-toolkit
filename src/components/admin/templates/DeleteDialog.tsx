
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Template } from './types';

interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templateToDelete: Template | null;
  handleDeleteTemplate: () => void;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({
  open,
  onOpenChange,
  templateToDelete,
  handleDeleteTemplate,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmer la suppression</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer ce modèle ? Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>
        
        {templateToDelete && (
          <div className="py-4">
            <p className="font-medium">{templateToDelete.name}</p>
            <p className="text-sm text-slate-500">
              Type: {templateToDelete.type === 'facture' ? 'Facture' : 
                    templateToDelete.type === 'appel' ? 'Appel de cotisation' :
                    templateToDelete.type === 'rappel' ? 'Rappel de cotisation' : 'Autre'}
            </p>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button variant="destructive" onClick={handleDeleteTemplate}>
            Supprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;
