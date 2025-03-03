
import React, { useRef } from 'react';
import { getFileType } from './utils/fileHelpers';
import FileDetails from './FileDetails';
import FileUploadPrompt from './FileUploadPrompt';

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
  
  const getContainerClasses = () => {
    const baseClasses = 'border-2 border-dashed rounded-lg p-4 transition-colors';
    
    if (!selectedFile) return `${baseClasses} border-slate-200 hover:border-primary/50`;
    
    if (fileType === 'pdf') return `${baseClasses} border-red-500 bg-red-50`;
    if (fileType === 'unknown') return `${baseClasses} border-yellow-500 bg-yellow-50`;
    return `${baseClasses} border-blue-500 bg-blue-50`;
  };

  const browseFiles = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div 
      className={getContainerClasses()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="text-center">
        {selectedFile ? (
          <FileDetails 
            file={selectedFile} 
            fileType={fileType} 
            onRemove={() => setSelectedFile(null)}
          />
        ) : (
          <FileUploadPrompt browseFiles={browseFiles} />
        )}
        <input 
          ref={fileInputRef}
          id="template-file" 
          type="file" 
          accept=".pdf,.doc,.docx" 
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>
    </div>
  );
};

export default FileDropArea;
