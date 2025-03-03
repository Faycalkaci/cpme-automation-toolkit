
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { FileText, Download, Eye } from 'lucide-react';
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
  const [docPreviewHtml, setDocPreviewHtml] = useState<string | null>(null);
  
  useEffect(() => {
    // Pour les fichiers Word, convertir en HTML pour la prévisualisation
    const convertDocToHtml = async () => {
      if (!templateToPreview || !templateToPreview.file || 
          (templateToPreview.documentType !== 'doc' && templateToPreview.documentType !== 'docx')) {
        return;
      }
      
      try {
        const mammoth = (await import('mammoth')).default;
        const arrayBuffer = await templateToPreview.file.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        setDocPreviewHtml(result.value);
      } catch (error) {
        console.error('Erreur lors de la conversion du document Word:', error);
        setDocPreviewHtml('<div class="p-4">Erreur lors de la prévisualisation du document Word</div>');
      }
    };
    
    if (open && templateToPreview) {
      if (templateToPreview.documentType === 'doc' || templateToPreview.documentType === 'docx') {
        convertDocToHtml();
      } else {
        setDocPreviewHtml(null);
      }
    } else {
      setDocPreviewHtml(null);
    }
  }, [open, templateToPreview]);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Aperçu du modèle</DialogTitle>
        </DialogHeader>
        
        {templateToPreview && (
          <div className="py-4">
            {/* Prévisualisation PDF */}
            {templateToPreview.documentType === 'pdf' && templateToPreview.fileUrl && (
              <iframe 
                src={templateToPreview.fileUrl} 
                className="w-full h-[70vh] border rounded"
                title={`Aperçu de ${templateToPreview.name}`}
              />
            )}
            
            {/* Prévisualisation DOC/DOCX */}
            {(templateToPreview.documentType === 'doc' || templateToPreview.documentType === 'docx') && (
              docPreviewHtml ? (
                <div 
                  className="w-full h-[70vh] border rounded bg-white p-4 overflow-auto"
                  dangerouslySetInnerHTML={{ __html: docPreviewHtml }}
                />
              ) : (
                <div className="aspect-[3/4] bg-slate-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="h-12 w-12 text-slate-400 mx-auto" />
                    <p className="mt-4 text-slate-600">
                      Chargement de l'aperçu du document Word...
                    </p>
                  </div>
                </div>
              )
            )}
            
            {/* Fallback pour les fichiers non prévisualisables */}
            {!templateToPreview.fileUrl && !docPreviewHtml && (
              <div className="aspect-[3/4] bg-slate-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <FileText className="h-12 w-12 text-slate-400 mx-auto" />
                  <p className="mt-4 text-slate-600">
                    Aperçu non disponible
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
        
        <DialogFooter className="flex justify-between">
          {templateToPreview && templateToPreview.fileUrl && (
            <Button variant="outline" onClick={() => window.open(templateToPreview.fileUrl, '_blank')}>
              <Download className="h-4 w-4 mr-2" />
              Télécharger
            </Button>
          )}
          <Button onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewDialog;
