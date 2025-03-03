
import React from 'react';
import { FileUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploadPromptProps {
  browseFiles: () => void;
}

const FileUploadPrompt: React.FC<FileUploadPromptProps> = ({ browseFiles }) => {
  return (
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
    </>
  );
};

export default FileUploadPrompt;
