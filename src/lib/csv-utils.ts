
import Papa from 'papaparse';

export interface ParsedRow {
  [key: string]: string;
}

export interface ParseResult {
  data: ParsedRow[];
  headers: string[];
  error?: string;
}

/**
 * Parse CSV file content
 */
export const parseCSV = (file: File): Promise<ParseResult> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const headers = results.meta.fields || [];
        const data = results.data as ParsedRow[];
        
        if (headers.length === 0) {
          reject({ error: 'Aucun en-tête trouvé dans le fichier CSV' });
          return;
        }
        
        resolve({ data, headers });
      },
      error: (error) => {
        reject({ error: error.message });
      }
    });
  });
};

/**
 * Convert JSON data to CSV
 */
export const jsonToCSV = (data: any[]): string => {
  return Papa.unparse(data);
};

/**
 * Download data as CSV file
 */
export const downloadCSV = (data: any[], filename: string = 'export.csv') => {
  const csv = jsonToCSV(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Validate CSV data based on required fields
 */
export const validateCSVData = (data: ParsedRow[], requiredFields: string[]): { valid: boolean, missingFields: string[] } => {
  const missingFields: string[] = [];
  
  if (data.length === 0) {
    return { valid: false, missingFields: ['Aucune donnée trouvée'] };
  }
  
  // Check if all required fields exist in the headers
  for (const field of requiredFields) {
    if (!(field in data[0])) {
      missingFields.push(field);
    }
  }
  
  return { 
    valid: missingFields.length === 0,
    missingFields 
  };
};
