
import React from 'react';
import { Check } from 'lucide-react';

interface MappedFieldsDisplayProps {
  fieldNames: string[];
}

const MappedFieldsDisplay: React.FC<MappedFieldsDisplayProps> = ({ fieldNames }) => {
  return (
    <div className="space-y-2 border-t pt-4">
      <label className="text-sm font-medium">Champs mappés automatiquement</label>
      <div className="flex flex-wrap gap-1 bg-slate-50 p-2 rounded">
        {fieldNames.map((field) => (
          <div key={field} className="bg-slate-200 px-2 py-1 rounded text-xs text-slate-700 flex items-center">
            <Check className="h-3 w-3 mr-1 text-green-600" />
            {field}
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-500">
        Ces champs seront automatiquement mappés avec votre fichier CSV/Excel importé.
      </p>
    </div>
  );
};

export default MappedFieldsDisplay;
