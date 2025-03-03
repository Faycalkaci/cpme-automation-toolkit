
import React, { useState, useRef } from 'react';
import { Upload, FileUp, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import FileDropzone from './FileDropzone';
import { processCSVFile, processExcelFile, validateFile } from '@/utils/fileProcessingUtils';
import { errorHandler, ErrorType } from '@/services/errorHandler';

interface FileUploaderProps {
  onFileUploaded: (data: any[], headers: string[]) => void;
  requiredHeaders?: string[];
  maxFileSizeMB?: number;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onFileUploaded,
  requiredHeaders = ["SOCIETE", "N° adh", "Cotisation", "DATE ECHEANCE", "Adresse", "ville", "E MAIL 1"],
  maxFileSizeMB = 10
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileSelected = (files: FileList | null) => {
    if (!files || files.length === 0) {
      return;
    }
    
    const file = files[0];
    processFile(file);
  };
  
  const processFile = (file: File) => {
    setIsUploading(true);
    setError(null);
    
    try {
      // Validate file size and type
      const maxFileSize = maxFileSizeMB * 1024 * 1024; // Convert MB to bytes
      const allowedFileTypes = ['.csv', '.xlsx', '.xls'];
      
      if (!validateFile(file, allowedFileTypes, maxFileSize, setError)) {
        setIsUploading(false);
        return;
      }
      
      // Process based on file type
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      if (fileExtension === 'csv') {
        processCSVFile(
          file, 
          requiredHeaders, 
          handleProcessSuccess, 
          handleProcessError
        );
      } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        processExcelFile(
          file, 
          requiredHeaders, 
          handleProcessSuccess, 
          handleProcessError
        );
      } else {
        handleProcessError("Type de fichier non pris en charge");
      }
    } catch (error) {
      errorHandler.handleError(error, {
        type: ErrorType.FILE_ERROR,
        message: "Erreur lors du traitement du fichier"
      });
      handleProcessError("Une erreur inattendue s'est produite");
    }
  };
  
  const handleProcessSuccess = (data: any[], headers: string[]) => {
    setIsUploading(false);
    onFileUploaded(data, headers);
  };
  
  const handleProcessError = (errorMessage: string) => {
    setIsUploading(false);
    setError(errorMessage);
  };
  
  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <div className="space-y-4">
      <FileDropzone 
        isUploading={isUploading}
        onFilesDropped={handleFileSelected}
      >
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={(e) => handleFileSelected(e.target.files)}
          accept=".csv,.xlsx,.xls"
          aria-label="Sélectionnez un fichier Excel ou CSV"
        />
        
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-2 text-sm font-medium text-slate-900">
            Glissez-déposez votre fichier ici
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Fichiers Excel ou CSV (max. {maxFileSizeMB}MB)
          </p>
          <div className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleBrowseClick}
              disabled={isUploading}
            >
              <FileUp className="mr-2 h-4 w-4" />
              Parcourir les fichiers
            </Button>
          </div>
        </div>
      </FileDropzone>
      
      {error && (
        <div className="p-4 rounded-md bg-red-50 border border-red-100">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <div className="text-sm text-red-700">{error}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
