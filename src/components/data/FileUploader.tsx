
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { DEFAULT_FIELD_MAPPINGS } from '@/services/pdfMappingService';
import { 
  processCSVFile, 
  processExcelFile, 
  validateFile 
} from '@/utils/fileProcessingUtils';

interface FileUploaderProps {
  onFileUploaded: (data: any[], headers: string[]) => void;
  allowedFileTypes?: string[];
  maxFileSize?: number;
  onError?: (error: string) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ 
  onFileUploaded,
  allowedFileTypes = ['.csv', '.xlsx', '.xls'],
  maxFileSize = 10 * 1024 * 1024, // 10MB default limit
  onError
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  
  // Get the required field names from DEFAULT_FIELD_MAPPINGS
  const requiredHeaders = DEFAULT_FIELD_MAPPINGS.map(field => field.name);
  
  const handleFileProcessing = useCallback((file: File) => {
    if (!validateFile(file, allowedFileTypes, maxFileSize, onError)) {
      return;
    }
    
    setIsLoading(true);
    
    const handleProcessingComplete = (data: any[], headers: string[]) => {
      onFileUploaded(data, headers);
      setIsLoading(false);
    };
    
    if (file.name.endsWith('.csv')) {
      processCSVFile(
        file, 
        requiredHeaders, 
        handleProcessingComplete, 
        (error) => {
          onError?.(error);
          setIsLoading(false);
        }
      );
    } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      processExcelFile(
        file, 
        requiredHeaders, 
        handleProcessingComplete, 
        (error) => {
          onError?.(error);
          setIsLoading(false);
        }
      );
    }
  }, [onFileUploaded, allowedFileTypes, maxFileSize, onError, requiredHeaders]);
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setIsDragActive(false);
    
    if (acceptedFiles.length === 0) {
      const errorMsg = "Veuillez importer un fichier Excel (.xlsx, .xls) ou CSV.";
      onError?.(errorMsg);
      return;
    }
    
    const file = acceptedFiles[0];
    handleFileProcessing(file);
    
  }, [handleFileProcessing, onError]);
  
  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    maxFiles: 1,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false)
  });
  
  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors 
        ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300'}
        ${isDragReject ? 'border-red-500 bg-red-50' : ''}
        ${isLoading ? 'opacity-60 pointer-events-none' : ''}
      `}
    >
      <input {...getInputProps()} />
      
      {isLoading ? (
        <div className="py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600">Analyse du fichier en cours...</p>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <div className="mx-auto bg-gray-100 rounded-full p-3 w-12 h-12 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
          </div>
          
          <p className="text-base">
            <span className="font-medium">Cliquez pour parcourir</span> ou glissez-déposez
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Formats supportés: CSV, Excel (.xlsx, .xls)
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Taille maximale: {Math.round(maxFileSize / 1024 / 1024)} Mo
          </p>
        </>
      )}
    </div>
  );
};

export default FileUploader;
