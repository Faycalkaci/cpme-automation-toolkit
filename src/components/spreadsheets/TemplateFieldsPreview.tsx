
import React from 'react';
import { SpreadsheetTemplate } from '@/hooks/useSpreadsheetTemplates';
import { DEFAULT_FIELD_MAPPINGS } from '@/services/pdfMappingService';

interface TemplateFieldsPreviewProps {
  templateId: string;
  templates: SpreadsheetTemplate[];
}

const TemplateFieldsPreview: React.FC<TemplateFieldsPreviewProps> = ({
  templateId,
  templates,
}) => {
  const template = templates.find(t => t.id === templateId);
  
  if (!template) {
    return null;
  }
  
  // Use the template's mapping fields or fall back to default fields
  const fieldsToDisplay = template.mappingFields && template.mappingFields.length > 0 
    ? template.mappingFields 
    : DEFAULT_FIELD_MAPPINGS.map(f => f.name);

  return (
    <div className="mt-4 p-3 bg-slate-50 rounded-md border border-slate-200">
      <h4 className="text-sm font-medium mb-2">
        Champs à mapper pour "{template.name}"
      </h4>
      <div className="grid grid-cols-2 gap-2">
        {fieldsToDisplay.map((field, index) => (
          <div key={index} className="text-xs bg-white p-2 rounded border border-slate-100 flex items-center">
            <span className="bg-primary/10 text-primary text-[10px] px-1 rounded mr-1">{`{{${field}}}`}</span>
            <span className="truncate">{field}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateFieldsPreview;
