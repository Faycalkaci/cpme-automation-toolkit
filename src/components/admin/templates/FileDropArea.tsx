
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { FileUp, X, FileText, File } from 'lucide-react';
import { getFileType } from './utils/fileHelpers';

interface FileDropAreaProps {
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
}

const FileDropArea: React.FC<FileDropAreaProps> = ({
  selectedFile,
  setSelectedFile,
  handleFileSelect,
  handleDragOver,
  handleDragLeave,
  handleDrop
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileType = getFileType(selectedFile);
  
  // Icon based on the file type
  const FileIcon = fileType === 'pdf' ? FileText : File;

  const browseFiles = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div 
      className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
        selectedFile ? (
          fileType === 'pdf' ? 'border-red-500 bg-red-50' : 
          fileType === 'unknown' ? 'border-yellow-500 bg-yellow-50' : 
          'border-blue-500 bg-blue-50'
        ) : 'border-slate-200 hover:border-primary/50'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="text-center">
        {selectedFile ? (
          <>
            <FileIcon className={`h-8 w-8 mx-auto ${
              fileType === 'pdf' ? 'text-red-500' : 
              fileType === 'unknown' ? 'text-yellow-500' : 
              'text-blue-500'
            }`} />
            <p className={`mt-2 text-sm font-medium ${
              fileType === 'pdf' ? 'text-red-700' : 
              fileType === 'unknown' ? 'text-yellow-700' : 
              'text-blue-700'
            }`}>
              {selectedFile.name}
            </p>
            <p className="text-xs text-slate-600 mt-1">
              {Math.round(selectedFile.size / 1024)} Ko
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => setSelectedFile(null)}
            >
              <X className="h-3 w-3 mr-1" />
              Supprimer
            </Button>
          </>
        ) : (
          <>
            <FileUp className="h-8 w-8 mx-auto text-slate-400" />
            <p className="mt-2 text-sm text-slate-600">
              Glissez-déposez votre fichier PDF ou Word ici ou cliquez pour parcourir
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={browseFiles}
            >
              Parcourir
            </Button>
            <input 
              ref={fileInputRef}
              id="template-file" 
              type="file" 
              accept=".pdf,.doc,.docx" 
              className="hidden"
              onChange={handleFileSelect}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default FileDropArea;
