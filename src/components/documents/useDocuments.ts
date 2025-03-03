
import { useState, useEffect } from 'react';
import { Document } from './types';
import { useToast } from '@/components/ui/use-toast';
import { documentStorage } from '@/services/documentStorage';

export const useDocuments = () => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Charger les documents depuis le stockage
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
    // Dans une vraie application, cela ouvrirait le document dans un nouvel onglet ou une modal
  };

  const sendEmail = (id: string) => {
    // Mettre à jour le document comme étant envoyé
    const updatedDocuments = documents.map(doc => 
      doc.id === id ? { ...doc, sent: true } : doc
    );
    setDocuments(updatedDocuments);
    
    // Sauvegarder la mise à jour
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

  const toggleSelectDocument = (id: string) => {
    setSelectedDocs(prev => 
      prev.includes(id) 
        ? prev.filter(docId => docId !== id) 
        : [...prev, id]
    );
  };

  const selectAllDocuments = (filteredDocs: Document[]) => {
    if (selectedDocs.length === filteredDocs.length) {
      setSelectedDocs([]);
    } else {
      setSelectedDocs(filteredDocs.map(doc => doc.id));
    }
  };

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
      // Mettre à jour les documents comme étant envoyés
      const updatedDocuments = documents.map(doc => 
        selectedDocs.includes(doc.id) ? { ...doc, sent: true } : doc
      );
      setDocuments(updatedDocuments);
      
      // Sauvegarder les documents mis à jour
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

  const filterDocuments = (docs: Document[]) => {
    return docs.filter(doc => {
      // Filtrer par terme de recherche
      const matchesSearch = 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.type.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtrer par onglet
      const matchesTab = 
        activeTab === 'all' ||
        (activeTab === 'appel' && doc.type === 'Appel de cotisation') ||
        (activeTab === 'facture' && doc.type === 'Facture') ||
        (activeTab === 'rappel' && doc.type === 'Rappel de cotisation');
      
      return matchesSearch && matchesTab;
    });
  };

  return {
    documents,
    selectedDocs,
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab,
    isLoading,
    downloadDocument,
    viewDocument,
    sendEmail,
    deleteDocument,
    toggleSelectDocument,
    selectAllDocuments,
    bulkDownload,
    bulkEmail,
    bulkDelete,
    filterDocuments
  };
};
