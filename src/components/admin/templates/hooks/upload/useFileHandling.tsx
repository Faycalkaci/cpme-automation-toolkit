
import { useState } from 'react';
import { toast } from 'sonner';

export const useFileHandling = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateType, setNewTemplateType] = useState<'facture' | 'appel' | 'rappel' | 'autre'>('autre');
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      let documentType: 'pdf' | 'doc' | 'docx' = 'pdf';
      if (file.name.toLowerCase().endsWith('.doc')) {
        documentType = 'doc';
      } else if (file.name.toLowerCase().endsWith('.docx')) {
        documentType = 'docx';
      } else if (!file.name.toLowerCase().endsWith('.pdf')) {
        toast.error('Type de fichier invalide', {
          description: 'Veuillez sélectionner un fichier PDF, DOC ou DOCX.'
        });
        return;
      }
      
      setSelectedFile(file);
      toast.success('Fichier sélectionné', {
        description: `"${file.name}" a été sélectionné.`
      });
      
      updateTemplateTypeFromFilename(file.name);
      updateTemplateNameFromFilename(file.name);
    }
  };
  
  const updateTemplateTypeFromFilename = (filename: string) => {
    if (filename.toLowerCase().includes('appel')) {
      setNewTemplateType('appel');
    } else if (filename.toLowerCase().includes('facture')) {
      setNewTemplateType('facture');
    } else if (filename.toLowerCase().includes('rappel')) {
      setNewTemplateType('rappel');
    }
  };
  
  const updateTemplateNameFromFilename = (filename: string) => {
    const nameWithoutExtension = filename.replace(/\.(pdf|doc|docx)$/i, '');
    setNewTemplateName(nameWithoutExtension);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('border-primary', 'bg-primary/5');
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('border-primary', 'bg-primary/5');
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('border-primary', 'bg-primary/5');
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf' || 
          file.name.toLowerCase().endsWith('.doc') || 
          file.name.toLowerCase().endsWith('.docx')) {
        setSelectedFile(file);
        
        updateTemplateTypeFromFilename(file.name);
        updateTemplateNameFromFilename(file.name);
        
        toast.success('Fichier sélectionné', {
          description: `"${file.name}" a été sélectionné.`
        });
      } else {
        toast.error('Type de fichier invalide', {
          description: 'Veuillez sélectionner un fichier PDF, DOC ou DOCX.'
        });
      }
    }
  };

  return {
    selectedFile,
    setSelectedFile,
    newTemplateName,
    setNewTemplateName,
    newTemplateType,
    setNewTemplateType,
    handleFileSelect,
    handleDragOver,
    handleDragLeave,
    handleDrop
  };
};
