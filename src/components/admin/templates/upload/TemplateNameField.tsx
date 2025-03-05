
import React from 'react';
import { Input } from '@/components/ui/input';

interface TemplateNameFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export const TemplateNameField: React.FC<TemplateNameFieldProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <label htmlFor="template-name" className="text-sm font-medium">
        Nom du modèle
      </label>
      <Input
        id="template-name"
        placeholder="Ex: Appel de cotisation 2024"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};
