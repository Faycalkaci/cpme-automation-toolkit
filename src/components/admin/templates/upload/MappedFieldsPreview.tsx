
import React from 'react';
import { Check } from 'lucide-react';
import { DEFAULT_FIELD_MAPPINGS } from '@/services/pdfMappingService';

export const MappedFieldsPreview: React.FC = () => {
  // Get the field names for display
  const defaultFieldNames = DEFAULT_FIELD_MAPPINGS.map(field => field.name);
  
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Champs mappés automatiquement</label>
      <div className="flex flex-wrap gap-1 bg-slate-50 p-2 rounded">
        {defaultFieldNames.map((field) => (
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
