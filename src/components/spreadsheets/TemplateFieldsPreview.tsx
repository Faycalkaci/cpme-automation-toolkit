
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
    <div className="mt-6 p-5 bg-white rounded-xl border border-slate-100 shadow-subtle">
      <h4 className="text-sm font-medium mb-4 text-slate-700">
        Champs à mapper pour "{template.name}"
      </h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {fieldsToDisplay.map((field, index) => (
          <div 
            key={index} 
            className="text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-center hover:border-primary/30 hover:shadow-subtle transition-all duration-200"
          >
            <span className="bg-primary/10 text-primary text-[10px] px-1.5 py-0.5 rounded mr-2 font-mono">{`{{${field}}}`}</span>
            <span className="truncate text-slate-600">{field}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateFieldsPreview;
