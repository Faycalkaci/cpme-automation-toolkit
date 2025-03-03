
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
    <Card className={`overflow-hidden transition-all duration-300 hover:shadow-card hover:-translate-y-1 ${template.permanent ? 'border-primary/30' : ''}`}>
      <CardHeader className={`${template.permanent ? 'bg-primary/5' : 'bg-slate-50'} pb-4`}>
        <div className="flex justify-between items-start">
          <CardTitle className="flex items-center">
            <div className={`mr-3 h-9 w-9 rounded-full flex items-center justify-center ${template.documentType === 'pdf' ? 'bg-primary/15 text-primary' : 'bg-blue-500/15 text-blue-600'}`}>
              <DocumentIcon className="h-5 w-5" />
            </div>
            <span className="font-medium">{template.name}</span>
          </CardTitle>
          {template.permanent && (
            <span className="bg-primary/15 text-primary text-xs px-2.5 py-1 rounded-full font-medium">
              Permanent
            </span>
          )}
        </div>
        <CardDescription className="flex items-center gap-2 ml-12">
          {template.type === 'facture' ? 'Modèle de facture' : 
           template.type === 'appel' ? 'Modèle d\'appel de cotisation' :
           template.type === 'rappel' ? 'Modèle de rappel' : 'Autre modèle'}
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            template.documentType === 'pdf' ? 'bg-red-100 text-red-700' :
            'bg-blue-100 text-blue-700'
          }`}>
            {template.documentType === 'pdf' ? 'PDF' : 
             template.documentType === 'doc' ? 'DOC' : 'DOCX'}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="text-sm text-slate-500 mb-3 flex items-center">
          <span className="inline-block w-1.5 h-1.5 bg-slate-300 rounded-full mr-2"></span>
          Champs disponibles : {template.fields.length}
        </div>
        <div className="flex flex-wrap gap-2">
          {template.fields.slice(0, 3).map((field, idx) => (
            <div key={idx} className="bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded-full">
              {field}
            </div>
          ))}
          {template.fields.length > 3 && (
            <div className="bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded-full">
              +{template.fields.length - 3} autres
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t bg-slate-50/70 py-3">
        <div className="text-xs text-slate-500">
          {template.savedBy ? `Par ${template.savedBy}` : 'Ajouté le'} {template.date}
        </div>
        <div className="flex space-x-1">
          <Button variant="ghost" size="sm" className="rounded-full" onClick={() => openPreviewDialog(template)} title="Aperçu">
            <Eye className="h-4 w-4" />
          </Button>
          {template.fileUrl && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="rounded-full"
              onClick={() => window.open(template.fileUrl, '_blank')}
              title="Télécharger"
            >
              <Download className="h-4 w-4 text-slate-600" />
            </Button>
          )}
          {!template.permanent && canSaveTemplate && (
            <Button variant="ghost" size="sm" className="rounded-full" onClick={() => openSaveDialog(template)} title="Enregistrer">
              <Check className="h-4 w-4 text-green-600" />
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            className="rounded-full"
            onClick={() => openDeleteDialog(template)}
            disabled={template.permanent && !(template.savedBy === 'system')}
            title="Supprimer"
          >
            <Trash2 className={`h-4 w-4 ${template.permanent ? 'text-slate-400' : 'text-destructive'}`} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TemplateCard;
