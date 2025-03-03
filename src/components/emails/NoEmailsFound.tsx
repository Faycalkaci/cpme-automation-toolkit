
import React from 'react';
import { Mail } from 'lucide-react';

interface NoEmailsFoundProps {
  searchTerm: string;
}

const NoEmailsFound: React.FC<NoEmailsFoundProps> = ({ searchTerm }) => {
  return (
    <div className="p-8 text-center">
      <Mail className="h-10 w-10 text-slate-300 mx-auto mb-2" />
      <h3 className="text-lg font-medium text-slate-900 mb-1">Aucun email trouvé</h3>
      <p className="text-slate-500">
        {searchTerm 
          ? "Aucun email ne correspond à votre recherche." 
          : "Aucun email n'a été envoyé pour le moment."}
      </p>
    </div>
  );
};

export default NoEmailsFound;
