
import React from 'react';
import { Template } from '@/components/admin/templates/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SpreadsheetTemplate } from '@/hooks/useSpreadsheetTemplates';

interface TemplateSelectorProps {
  templates: SpreadsheetTemplate[];
  selectedTemplate: string;
  setSelectedTemplate: (value: string) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  templates,
  selectedTemplate,
  setSelectedTemplate,
}) => {
  return (
    <div>
      <label className="text-sm font-medium">Modèle de document</label>
      <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
        <SelectTrigger>
          <SelectValue placeholder="Sélectionnez un modèle" />
        </SelectTrigger>
        <SelectContent>
          {templates.map(template => (
            <SelectItem key={template.id} value={template.id}>
              {template.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TemplateSelector;
