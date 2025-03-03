
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { FileText, File, Download } from 'lucide-react';
import { Template } from './types';
import { documentProcessingService } from '@/services/documentProcessingService';
import mammoth from 'mammoth';
import { saveAs } from 'file-saver';
import { toast } from 'sonner';

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
  const [docContent, setDocContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (open && templateToPreview && templateToPreview.file && 
        (templateToPreview.documentType === 'doc' || templateToPreview.documentType === 'docx')) {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e.target?.result) {
          try {
            const result = await mammoth.convertToHtml({ arrayBuffer: e.target.result as ArrayBuffer });
            setDocContent(result.value);
          } catch (error) {
            console.error('Error converting DOC to HTML:', error);
            toast.error('Erreur lors de la conversion du document Word');
            setDocContent('<p>Erreur lors de la conversion du document.</p>');
          } finally {
            setIsLoading(false);
          }
        }
      };
      reader.readAsArrayBuffer(templateToPreview.file);
    }
  }, [open, templateToPreview]);

  const handleDownload = () => {
    if (templateToPreview && templateToPreview.file) {
      saveAs(templateToPreview.file, templateToPreview.name + 
        (templateToPreview.documentType === 'pdf' ? '.pdf' : 
         templateToPreview.documentType === 'doc' ? '.doc' : '.docx'));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {templateToPreview?.documentType === 'pdf' ? (
              <FileText className="h-5 w-5 mr-2" />
            ) : (
              <File className="h-5 w-5 mr-2" />
            )}
            Aperçu du modèle
          </DialogTitle>
        </DialogHeader>
        
        {templateToPreview && (
          <div className="py-4">
            {templateToPreview.documentType === 'pdf' && templateToPreview.file ? (
              <iframe 
                src={templateToPreview.fileUrl} 
                className="w-full h-[70vh] border rounded"
                title={`Aperçu de ${templateToPreview.name}`}
              />
            ) : templateToPreview.documentType === 'doc' || templateToPreview.documentType === 'docx' ? (
              isLoading ? (
                <div className="h-[70vh] flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="w-full h-[70vh] border rounded overflow-auto bg-white p-6">
                  <div 
                    className="doc-preview" 
                    dangerouslySetInnerHTML={{ __html: docContent }} 
                  />
                </div>
              )
            ) : (
              <div className="aspect-[3/4] bg-slate-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  {templateToPreview.documentType === 'pdf' ? (
                    <FileText className="h-12 w-12 text-slate-400 mx-auto" />
                  ) : (
                    <File className="h-12 w-12 text-slate-400 mx-auto" />
                  )}
                  <p className="mt-4 text-slate-600">
                    Aperçu non disponible
                  </p>
                </div>
              </div>
            )}
            
            <div className="mt-6">
              <h3 className="font-medium mb-2">Champs à mapper :</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
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
        
        <DialogFooter className="flex justify-between items-center">
          <Button 
            variant="outline"
            onClick={handleDownload}
            disabled={!templateToPreview?.file}
          >
            <Download className="h-4 w-4 mr-2" />
            Télécharger
          </Button>
          <Button onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewDialog;
