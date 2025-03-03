
import { useState } from 'react';
import { Document } from '../types';

export const useDocumentsSelection = () => {
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);

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

  return {
    selectedDocs,
    setSelectedDocs,
    toggleSelectDocument,
    selectAllDocuments
  };
};
