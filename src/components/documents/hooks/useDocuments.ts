
import { useDocumentsData } from './useDocumentsData';
import { useDocumentsSelection } from './useDocumentsSelection';
import { useDocumentsFiltering } from './useDocumentsFiltering';
import { useDocumentsActions } from './useDocumentsActions';
import { useDocumentsBulkActions } from './useDocumentsBulkActions';

export const useDocuments = () => {
  const { documents, setDocuments, isLoading } = useDocumentsData();
  const { selectedDocs, setSelectedDocs, toggleSelectDocument, selectAllDocuments } = useDocumentsSelection();
  const { searchTerm, setSearchTerm, activeTab, setActiveTab, filterDocuments } = useDocumentsFiltering();
  
  const { 
    downloadDocument, 
    viewDocument, 
    sendEmail, 
    deleteDocument 
  } = useDocumentsActions(documents, setDocuments, selectedDocs, setSelectedDocs);
  
  const { 
    bulkDownload, 
    bulkEmail, 
    bulkDelete 
  } = useDocumentsBulkActions(documents, setDocuments, selectedDocs, setSelectedDocs);

  return {
    // State
    documents,
    selectedDocs,
    searchTerm,
    activeTab,
    isLoading,
    
    // Setters
    setSearchTerm,
    setActiveTab,
    
    // Document actions
    downloadDocument,
    viewDocument,
    sendEmail,
    deleteDocument,
    
    // Selection actions
    toggleSelectDocument,
    selectAllDocuments,
    
    // Bulk actions
    bulkDownload,
    bulkEmail,
    bulkDelete,
    
    // Filtering
    filterDocuments
  };
};
