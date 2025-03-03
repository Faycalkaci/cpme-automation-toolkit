
import { useState } from 'react';
import { Document } from '../types';

export const useDocumentsFiltering = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

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
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab,
    filterDocuments
  };
};
