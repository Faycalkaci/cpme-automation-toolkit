
import React from 'react';
import { FileText } from 'lucide-react';

interface NoDocumentsFoundProps {
  searchTerm: string;
}

const NoDocumentsFound: React.FC<NoDocumentsFoundProps> = ({ searchTerm }) => {
  return (
    <div className="p-8 text-center">
      <FileText className="h-10 w-10 text-slate-300 mx-auto mb-2" />
      <h3 className="text-lg font-medium text-slate-900 mb-1">Aucun document trouvé</h3>
      <p className="text-slate-500">
        {searchTerm 
          ? "Aucun document ne correspond à votre recherche." 
          : "Générez des documents à partir de vos données pour les voir apparaître ici."}
      </p>
    </div>
  );
};

export default NoDocumentsFound;
