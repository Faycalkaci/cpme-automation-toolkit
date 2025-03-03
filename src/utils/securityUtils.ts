
import { toast } from 'sonner';

/**
 * Security utility functions
 */
export const securityUtils = {
  /**
   * Sanitize user input to prevent XSS attacks
   */
  sanitizeInput: (input: string): string => {
    if (!input) return '';
    
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },
  
  /**
   * Validate filename to ensure it's safe
   */
  validateFilename: (filename: string): boolean => {
    // Check for path traversal attempts
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      toast.error("Nom de fichier non valide", {
        description: "Le nom du fichier contient des caractères non autorisés."
      });
      return false;
    }
    
    // Ensure filename has a valid extension
    const validExtensions = ['.pdf', '.doc', '.docx', '.xlsx', '.xls', '.csv'];
    const hasValidExtension = validExtensions.some(ext => 
      filename.toLowerCase().endsWith(ext)
    );
    
    if (!hasValidExtension) {
      toast.error("Extension de fichier non valide", {
        description: "Veuillez utiliser un format de fichier pris en charge (.pdf, .doc, .xlsx, .csv)."
      });
      return false;
    }
    
    return true;
  },
  
  /**
   * Validate CSV/Excel data to prevent formula injection
   */
  validateCellData: (data: string): string => {
    // Check for potentially dangerous formula starts
    const dangerousFormulaPrefixes = ['=', '+', '-', '@', '\t=', '\r='];
    
    let sanitizedData = data;
    for (const prefix of dangerousFormulaPrefixes) {
      if (sanitizedData.trim().startsWith(prefix)) {
        // Add a single quote to neutralize formula
        sanitizedData = `'${sanitizedData}`;
        break;
      }
    }
    
    return sanitizedData;
  },
  
  /**
   * Encrypt sensitive data before storage (simple encryption for demo purposes)
   * Note: In a real-world app, use a proper encryption library
   */
  encryptData: (data: string, key: string): string => {
    if (!data) return '';
    
    // Simple XOR encryption (for demonstration purposes only)
    // In production, use a proper encryption library
    let result = '';
    for (let i = 0; i < data.length; i++) {
      const charCode = data.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      result += String.fromCharCode(charCode);
    }
    
    return btoa(result); // base64 encode
  },
  
  /**
   * Decrypt sensitive data after retrieval
   */
  decryptData: (encryptedData: string, key: string): string => {
    if (!encryptedData) return '';
    
    try {
      const data = atob(encryptedData); // base64 decode
      
      // Simple XOR decryption
      let result = '';
      for (let i = 0; i < data.length; i++) {
        const charCode = data.charCodeAt(i) ^ key.charCodeAt(i % key.length);
        result += String.fromCharCode(charCode);
      }
      
      return result;
    } catch (error) {
      console.error('Error decrypting data:', error);
      return '';
    }
  },
  
  /**
   * Generate a secure random key
   */
  generateSecureKey: (): string => {
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
};
