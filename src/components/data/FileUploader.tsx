
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileSpreadsheet, Upload, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';
import { DEFAULT_FIELD_MAPPINGS } from '@/services/pdfMappingService';

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
  
  const processExcelFile = (file: File) => {
    setIsLoading(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length < 2) {
          const errorMsg = "Le fichier ne contient pas suffisamment de données.";
          toast.error("Fichier invalide", { description: errorMsg });
          onError?.(errorMsg);
          setIsLoading(false);
          return;
        }
        
        // Extract headers from first row
        const headers = jsonData[0] as string[];
        // Extract data rows (skip header row)
        const rows = jsonData.slice(1) as any[];
        
        // Check for required field headers
        const missingHeaders = requiredHeaders.filter(header => 
          !headers.includes(header) && 
          !headers.includes(header.toLowerCase()) &&
          !headers.some(h => h.normalize('NFD').replace(/[\u0300-\u036f]/g, '') === 
                          header.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))
        );
        
        if (missingHeaders.length > 0) {
          toast.warning("Colonnes manquantes", {
            description: `Les colonnes suivantes sont recommandées mais manquantes: ${missingHeaders.join(', ')}`
          });
        }
        
        // Convert rows to objects with headers as keys
        const formattedData = rows.map(row => {
          const obj: Record<string, any> = {};
          headers.forEach((header, index) => {
            obj[header] = row[index];
          });
          return obj;
        });
        
        onFileUploaded(formattedData, headers);
        
        toast.success("Fichier traité avec succès", {
          description: `${formattedData.length} lignes importées.`
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error processing Excel file:", error);
        const errorMsg = "Impossible de traiter ce fichier Excel. Vérifiez son format.";
        toast.error("Erreur de traitement", { description: errorMsg });
        onError?.(errorMsg);
        setIsLoading(false);
      }
    };
    
    reader.onerror = () => {
      const errorMsg = "Impossible de lire ce fichier. Veuillez réessayer.";
      toast.error("Erreur de lecture", { description: errorMsg });
      onError?.(errorMsg);
      setIsLoading(false);
    };
    
    reader.readAsBinaryString(file);
  };
  
  const processCSVFile = (file: File) => {
    setIsLoading(true);
    
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const headers = results.meta.fields || [];
        
        // Check for required field headers
        const missingHeaders = requiredHeaders.filter(header => 
          !headers.includes(header) && 
          !headers.includes(header.toLowerCase()) &&
          !headers.some(h => h.normalize('NFD').replace(/[\u0300-\u036f]/g, '') === 
                          header.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))
        );
        
        if (missingHeaders.length > 0) {
          toast.warning("Colonnes manquantes", {
            description: `Les colonnes suivantes sont recommandées mais manquantes: ${missingHeaders.join(', ')}`
          });
        }
        
        onFileUploaded(results.data, headers);
        
        toast.success("Fichier traité avec succès", {
          description: `${results.data.length} lignes importées.`
        });
        
        setIsLoading(false);
      },
      error: (error) => {
        console.error("CSV parse error:", error);
        const errorMsg = "Impossible de traiter ce fichier CSV. Vérifiez son format.";
        toast.error("Erreur de traitement", { description: errorMsg });
        onError?.(errorMsg);
        setIsLoading(false);
      }
    });
  };
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setIsDragActive(false);
    
    if (acceptedFiles.length === 0) {
      const errorMsg = "Veuillez importer un fichier Excel (.xlsx, .xls) ou CSV.";
      toast.error("Type de fichier non supporté", { description: errorMsg });
      onError?.(errorMsg);
      return;
    }
    
    const file = acceptedFiles[0];
    
    // Check file size
    if (file.size > maxFileSize) {
      const maxSizeMB = Math.round(maxFileSize / (1024 * 1024));
      const errorMsg = `Le fichier est trop volumineux. La taille maximale est de ${maxSizeMB}MB.`;
      toast.error("Fichier trop volumineux", { description: errorMsg });
      onError?.(errorMsg);
      return;
    }
    
    if (file.name.endsWith('.csv')) {
      processCSVFile(file);
    } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      processExcelFile(file);
    } else {
      const errorMsg = "Veuillez importer un fichier Excel (.xlsx, .xls) ou CSV.";
      toast.error("Type de fichier non supporté", { description: errorMsg });
      onError?.(errorMsg);
    }
    
  }, [onFileUploaded, maxFileSize, onError]);
  
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
          </>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
