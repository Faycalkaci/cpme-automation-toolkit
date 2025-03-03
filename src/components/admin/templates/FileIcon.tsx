
import React from 'react';
import { FileText, File } from 'lucide-react';

interface FileIconProps {
  fileType: string;
  className?: string;
}

const FileIcon: React.FC<FileIconProps> = ({ fileType, className }) => {
  // Icon based on the file type
  const IconComponent = fileType === 'pdf' ? FileText : File;

  const iconColorClass = fileType === 'pdf' 
    ? 'text-red-500' 
    : fileType === 'unknown' 
      ? 'text-yellow-500' 
      : 'text-blue-500';

  return (
    <IconComponent className={`h-8 w-8 mx-auto ${iconColorClass} ${className || ''}`} />
  );
};

export default FileIcon;
