
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TemplateFileDropzoneProps {
  file?: File;
  onFileChange: (file?: File) => void;
  previewUrl?: string;
}

const TemplateFileDropzone: React.FC<TemplateFileDropzoneProps> = ({
  file,
  onFileChange,
  previewUrl
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        onFileChange(file);
      }
    }
  });

  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        Fichier PDF
      </label>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-primary/50'
        }`}
      >
        <input {...getInputProps()} />
        
        {file ? (
          <div className="flex items-center justify-center space-x-2">
            <FileText className="h-6 w-6 text-primary" />
            <span className="font-medium">{file.name}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="ml-2 h-7 w-7 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onFileChange(undefined);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div>
            <Upload className="h-8 w-8 mx-auto text-slate-400 mb-2" />
            <p className="text-sm">
              Glissez-déposez votre fichier PDF ici ou cliquez pour le sélectionner
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Format accepté: PDF
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateFileDropzone;
