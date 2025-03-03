
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Eye, Trash2, Check, File, Download } from 'lucide-react';
import { Template } from './types';
import { SpreadsheetTemplate } from '@/hooks/useSpreadsheetTemplates';

// Define the union type
type TemplateType = Template | SpreadsheetTemplate;

interface TemplateCardProps {
  template: TemplateType;
  canSaveTemplate: boolean;
  openDeleteDialog: (template: Template) => void;
  openPreviewDialog: (template: TemplateType) => void;
  openSaveDialog: (template: Template) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  canSaveTemplate,
  openDeleteDialog,
  openPreviewDialog,
  openSaveDialog,
}) => {
  // Helper function to check if template is of type Template
  const isTemplate = (template: TemplateType): template is Template => {
    return 'documentType' in template;
  };

  // Determine document icon based on its type
  const DocumentIcon = isTemplate(template) && template.documentType === 'pdf' ? FileText : File;
  
  // Only call functions expecting Template type if we have a Template
  const handleDelete = () => {
    if (isTemplate(template)) {
      openDeleteDialog(template);
    }
  };
  
  const handleSave = () => {
    if (isTemplate(template)) {
      openSaveDialog(template);
    }
  };

  // Safely get values with type guards
  const isPermanent = isTemplate(template) && template.permanent;
  const documentType = isTemplate(template) ? template.documentType : 'pdf';
  const type = isTemplate(template) ? template.type : (template.type || 'autre');
  const savedBy = isTemplate(template) ? template.savedBy : undefined;
  const fileUrl = template.fileUrl || '';
  
  // Get fields with fallbacks
  const fields = isTemplate(template) 
    ? template.fields 
    : (template.mappingFields || []);
    
  // Get date in a consistent format
  const date = isTemplate(template) 
    ? template.date 
    : (template.createdAt ? template.createdAt.toISOString() : new Date().toISOString());
  
  return (
    <Card className={`overflow-hidden ${isPermanent ? 'border-primary/40' : ''}`}>
      <CardHeader className={`${isPermanent ? 'bg-primary/5' : 'bg-slate-50'} pb-4`}>
        <div className="flex justify-between items-start">
          <CardTitle className="flex items-center">
            <DocumentIcon className={`h-5 w-5 mr-2 ${documentType === 'pdf' ? 'text-primary' : 'text-blue-600'}`} />
            {template.name}
          </CardTitle>
          {isPermanent && (
            <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full">
              Permanent
            </span>
          )}
        </div>
        <CardDescription className="flex items-center gap-2">
          {type === 'facture' ? 'Modèle de facture' : 
           type === 'appel' ? 'Modèle d\'appel de cotisation' :
           type === 'rappel' ? 'Modèle de rappel' : 'Autre modèle'}
          {isTemplate(template) && (
            <span className={`px-2 py-0.5 rounded text-xs ${
              documentType === 'pdf' ? 'bg-red-100 text-red-700' :
              'bg-blue-100 text-blue-700'
            }`}>
              {documentType === 'pdf' ? 'PDF' : 
              documentType === 'doc' ? 'DOC' : 'DOCX'}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="text-sm text-slate-500 mb-3">
          Champs disponibles : {fields.length}
        </div>
        <div className="flex flex-wrap gap-2">
          {fields.slice(0, 3).map((field, idx) => (
            <div key={idx} className="bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded">
              {field}
            </div>
          ))}
          {fields.length > 3 && (
            <div className="bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded">
              +{fields.length - 3} autres
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t bg-slate-50 py-3">
        <div className="text-xs text-slate-500">
          {savedBy ? `Par ${savedBy}` : 'Ajouté le'} {new Date(date).toLocaleDateString('fr-FR')}
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={() => openPreviewDialog(template)}>
            <Eye className="h-4 w-4" />
          </Button>
          {fileUrl && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => window.open(fileUrl, '_blank')}
              title="Télécharger"
            >
              <Download className="h-4 w-4 text-slate-600" />
            </Button>
          )}
          {isTemplate(template) && !isPermanent && canSaveTemplate && (
            <Button variant="ghost" size="sm" onClick={handleSave}>
              <Check className="h-4 w-4 text-green-600" />
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleDelete}
            disabled={isPermanent && !(savedBy === 'system')}
          >
            <Trash2 className={`h-4 w-4 ${isPermanent ? 'text-slate-400' : 'text-destructive'}`} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TemplateCard;
