
import { Document } from '../types';
import { useToast } from '@/components/ui/use-toast';
import { documentStorage } from '@/services/documentStorage';

export const useDocumentsActions = (
  documents: Document[],
  setDocuments: React.Dispatch<React.SetStateAction<Document[]>>,
  selectedDocs: string[],
  setSelectedDocs: React.Dispatch<React.SetStateAction<string[]>>
) => {
  const { toast } = useToast();

  const downloadDocument = (id: string) => {
    toast({
      title: "Téléchargement en cours",
      description: "Le document sera téléchargé dans quelques instants."
    });
  };

  const viewDocument = (id: string) => {
    toast({
      title: "Aperçu du document",
      description: "L'aperçu du document s'ouvrira dans un nouvel onglet."
    });
    // In a real application, this would open the document in a new tab or modal
  };

  const sendEmail = (id: string) => {
    // Update the document as being sent
    const updatedDocuments = documents.map(doc => 
      doc.id === id ? { ...doc, sent: true } : doc
    );
    setDocuments(updatedDocuments);
    
    // Save the update
    const updatedDoc = updatedDocuments.find(doc => doc.id === id);
    if (updatedDoc) {
      documentStorage.saveDocument(updatedDoc)
        .then(() => {
          toast({
            title: "Email envoyé",
            description: "Le document a été envoyé par email avec succès."
          });
        })
        .catch(error => {
          console.error('Erreur lors de la mise à jour du document:', error);
        });
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      await documentStorage.deleteDocument(id);
      setDocuments(prev => prev.filter(doc => doc.id !== id));
      setSelectedDocs(prev => prev.filter(docId => docId !== id));
      
      toast({
        title: "Document supprimé",
        description: "Le document a été supprimé avec succès."
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du document:', error);
      toast({
        title: "Erreur de suppression",
        description: "Impossible de supprimer le document. Veuillez réessayer."
      });
    }
  };

  return {
    downloadDocument,
    viewDocument,
    sendEmail,
    deleteDocument
  };
};
