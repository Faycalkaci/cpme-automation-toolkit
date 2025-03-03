
import React from 'react';
import { SpreadsheetTemplate } from '@/hooks/useSpreadsheetTemplates';

interface TemplateFieldsPreviewProps {
  templateId: string;
  templates: SpreadsheetTemplate[];
}

const TemplateFieldsPreview: React.FC<TemplateFieldsPreviewProps> = ({
  templateId,
  templates,
}) => {
  // Only show the fields preview for "appel" template or any template with mappingFields
  const template = templates.find(t => t.id === templateId);
  
  if (!template || !template.mappingFields || template.mappingFields.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 p-3 bg-slate-50 rounded-md border border-slate-200">
      <h4 className="text-sm font-medium mb-2">
        Champs à mapper pour "{template.name}"
      </h4>
      <div className="grid grid-cols-2 gap-2">
        {template.mappingFields.map((field, index) => (
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
