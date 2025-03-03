import { Document } from '@/components/documents/types';
import { toast } from 'sonner';

// Clé de stockage pour localStorage
const DOCUMENTS_KEY = 'cpme_documents';
const DOCUMENT_HISTORY_KEY = 'cpme_document_history';

// Interface for document history entry
interface DocumentHistoryEntry {
  documentId: string;
  action: 'create' | 'update' | 'delete' | 'download' | 'send';
  timestamp: Date;
  userId?: string;
  details?: string;
}

/**
 * Service pour le stockage et la récupération des documents générés
 */
export const documentStorage = {
  /**
   * Sauvegarder un document
   */
  saveDocument: async (document: Document): Promise<Document> => {
    try {
      // Récupérer les documents existants
      const documents = await documentStorage.getDocuments();
      
      // Vérifier si un document avec le même ID existe déjà
      const existingIndex = documents.findIndex(d => d.id === document.id);
      const isUpdate = existingIndex >= 0;
      
      if (isUpdate) {
        // Mettre à jour le document existant
        documents[existingIndex] = document;
      } else {
        // Ajouter un nouveau document
        documents.push(document);
      }
      
      // Sauvegarder dans localStorage
      localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(documents));
      
      // Track document modification
      documentStorage.trackDocumentChange(
        document.id, 
        isUpdate ? 'update' : 'create',
        `Document ${isUpdate ? 'mis à jour' : 'créé'}: ${document.name}`
      );
      
      return document;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du document:', error);
      toast.error('Erreur lors de la sauvegarde du document');
      throw error;
    }
  },
  
  /**
   * Sauvegarder plusieurs documents
   */
  saveDocuments: async (documents: Document[]): Promise<Document[]> => {
    try {
      // Récupérer les documents existants
      const existingDocuments = await documentStorage.getDocuments();
      
      // Fusionner les documents (remplacer les existants, ajouter les nouveaux)
      const updatedDocuments = [...existingDocuments];
      
      for (const document of documents) {
        const existingIndex = updatedDocuments.findIndex(d => d.id === document.id);
        const isUpdate = existingIndex >= 0;
        
        if (isUpdate) {
          // Mettre à jour le document existant
          updatedDocuments[existingIndex] = document;
        } else {
          // Ajouter un nouveau document
          updatedDocuments.push(document);
        }
        
        // Track document modification
        documentStorage.trackDocumentChange(
          document.id, 
          isUpdate ? 'update' : 'create',
          `Document ${isUpdate ? 'mis à jour' : 'créé'}: ${document.name}`
        );
      }
      
      // Sauvegarder dans localStorage
      localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(updatedDocuments));
      
      return documents;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des documents:', error);
      toast.error('Erreur lors de la sauvegarde des documents');
      throw error;
    }
  },
  
  /**
   * Récupérer tous les documents
   */
  getDocuments: async (): Promise<Document[]> => {
    try {
      const documentsJson = localStorage.getItem(DOCUMENTS_KEY);
      if (!documentsJson) return [];
      
      // Parser les documents depuis localStorage
      return JSON.parse(documentsJson) as Document[];
    } catch (error) {
      console.error('Erreur lors de la récupération des documents:', error);
      toast.error('Erreur lors de la récupération des documents');
      return [];
    }
  },
  
  /**
   * Supprimer un document
   */
  deleteDocument: async (documentId: string): Promise<void> => {
    try {
      const documents = await documentStorage.getDocuments();
      const documentToDelete = documents.find(d => d.id === documentId);
      const updatedDocuments = documents.filter(d => d.id !== documentId);
      
      localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(updatedDocuments));
      
      // Track document deletion
      if (documentToDelete) {
        documentStorage.trackDocumentChange(
          documentId, 
          'delete',
          `Document supprimé: ${documentToDelete.name}`
        );
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du document:', error);
      toast.error('Erreur lors de la suppression du document');
      throw error;
    }
  },
  
  /**
   * Supprimer plusieurs documents
   */
  deleteDocuments: async (documentIds: string[]): Promise<void> => {
    try {
      const documents = await documentStorage.getDocuments();
      const documentsToDelete = documents.filter(d => documentIds.includes(d.id));
      const updatedDocuments = documents.filter(d => !documentIds.includes(d.id));
      
      localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(updatedDocuments));
      
      // Track document deletions
      for (const doc of documentsToDelete) {
        documentStorage.trackDocumentChange(
          doc.id, 
          'delete',
          `Document supprimé: ${doc.name}`
        );
      }
    } catch (error) {
      console.error('Erreur lors de la suppression des documents:', error);
      toast.error('Erreur lors de la suppression des documents');
      throw error;
    }
  },
  
  /**
   * Track document download
   */
  trackDocumentDownload: async (documentId: string, documentName: string): Promise<void> => {
    documentStorage.trackDocumentChange(
      documentId,
      'download',
      `Document téléchargé: ${documentName}`
    );
  },
  
  /**
   * Track document sending
   */
  trackDocumentSent: async (documentId: string, documentName: string, recipient?: string): Promise<void> => {
    documentStorage.trackDocumentChange(
      documentId,
      'send',
      `Document envoyé: ${documentName}${recipient ? ` à ${recipient}` : ''}`
    );
  },
  
  /**
   * Track document changes in history
   */
  trackDocumentChange: (documentId: string, action: DocumentHistoryEntry['action'], details?: string): void => {
    try {
      const historyJson = localStorage.getItem(DOCUMENT_HISTORY_KEY);
      const history: DocumentHistoryEntry[] = historyJson ? JSON.parse(historyJson) : [];
      
      // Add new history entry
      history.push({
        documentId,
        action,
        timestamp: new Date(),
        details
      });
      
      // Keep only the last 1000 entries to avoid localStorage limits
      const trimmedHistory = history.slice(-1000);
      
      // Save updated history
      localStorage.setItem(DOCUMENT_HISTORY_KEY, JSON.stringify(trimmedHistory));
    } catch (error) {
      console.error('Error tracking document change:', error);
    }
  },
  
  /**
   * Get document history
   */
  getDocumentHistory: (documentId?: string): DocumentHistoryEntry[] => {
    try {
      const historyJson = localStorage.getItem(DOCUMENT_HISTORY_KEY);
      if (!historyJson) return [];
      
      const history: DocumentHistoryEntry[] = JSON.parse(historyJson);
      
      // Convert string dates to Date objects
      const processedHistory = history.map(entry => ({
        ...entry,
        timestamp: new Date(entry.timestamp)
      }));
      
      // Filter by document ID if specified
      return documentId 
        ? processedHistory.filter(entry => entry.documentId === documentId)
        : processedHistory;
    } catch (error) {
      console.error('Error retrieving document history:', error);
      return [];
    }
  }
};
