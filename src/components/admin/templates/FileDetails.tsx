
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FileIcon from './FileIcon';

interface FileDetailsProps {
  file: File;
  fileType: string;
  onRemove: () => void;
}

const FileDetails: React.FC<FileDetailsProps> = ({ file, fileType, onRemove }) => {
  const textColorClass = fileType === 'pdf' 
    ? 'text-red-700' 
    : fileType === 'unknown' 
      ? 'text-yellow-700' 
      : 'text-blue-700';

  return (
    <>
      <FileIcon fileType={fileType} />
      <p className={`mt-2 text-sm font-medium ${textColorClass}`}>
        {file.name}
      </p>
      <p className="text-xs text-slate-600 mt-1">
        {Math.round(file.size / 1024)} Ko
      </p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-2"
        onClick={onRemove}
      >
        <X className="h-3 w-3 mr-1" />
        Supprimer
      </Button>
    </>
  );
};

export default FileDetails;
