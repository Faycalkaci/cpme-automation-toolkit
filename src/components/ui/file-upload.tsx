
import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Upload, File, X, Check, AlertCircle } from 'lucide-react';
import { Spinner } from './spinner';

interface FileUploadProps extends React.HTMLAttributes<HTMLDivElement> {
  accept?: string;
  maxSize?: number; // in MB
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
  error?: string;
  success?: boolean;
}

export const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(
  ({ className, accept, maxSize = 5, onFileSelect, isLoading, error, success, ...props }, ref) => {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      
      const droppedFile = e.dataTransfer.files[0];
      handleFile(droppedFile);
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        handleFile(selectedFile);
      }
    };

    const handleFile = (selectedFile: File) => {
      // Check file type
      if (accept && !accept.split(',').some(type => selectedFile.type.match(type))) {
        alert(`Type de fichier non accepté. Veuillez sélectionner un fichier ${accept}`);
        return;
      }
      
      // Check file size
      if (selectedFile.size > maxSize * 1024 * 1024) {
        alert(`Fichier trop volumineux. La taille maximale est de ${maxSize}MB`);
        return;
      }
      
      setFile(selectedFile);
      onFileSelect(selectedFile);
    };

    const handleRemoveFile = () => {
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    const handleClick = () => {
      fileInputRef.current?.click();
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg transition-all',
          isDragging ? 'border-primary bg-primary/5' : 'border-slate-200 bg-slate-50/50',
          error ? 'border-destructive/50 bg-destructive/5' : '',
          success ? 'border-green-500/50 bg-green-50' : '',
          className
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        {...props}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-4">
            <Spinner className="w-10 h-10 text-primary" />
            <p className="mt-2 text-sm text-slate-600">Traitement en cours...</p>
          </div>
        ) : file ? (
          <div className="w-full">
            <div className="flex items-center p-3 bg-white rounded border border-slate-200 mb-2">
              <File className="w-5 h-5 text-slate-500 mr-2" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 truncate">{file.name}</p>
                <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile();
                }}
                className="p-1 rounded-full hover:bg-slate-100"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>
            
            {error ? (
              <div className="flex items-center text-destructive text-sm mt-2">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span>{error}</span>
              </div>
            ) : success ? (
              <div className="flex items-center text-green-600 text-sm mt-2">
                <Check className="w-4 h-4 mr-1" />
                <span>Fichier chargé avec succès</span>
              </div>
            ) : null}
          </div>
        ) : (
          <>
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 mb-4">
              <Upload className="w-6 h-6 text-primary" />
            </div>
            <p className="text-sm font-medium text-center mb-1">
              <span className="text-primary">Cliquez pour télécharger</span> ou glissez-déposez
            </p>
            <p className="text-xs text-slate-500 text-center">
              {accept ? `${accept.split(',').join(', ')} • ` : ''}Max {maxSize}MB
            </p>
            
            {error && (
              <div className="flex items-center text-destructive text-sm mt-4">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span>{error}</span>
              </div>
            )}
          </>
        )}
      </div>
    );
  }
);

FileUpload.displayName = 'FileUpload';
