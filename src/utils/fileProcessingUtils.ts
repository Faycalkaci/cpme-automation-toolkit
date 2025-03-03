
import { toast } from 'sonner';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { securityUtils } from './securityUtils';
import { errorHandler, ErrorType } from '@/services/errorHandler';

/**
 * Process CSV file and extract data
 */
export const processCSVFile = (
  file: File, 
  requiredHeaders: string[],
  onSuccess: (data: any[], headers: string[]) => void,
  onError?: (error: string) => void
) => {
  Papa.parse(file, {
    header: true,
    complete: (results) => {
      try {
        const headers = results.meta.fields || [];
        
        // Check for required field headers
        checkMissingHeaders(headers, requiredHeaders);
        
        // Sanitize data to prevent security issues
        const sanitizedData = results.data.map(row => {
          const sanitizedRow: Record<string, string> = {};
          Object.entries(row).forEach(([key, value]) => {
            // Skip empty or non-string values
            if (value === null || value === undefined) {
              sanitizedRow[key] = '';
              return;
            }
            
            const stringValue = String(value);
            
            // Sanitize each cell based on data type
            if (key.toLowerCase().includes('email') || key.toLowerCase().includes('mail')) {
              // For email fields, just trim
              sanitizedRow[key] = stringValue.trim();
            } else {
              // For other fields, sanitize input and validate CSV data
              sanitizedRow[key] = securityUtils.validateCellData(
                securityUtils.sanitizeInput(stringValue)
              );
            }
          });
          return sanitizedRow;
        });
        
        onSuccess(sanitizedData, headers);
        
        toast.success("Fichier traité avec succès", {
          description: `${sanitizedData.length} lignes importées.`
        });
      } catch (error) {
        errorHandler.handleError(error, {
          type: ErrorType.DATA_PROCESSING_ERROR,
          message: "Erreur lors du traitement des données CSV"
        });
        
        const errorMsg = error instanceof Error ? error.message : "Erreur inconnue";
        onError?.(errorMsg);
      }
    },
    error: (error) => {
      console.error("CSV parse error:", error);
      const errorMsg = "Impossible de traiter ce fichier CSV. Vérifiez son format.";
      
      errorHandler.handleError(error, {
        type: ErrorType.FILE_ERROR,
        message: errorMsg
      });
      
      onError?.(errorMsg);
    }
  });
};

/**
 * Process Excel file and extract data
 */
export const processExcelFile = (
  file: File,
  requiredHeaders: string[],
  onSuccess: (data: any[], headers: string[]) => void,
  onError?: (error: string) => void
) => {
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
        return;
      }
      
      // Extract headers from first row
      const headers = jsonData[0] as string[];
      // Extract data rows (skip header row)
      const rows = jsonData.slice(1) as any[];
      
      // Check for required field headers
      checkMissingHeaders(headers, requiredHeaders);
      
      // Convert rows to objects with headers as keys and sanitize data
      const formattedData = rows.map(row => {
        const obj: Record<string, any> = {};
        headers.forEach((header, index) => {
          const value = row[index];
          
          // Skip undefined values
          if (value === undefined) {
            obj[header] = '';
            return;
          }
          
          const stringValue = String(value);
          
          // Sanitize each cell based on data type
          if (header.toLowerCase().includes('email') || header.toLowerCase().includes('mail')) {
            // For email fields, just trim
            obj[header] = stringValue.trim();
          } else {
            // For other fields, sanitize input and validate CSV data
            obj[header] = securityUtils.validateCellData(
              securityUtils.sanitizeInput(stringValue)
            );
          }
        });
        return obj;
      });
      
      onSuccess(formattedData, headers);
      
      toast.success("Fichier traité avec succès", {
        description: `${formattedData.length} lignes importées.`
      });
    } catch (error) {
      errorHandler.handleError(error, {
        type: ErrorType.DATA_PROCESSING_ERROR,
        message: "Erreur lors du traitement des données Excel"
      });
      
      const errorMsg = error instanceof Error ? error.message : "Erreur inconnue";
      onError?.(errorMsg);
    }
  };
  
  reader.onerror = (error) => {
    errorHandler.handleError(error, {
      type: ErrorType.FILE_ERROR,
      message: "Impossible de lire ce fichier"
    });
    
    const errorMsg = "Impossible de lire ce fichier. Veuillez réessayer.";
    onError?.(errorMsg);
  };
  
  reader.readAsBinaryString(file);
};

/**
 * Check for missing required headers and show a warning toast if any are missing
 */
export const checkMissingHeaders = (headers: string[], requiredHeaders: string[]) => {
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
};

/**
 * Validate file type and size
 */
export const validateFile = (
  file: File, 
  allowedFileTypes: string[], 
  maxFileSize: number,
  onError?: (error: string) => void
): boolean => {
  // Validate filename for security
  if (!securityUtils.validateFilename(file.name)) {
    return false;
  }
  
  // Check file size
  if (file.size > maxFileSize) {
    const maxSizeMB = Math.round(maxFileSize / (1024 * 1024));
    const errorMsg = `Le fichier est trop volumineux. La taille maximale est de ${maxSizeMB}MB.`;
    toast.error("Fichier trop volumineux", { description: errorMsg });
    onError?.(errorMsg);
    return false;
  }
  
  // Check file type
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  if (!fileExtension || !allowedFileTypes.some(type => type.includes(fileExtension))) {
    const errorMsg = "Veuillez importer un fichier Excel (.xlsx, .xls) ou CSV.";
    toast.error("Type de fichier non supporté", { description: errorMsg });
    onError?.(errorMsg);
    return false;
  }
  
  return true;
};
