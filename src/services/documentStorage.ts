
import { Document } from '@/components/documents/types';
import { toast } from 'sonner';

// Clé de stockage pour localStorage
const DOCUMENTS_KEY = 'cpme_documents';

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
      if (existingIndex >= 0) {
        // Mettre à jour le document existant
        documents[existingIndex] = document;
      } else {
        // Ajouter un nouveau document
        documents.push(document);
      }
      
      // Sauvegarder dans localStorage
      localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(documents));
      
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
        if (existingIndex >= 0) {
          // Mettre à jour le document existant
          updatedDocuments[existingIndex] = document;
        } else {
          // Ajouter un nouveau document
          updatedDocuments.push(document);
        }
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
      const updatedDocuments = documents.filter(d => d.id !== documentId);
      
      localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(updatedDocuments));
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
      const updatedDocuments = documents.filter(d => !documentIds.includes(d.id));
      
      localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(updatedDocuments));
    } catch (error) {
      console.error('Erreur lors de la suppression des documents:', error);
      toast.error('Erreur lors de la suppression des documents');
      throw error;
    }
  }
};
