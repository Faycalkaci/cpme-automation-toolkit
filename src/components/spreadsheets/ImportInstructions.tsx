
import React from 'react';

const ImportInstructions: React.FC = () => {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium mb-4">Instructions d'importation</h3>
      <div className="space-y-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
            1
          </div>
          <div>
            <h4 className="font-medium">Préparez votre fichier</h4>
            <p className="text-slate-600 text-sm">
              Assurez-vous que votre fichier Excel ou CSV contient des en-têtes de colonnes clairs pour chaque type de données.
            </p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
            2
          </div>
          <div>
            <h4 className="font-medium">Importez votre fichier</h4>
            <p className="text-slate-600 text-sm">
              Glissez-déposez votre fichier dans la zone ci-dessus ou cliquez pour sélectionner un fichier.
            </p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
            3
          </div>
          <div>
            <h4 className="font-medium">Mappez vos données</h4>
            <p className="text-slate-600 text-sm">
              Une fois importé, vous pourrez associer les colonnes de votre fichier aux champs des modèles de document.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportInstructions;
