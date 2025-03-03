
import React from 'react';
import TemplateCard from './TemplateCard';
import { Template } from './types';

interface TemplateListProps {
  templates: Template[];
  canSaveTemplate: boolean;
  openDeleteDialog: (template: Template) => void;
  openPreviewDialog: (template: Template) => void;
  openSaveDialog: (template: Template) => void;
}

const TemplateList: React.FC<TemplateListProps> = ({
  templates,
  canSaveTemplate,
  openDeleteDialog,
  openPreviewDialog,
  openSaveDialog,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map(template => (
        <TemplateCard
          key={template.id}
          template={template}
          canSaveTemplate={canSaveTemplate}
          openDeleteDialog={openDeleteDialog}
          openPreviewDialog={openPreviewDialog}
          openSaveDialog={openSaveDialog}
        />
      ))}
    </div>
  );
};

export default TemplateList;
