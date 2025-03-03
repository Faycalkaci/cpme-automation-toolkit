
import React from 'react';
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
      <label className="text-sm font-medium" id="template-selector-label">Modèle de document</label>
      <Select 
        value={selectedTemplate} 
        onValueChange={setSelectedTemplate}
        aria-labelledby="template-selector-label"
      >
        <SelectTrigger aria-label="Sélectionner un modèle de document">
          <SelectValue placeholder="Sélectionnez un modèle" />
        </SelectTrigger>
        <SelectContent>
          {templates.map(template => (
            <SelectItem 
              key={template.id} 
              value={template.id}
              aria-label={`Modèle ${template.name}`}
            >
              {template.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TemplateSelector;
