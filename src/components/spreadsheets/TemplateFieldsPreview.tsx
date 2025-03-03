
import React from 'react';
import { SpreadsheetTemplate } from '@/hooks/useSpreadsheetTemplates';
import { DEFAULT_FIELD_MAPPINGS } from '@/services/pdfMappingService';
import { Badge } from '@/components/ui/badge';

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
    <div className="mt-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
      <h4 className="text-sm font-medium mb-3 text-slate-700 flex items-center">
        <span className="inline-block w-2 h-2 bg-primary rounded-full mr-2"></span>
        Champs à mapper pour "{template.name}"
      </h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {fieldsToDisplay.map((field, index) => (
          <div key={index} className="text-xs bg-slate-50 p-2 rounded-lg border border-slate-100 flex items-center group hover:border-primary/40 hover:bg-slate-50/80 transition-all">
            <Badge variant="outline" className="bg-primary/10 text-primary border-0 text-[10px] px-1.5 py-0.5 mr-1.5">{`{{${field}}}`}</Badge>
            <span className="truncate text-slate-700 group-hover:text-slate-900">{field}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateFieldsPreview;
