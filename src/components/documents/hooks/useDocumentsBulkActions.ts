
import { Document } from '../types';
import { useToast } from '@/components/ui/use-toast';
import { documentStorage } from '@/services/documentStorage';

export const useDocumentsBulkActions = (
  documents: Document[],
  setDocuments: React.Dispatch<React.SetStateAction<Document[]>>,
  selectedDocs: string[],
  setSelectedDocs: React.Dispatch<React.SetStateAction<string[]>>
) => {
  const { toast } = useToast();

  const bulkDownload = (filteredDocs: Document[]) => {
    if (selectedDocs.length === 0) {
      toast({
        title: "Aucun document sélectionné",
        description: "Veuillez sélectionner au moins un document.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Téléchargement en cours",
      description: `${selectedDocs.length} document(s) seront téléchargés dans quelques instants.`
    });
  };

  const bulkEmail = async () => {
    if (selectedDocs.length === 0) {
      toast({
        title: "Aucun document sélectionné",
        description: "Veuillez sélectionner au moins un document.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Update documents as being sent
      const updatedDocuments = documents.map(doc => 
        selectedDocs.includes(doc.id) ? { ...doc, sent: true } : doc
      );
      setDocuments(updatedDocuments);
      
      // Save updated documents
      await Promise.all(
        updatedDocuments
          .filter(doc => selectedDocs.includes(doc.id))
          .map(doc => documentStorage.saveDocument(doc))
      );
      
      toast({
        title: "Emails envoyés",
        description: `${selectedDocs.length} document(s) ont été envoyés par email avec succès.`
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi des emails:', error);
      toast({
        title: "Erreur d'envoi",
        description: "Une erreur est survenue lors de l'envoi des emails.",
        variant: "destructive"
      });
    }
  };

  const bulkDelete = async () => {
    if (selectedDocs.length === 0) {
      toast({
        title: "Aucun document sélectionné",
        description: "Veuillez sélectionner au moins un document.",
        variant: "destructive"
      });
      return;
    }

    try {
      await documentStorage.deleteDocuments(selectedDocs);
      setDocuments(prev => prev.filter(doc => !selectedDocs.includes(doc.id)));
      setSelectedDocs([]);
      
      toast({
        title: "Documents supprimés",
        description: `${selectedDocs.length} document(s) ont été supprimés avec succès.`
      });
    } catch (error) {
      console.error('Erreur lors de la suppression des documents:', error);
      toast({
        title: "Erreur de suppression",
        description: "Une erreur est survenue lors de la suppression des documents.",
        variant: "destructive"
      });
    }
  };

  return {
    bulkDownload,
    bulkEmail,
    bulkDelete
  };
};
