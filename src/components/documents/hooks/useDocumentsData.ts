
import { useState, useEffect } from 'react';
import { Document } from '../types';
import { useToast } from '@/components/ui/use-toast';
import { documentStorage } from '@/services/documentStorage';

export const useDocumentsData = () => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load documents from storage
  useEffect(() => {
    const loadDocuments = async () => {
      setIsLoading(true);
      try {
        const storedDocuments = await documentStorage.getDocuments();
        setDocuments(storedDocuments);
      } catch (error) {
        console.error('Erreur lors du chargement des documents:', error);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les documents. Veuillez réessayer."
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDocuments();
  }, [toast]);

  return {
    documents,
    setDocuments,
    isLoading
  };
};
