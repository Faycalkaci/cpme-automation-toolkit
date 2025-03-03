import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import DocumentSearch from './DocumentSearch';
import DocumentActions from './DocumentActions';
import DocumentTable from './DocumentTable';
import NoDocumentsFound from './NoDocumentsFound';
import { useDocuments } from './hooks/useDocuments';

const DocumentsContainer: React.FC = () => {
  const {
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
    toggleSelectDocument,
    selectAllDocuments,
    bulkDownload,
    bulkEmail,
    bulkDelete,
    filterDocuments
  } = useDocuments();

  const filteredDocuments = filterDocuments(documents);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Mes documents</h1>
      <p className="text-slate-600 mb-6">
        Gérez les documents PDF générés à partir de vos données
      </p>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Documents générés</CardTitle>
              <CardDescription>
                {documents.length} document(s) - {selectedDocs.length} sélectionné(s)
              </CardDescription>
            </div>

            <DocumentActions 
              selectedDocsCount={selectedDocs.length}
              onBulkDownload={() => bulkDownload(filteredDocuments)}
              onBulkEmail={bulkEmail}
              onBulkDelete={bulkDelete}
            />
          </div>

          <DocumentSearch 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <span className="ml-2 text-lg text-slate-600">Chargement des documents...</span>
            </div>
          ) : filteredDocuments.length > 0 ? (
            <DocumentTable 
              documents={filteredDocuments}
              selectedDocs={selectedDocs}
              toggleSelectDocument={toggleSelectDocument}
              selectAllDocuments={() => selectAllDocuments(filteredDocuments)}
              onViewDocument={viewDocument}
              onDownloadDocument={downloadDocument}
              onSendEmail={sendEmail}
            />
          ) : (
            <NoDocumentsFound searchTerm={searchTerm} />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DocumentsContainer;
