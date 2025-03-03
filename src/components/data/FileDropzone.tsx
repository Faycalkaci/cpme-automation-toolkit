
import React from 'react';
import { DropzoneRootProps, DropzoneInputProps } from 'react-dropzone';

interface FileDropzoneProps {
  isDragActive: boolean;
  isDragReject: boolean;
  isLoading: boolean;
  maxFileSize: number;
  requiredHeaders: string[];
  getRootProps: () => DropzoneRootProps;
  getInputProps: () => DropzoneInputProps;
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
          
          {requiredHeaders.length > 0 && (
            <div className="mt-3 text-sm text-gray-500">
              <p>Champs requis: {requiredHeaders.join(', ')}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FileDropzone;
