
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Trash2, AlertTriangle } from 'lucide-react';
import { Template } from './types';

interface DeleteAllDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isDeleting: boolean;
  templates: Template[];
  onDeleteAll: () => Promise<void>;
}

const DeleteAllDialog: React.FC<DeleteAllDialogProps> = ({
  open,
  onOpenChange,
  isDeleting,
  templates,
  onDeleteAll
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Supprimer tous les modèles
          </DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer tous les modèles ? Cette action est irréversible et supprimera
            également les modèles archivés et permanents.
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-destructive/10 p-4 rounded-md border border-destructive/30 my-2">
          <p className="text-sm text-destructive">
            <strong>Attention :</strong> Cette action va supprimer {templates.length} modèles, y compris les modèles utilisés
            pour la génération de documents. Assurez-vous d'avoir une sauvegarde si nécessaire.
          </p>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Annuler
          </Button>
          <Button 
            variant="destructive" 
            onClick={onDeleteAll}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Suppression...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Tout supprimer
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAllDialog;
