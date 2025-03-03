
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface FieldMappingSectionProps {
  mappingFields: string[];
  onAddField: (field: string) => void;
  onRemoveField: (field: string) => void;
}

const FieldMappingSection: React.FC<FieldMappingSectionProps> = ({
  mappingFields,
  onAddField,
  onRemoveField
}) => {
  const [newField, setNewField] = useState('');

  const handleAddField = () => {
    if (newField.trim() && !mappingFields.includes(newField.trim())) {
      onAddField(newField.trim());
      setNewField('');
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        Champs à mapper
      </label>
      <div className="flex space-x-2">
        <Input
          value={newField}
          onChange={(e) => setNewField(e.target.value)}
          placeholder="Nom du champ (ex: DATE ECHEANCE)"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddField();
            }
          }}
        />
        <Button type="button" onClick={handleAddField}>Ajouter</Button>
      </div>
      
      <div className="mt-3 flex flex-wrap gap-2">
        {mappingFields.map((field, index) => (
          <div
            key={index}
            className="bg-slate-100 px-3 py-1 rounded-full text-sm flex items-center"
          >
            <span>{field}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="ml-1 h-5 w-5 p-0"
              onClick={() => onRemoveField(field)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
      
      {mappingFields.length === 0 && (
        <p className="text-xs text-muted-foreground mt-2">
          Ajoutez les noms des champs de vos fichiers Excel que vous souhaitez remplacer dans le PDF.
        </p>
      )}
    </div>
  );
};

export default FieldMappingSection;
