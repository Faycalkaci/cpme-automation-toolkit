
import { useState } from 'react';
import { Document } from './types';
import { useToast } from '@/components/ui/use-toast';

// Mock document data
const MOCK_DOCUMENTS = [
  {
    id: '1',
    name: 'Appel de cotisation - Dupont SAS.pdf',
    type: 'Appel de cotisation',
    date: '12/03/2023',
    size: '52 Ko',
    sent: true,
    company: 'Dupont SAS'
  },
  {
    id: '2',
    name: 'Facture - Martin & Co.pdf',
    type: 'Facture',
    date: '10/03/2023',
    size: '48 Ko',
    sent: true,
    company: 'Martin & Co'
  },
  {
    id: '3',
    name: 'Rappel de cotisation - Dubois SARL.pdf',
    type: 'Rappel de cotisation',
    date: '05/03/2023',
    size: '51 Ko',
    sent: false,
    company: 'Dubois SARL'
  },
  {
    id: '4',
    name: 'Appel de cotisation - Lefevre Inc.pdf',
    type: 'Appel de cotisation',
    date: '01/03/2023',
    size: '53 Ko',
    sent: true,
    company: 'Lefevre Inc'
  },
  {
    id: '5',
    name: 'Facture - Moreau SARL.pdf',
    type: 'Facture',
    date: '28/02/2023',
    size: '49 Ko',
    sent: true,
    company: 'Moreau SARL'
  }
];

export const useDocuments = () => {
  const { toast } = useToast();
  const [documents] = useState<Document[]>(MOCK_DOCUMENTS);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

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
    // In a real app, this would open the document in a new tab or modal
  };

  const sendEmail = (id: string) => {
    toast({
      title: "Email envoyé",
      description: "Le document a été envoyé par email avec succès."
    });
  };

  const deleteDocument = (id: string) => {
    toast({
      title: "Document supprimé",
      description: "Le document a été supprimé avec succès."
    });
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

  const bulkEmail = () => {
    if (selectedDocs.length === 0) {
      toast({
        title: "Aucun document sélectionné",
        description: "Veuillez sélectionner au moins un document.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Emails envoyés",
      description: `${selectedDocs.length} document(s) ont été envoyés par email avec succès.`
    });
  };

  const bulkDelete = () => {
    if (selectedDocs.length === 0) {
      toast({
        title: "Aucun document sélectionné",
        description: "Veuillez sélectionner au moins un document.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Documents supprimés",
      description: `${selectedDocs.length} document(s) ont été supprimés avec succès.`
    });
  };

  const filterDocuments = (docs: Document[]) => {
    return docs.filter(doc => {
      // Filter by search term
      const matchesSearch = 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.type.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by tab
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
