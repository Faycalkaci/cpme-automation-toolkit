
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Eye, Trash2, Check, File, Download } from 'lucide-react';
import { Template } from './types';
import { SpreadsheetTemplate } from '@/hooks/useSpreadsheetTemplates';

// Define the union type
type TemplateType = Template | SpreadsheetTemplate;

// Type guard function to check if a template is a Template or SpreadsheetTemplate
const isTemplate = (template: TemplateType): template is Template => {
  return 'date' in template && 'documentType' in template;
};

interface TemplateCardProps {
  template: Template;
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
  // Détermine l'icône du document en fonction de son type
  const DocumentIcon = template.documentType === 'pdf' ? FileText : File;
  
  return (
    <Card className={`overflow-hidden ${template.permanent ? 'border-primary/40' : ''}`}>
      <CardHeader className={`${template.permanent ? 'bg-primary/5' : 'bg-slate-50'} pb-4`}>
        <div className="flex justify-between items-start">
          <CardTitle className="flex items-center">
            <DocumentIcon className={`h-5 w-5 mr-2 ${template.documentType === 'pdf' ? 'text-primary' : 'text-blue-600'}`} />
            {template.name}
          </CardTitle>
          {template.permanent && (
            <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full">
              Permanent
            </span>
          )}
        </div>
        <CardDescription className="flex items-center gap-2">
          {template.type === 'facture' ? 'Modèle de facture' : 
           template.type === 'appel' ? 'Modèle d\'appel de cotisation' :
           template.type === 'rappel' ? 'Modèle de rappel' : 'Autre modèle'}
          <span className={`px-2 py-0.5 rounded text-xs ${
            template.documentType === 'pdf' ? 'bg-red-100 text-red-700' :
            'bg-blue-100 text-blue-700'
          }`}>
            {template.documentType === 'pdf' ? 'PDF' : 
             template.documentType === 'doc' ? 'DOC' : 'DOCX'}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="text-sm text-slate-500 mb-3">
          Champs disponibles : {template.fields.length}
        </div>
        <div className="flex flex-wrap gap-2">
          {template.fields.slice(0, 3).map((field, idx) => (
            <div key={idx} className="bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded">
              {field}
            </div>
          ))}
          {template.fields.length > 3 && (
            <div className="bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded">
              +{template.fields.length - 3} autres
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t bg-slate-50 py-3">
        <div className="text-xs text-slate-500">
          {template.savedBy ? `Par ${template.savedBy}` : 'Ajouté le'} {template.date}
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={() => openPreviewDialog(template)}>
            <Eye className="h-4 w-4" />
          </Button>
          {template.fileUrl && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => window.open(template.fileUrl, '_blank')}
              title="Télécharger"
            >
              <Download className="h-4 w-4 text-slate-600" />
            </Button>
          )}
          {!template.permanent && canSaveTemplate && (
            <Button variant="ghost" size="sm" onClick={() => openSaveDialog(template)}>
              <Check className="h-4 w-4 text-green-600" />
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => openDeleteDialog(template)}
          >
            <Trash2 className={`h-4 w-4 text-destructive`} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TemplateCard;
