
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { DEFAULT_FIELD_MAPPINGS } from '@/services/pdfMappingService';
import FileDropzone from './FileDropzone';
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
    <FileDropzone
      isDragActive={isDragActive}
      isDragReject={isDragReject}
      isLoading={isLoading}
      maxFileSize={maxFileSize}
      requiredHeaders={requiredHeaders}
      getRootProps={getRootProps}
      getInputProps={getInputProps}
    />
  );
};

export default FileUploader;
