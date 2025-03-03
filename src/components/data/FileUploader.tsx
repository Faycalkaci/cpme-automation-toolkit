
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileType, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Papa from 'papaparse';

interface FileUploaderProps {
  onFileUploaded: (data: any[], headers: string[]) => void;
  acceptedFormats?: string[];
}

const FileUploader: React.FC<FileUploaderProps> = ({ 
  onFileUploaded, 
  acceptedFormats = ['.csv', '.xlsx', '.xls'] 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processCSV = (file: File) => {
    setIsLoading(true);
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const headers = results.meta.fields || [];
        onFileUploaded(results.data, headers);
        setIsLoading(false);
        toast.success(`Fichier "${file.name}" importé avec succès`, {
          description: `${results.data.length} lignes ont été importées.`
        });
      },
      error: (error) => {
        setError(`Erreur lors de l'analyse du fichier: ${error.message}`);
        setIsLoading(false);
        toast.error("Échec de l'importation", {
          description: "Vérifiez le format de votre fichier et réessayez."
        });
      }
    });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      validateAndProcessFile(file);
    }
  };

  const validateAndProcessFile = (file: File) => {
    setError(null);
    
    // Check file extension
    const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedFormats.includes(fileExt)) {
      setError(`Format de fichier non supporté. Formats acceptés: ${acceptedFormats.join(', ')}`);
      toast.error("Format de fichier non supporté", {
        description: `Veuillez utiliser un des formats suivants: ${acceptedFormats.join(', ')}`
      });
      return;
    }
    
    setUploadedFile(file);
    
    // Process CSV files directly, later we'll add Excel processing
    if (fileExt === '.csv') {
      processCSV(file);
    } else {
      // For Excel files, we would need a library like xlsx
      // For now, let's show an error
      setError("Le traitement des fichiers Excel sera bientôt disponible. Veuillez utiliser CSV pour le moment.");
      toast.info("Fonction en développement", {
        description: "Le traitement des fichiers Excel sera bientôt disponible. Veuillez utiliser CSV pour le moment."
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndProcessFile(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const resetUpload = () => {
    setUploadedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={acceptedFormats.join(',')}
        className="hidden"
      />
      
      {!uploadedFile ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            isDragging 
              ? 'border-primary bg-primary/5' 
              : 'border-slate-200 hover:border-primary/50 hover:bg-slate-50'
          } transition-colors duration-200 cursor-pointer`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileInput}
        >
          <div className="mx-auto flex flex-col items-center">
            <Upload className="h-12 w-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Glissez-déposez votre fichier ici ou cliquez pour parcourir
            </h3>
            <p className="text-sm text-slate-500 mb-2">
              Formats acceptés: {acceptedFormats.join(', ')}
            </p>
            <Button type="button" variant="outline" className="mt-4">
              Sélectionner un fichier
            </Button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border rounded-lg p-6"
        >
          <div className="flex items-center">
            <div className="mr-4">
              <FileType className={`h-10 w-10 ${error ? 'text-destructive' : 'text-green-500'}`} />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{uploadedFile.name}</h3>
              <p className="text-sm text-slate-500">
                {(uploadedFile.size / 1024).toFixed(2)} KB
              </p>
              {error && (
                <p className="text-sm text-destructive mt-1 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" /> {error}
                </p>
              )}
              {isLoading && (
                <p className="text-sm text-slate-500 mt-1">Traitement du fichier...</p>
              )}
            </div>
            <div>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation();
                  resetUpload();
                }}
              >
                Changer
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default FileUploader;
