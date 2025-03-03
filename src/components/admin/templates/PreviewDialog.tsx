
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { FileText } from 'lucide-react';
import { Template } from './types';

interface PreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templateToPreview: Template | null;
}

const PreviewDialog: React.FC<PreviewDialogProps> = ({
  open,
  onOpenChange,
  templateToPreview,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Aperçu du modèle</DialogTitle>
        </DialogHeader>
        
        {templateToPreview && (
          <div className="py-4">
            {templateToPreview.file ? (
              <iframe 
                src={templateToPreview.fileUrl} 
                className="w-full h-[70vh] border rounded"
                title={`Aperçu de ${templateToPreview.name}`}
              />
            ) : (
              <div className="aspect-[3/4] bg-slate-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <FileText className="h-12 w-12 text-slate-400 mx-auto" />
                  <p className="mt-4 text-slate-600">
                    Aperçu non disponible en mode démo
                  </p>
                </div>
              </div>
            )}
            
            <div className="mt-4">
              <h3 className="font-medium">Champs à mapper :</h3>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {templateToPreview.fields.map((field, idx) => (
                  <div key={idx} className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                    <span className="text-sm">{field}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewDialog;
