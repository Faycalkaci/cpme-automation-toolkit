
import React from 'react';
import { FileSpreadsheet, Upload, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileDropzoneProps {
  isDragActive: boolean;
  isDragReject: boolean;
  isLoading: boolean;
  maxFileSize: number;
  requiredHeaders: string[];
  getRootProps: () => any;
  getInputProps: () => any;
}

const FileDropzone: React.FC<FileDropzoneProps> = ({
  isDragActive,
  isDragReject,
  isLoading,
  maxFileSize,
  requiredHeaders,
  getRootProps,
  getInputProps
}) => {
  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 transition-colors ${
        isDragActive 
          ? 'border-primary bg-primary/5' 
          : isDragReject 
            ? 'border-destructive bg-destructive/5' 
            : 'border-slate-200 hover:border-primary/50 hover:bg-slate-50'
      }`}
    >
      <input {...getInputProps()} />
      
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-12 w-12 rounded-full border-4 border-t-primary border-slate-200 animate-spin mx-auto" />
            <p className="mt-4 text-slate-700">Traitement en cours...</p>
          </div>
        ) : (
          <>
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
              {isDragReject ? (
                <AlertCircle className="h-8 w-8 text-destructive" />
              ) : (
                <FileSpreadsheet className="h-8 w-8 text-primary" />
              )}
            </div>
            
            <div>
              <p className="text-lg font-medium text-slate-900">
                {isDragActive 
                  ? "Déposez votre fichier ici"
                  : isDragReject
                    ? "Ce type de fichier n'est pas supporté"
                    : "Glissez-déposez votre fichier"
                }
              </p>
              <p className="text-sm text-slate-500 mt-1">
                Formats acceptés: .xlsx, .xls, .csv
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Taille maximale: {Math.round(maxFileSize / (1024 * 1024))}MB
              </p>
            </div>
            
            <Button type="button">
              <Upload className="mr-2 h-4 w-4" />
              Parcourir les fichiers
            </Button>
            
            <RequiredFieldsList requiredHeaders={requiredHeaders} />
          </>
        )}
      </div>
    </div>
  );
};

interface RequiredFieldsListProps {
  requiredHeaders: string[];
}

const RequiredFieldsList: React.FC<RequiredFieldsListProps> = ({ requiredHeaders }) => {
  return (
    <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded w-full max-w-md">
      <p>Le fichier doit contenir les colonnes suivantes:</p>
      <div className="mt-1 flex flex-wrap gap-1">
        {requiredHeaders.map((column) => (
          <span key={column} className="bg-slate-200 px-1 py-0.5 rounded text-slate-700">
            {column}
          </span>
        ))}
      </div>
    </div>
  );
};

export default FileDropzone;
