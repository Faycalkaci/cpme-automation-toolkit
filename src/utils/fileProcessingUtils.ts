
import { toast } from 'sonner';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

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
      const headers = results.meta.fields || [];
      
      // Check for required field headers
      checkMissingHeaders(headers, requiredHeaders);
      
      onSuccess(results.data, headers);
      
      toast.success("Fichier traité avec succès", {
        description: `${results.data.length} lignes importées.`
      });
    },
    error: (error) => {
      console.error("CSV parse error:", error);
      const errorMsg = "Impossible de traiter ce fichier CSV. Vérifiez son format.";
      toast.error("Erreur de traitement", { description: errorMsg });
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
      
      // Convert rows to objects with headers as keys
      const formattedData = rows.map(row => {
        const obj: Record<string, any> = {};
        headers.forEach((header, index) => {
          obj[header] = row[index];
        });
        return obj;
      });
      
      onSuccess(formattedData, headers);
      
      toast.success("Fichier traité avec succès", {
        description: `${formattedData.length} lignes importées.`
      });
    } catch (error) {
      console.error("Error processing Excel file:", error);
      const errorMsg = "Impossible de traiter ce fichier Excel. Vérifiez son format.";
      toast.error("Erreur de traitement", { description: errorMsg });
      onError?.(errorMsg);
    }
  };
  
  reader.onerror = () => {
    const errorMsg = "Impossible de lire ce fichier. Veuillez réessayer.";
    toast.error("Erreur de lecture", { description: errorMsg });
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
