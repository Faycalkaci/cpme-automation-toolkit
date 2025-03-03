
import { toast } from 'sonner';

/**
 * Error types to categorize different errors
 */
export enum ErrorType {
  FILE_ERROR = 'FILE_ERROR',
  PDF_GENERATION_ERROR = 'PDF_GENERATION_ERROR',
  TEMPLATE_ERROR = 'TEMPLATE_ERROR',
  DATA_PROCESSING_ERROR = 'DATA_PROCESSING_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

/**
 * Interface for structured error details
 */
export interface ErrorDetails {
  type: ErrorType;
  message: string;
  technicalDetails?: string;
  userAction?: string;
}

/**
 * Service for handling errors in a consistent way
 */
export const errorHandler = {
  /**
   * Handle an error with proper logging and user feedback
   */
  handleError: (error: unknown, defaultDetails?: Partial<ErrorDetails>): ErrorDetails => {
    console.error('Error occurred:', error);
    
    // Determine error type and details
    let errorDetails: ErrorDetails;
    
    if (error instanceof Error) {
      // Process standard Error objects
      errorDetails = determineErrorType(error, defaultDetails);
    } else if (typeof error === 'string') {
      // Process string errors
      errorDetails = {
        type: defaultDetails?.type || ErrorType.UNKNOWN_ERROR,
        message: error,
        technicalDetails: error,
        ...defaultDetails
      };
    } else {
      // Fallback for unknown error types
      errorDetails = {
        type: defaultDetails?.type || ErrorType.UNKNOWN_ERROR,
        message: 'Une erreur inconnue est survenue',
        technicalDetails: JSON.stringify(error),
        ...defaultDetails
      };
    }
    
    // Display error toast with appropriate message
    toast.error(errorDetails.message, {
      description: errorDetails.userAction || 'Veuillez réessayer ou contacter le support si le problème persiste.',
      duration: 5000
    });
    
    return errorDetails;
  },
  
  /**
   * Log an error without showing a toast notification
   */
  logError: (error: unknown, context?: string): void => {
    if (context) {
      console.error(`Error in ${context}:`, error);
    } else {
      console.error('Error occurred:', error);
    }
  },
  
  /**
   * Create a wrapped async function that catches and handles errors
   */
  withErrorHandling: <T extends any[], R>(
    fn: (...args: T) => Promise<R>,
    defaultDetails?: Partial<ErrorDetails>
  ): ((...args: T) => Promise<R | undefined>) => {
    return async (...args: T): Promise<R | undefined> => {
      try {
        return await fn(...args);
      } catch (error) {
        errorHandler.handleError(error, defaultDetails);
        return undefined;
      }
    };
  }
};

/**
 * Determine the type of error and create structured error details
 */
function determineErrorType(error: Error, defaultDetails?: Partial<ErrorDetails>): ErrorDetails {
  // Check for network errors
  if (error.message.includes('network') || error.message.includes('fetch') || error.message.includes('XMLHttpRequest')) {
    return {
      type: ErrorType.NETWORK_ERROR,
      message: 'Problème de connexion réseau',
      technicalDetails: error.message,
      userAction: 'Vérifiez votre connexion internet et réessayez.',
      ...defaultDetails
    };
  }
  
  // Check for file errors
  if (error.message.includes('file') || error.message.includes('File') || error.message.includes('blob')) {
    return {
      type: ErrorType.FILE_ERROR,
      message: 'Problème avec le fichier',
      technicalDetails: error.message,
      userAction: 'Vérifiez que le fichier est valide et réessayez.',
      ...defaultDetails
    };
  }
  
  // Check for PDF generation errors
  if (error.message.includes('PDF') || error.message.includes('pdf-lib')) {
    return {
      type: ErrorType.PDF_GENERATION_ERROR,
      message: 'Erreur lors de la génération du PDF',
      technicalDetails: error.message,
      userAction: 'Vérifiez que les données sont complètes et réessayez.',
      ...defaultDetails
    };
  }
  
  // Check for template errors
  if (error.message.includes('template') || error.message.includes('modèle')) {
    return {
      type: ErrorType.TEMPLATE_ERROR,
      message: 'Problème avec le modèle de document',
      technicalDetails: error.message,
      userAction: 'Sélectionnez un autre modèle ou contactez l\'administrateur.',
      ...defaultDetails
    };
  }
  
  // Check for data processing errors
  if (error.message.includes('data') || error.message.includes('données') || error.message.includes('parsing')) {
    return {
      type: ErrorType.DATA_PROCESSING_ERROR,
      message: 'Erreur de traitement des données',
      technicalDetails: error.message,
      userAction: 'Vérifiez que le format des données est correct et réessayez.',
      ...defaultDetails
    };
  }
  
  // Default case for unknown errors
  return {
    type: ErrorType.UNKNOWN_ERROR,
    message: 'Une erreur est survenue',
    technicalDetails: error.message,
    userAction: 'Veuillez réessayer ou contacter le support si le problème persiste.',
    ...defaultDetails
  };
}
