
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Eye, Trash2, Check, File } from 'lucide-react';
import { Template } from './types';

interface TemplateCardProps {
  template: Template;
  canSaveTemplate: boolean;
  openDeleteDialog: (template: Template) => void;
  openPreviewDialog: (template: Template) => void;
  openSaveDialog: (template: Template) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  canSaveTemplate,
  openDeleteDialog,
  openPreviewDialog,
  openSaveDialog,
}) => {
  // Determine which icon to show based on the document type
  const getDocIcon = () => {
    switch (template.documentType) {
      case 'pdf':
        return <FileText className="h-5 w-5 mr-2 text-primary" />;
      case 'doc':
      case 'docx':
        return <File className="h-5 w-5 mr-2 text-blue-500" />;
      default:
        return <FileText className="h-5 w-5 mr-2 text-primary" />;
    }
  };

  // Get document type display text
  const getDocTypeText = () => {
    switch (template.documentType) {
      case 'pdf':
        return 'PDF';
      case 'doc':
        return 'DOC';
      case 'docx':
        return 'DOCX';
      default:
        return 'Document';
    }
  };

  return (
    <Card className={`overflow-hidden transition-all hover:shadow-md ${template.permanent ? 'border-primary/40' : ''}`}>
      <CardHeader className={`${template.permanent ? 'bg-primary/5' : 'bg-slate-50'} pb-4`}>
        <div className="flex justify-between items-start">
          <CardTitle className="flex items-center">
            {getDocIcon()}
            {template.name}
          </CardTitle>
          <div className="flex gap-2">
            {template.permanent && (
              <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full">
                Permanent
              </span>
            )}
            <span className={`text-xs px-2 py-1 rounded-full ${
              template.documentType === 'pdf' ? 'bg-red-100 text-red-700' : 
              'bg-blue-100 text-blue-700'
            }`}>
              {getDocTypeText()}
            </span>
          </div>
        </div>
        <CardDescription>
          {template.type === 'facture' ? 'Modèle de facture' : 
           template.type === 'appel' ? 'Modèle d\'appel de cotisation' :
           template.type === 'rappel' ? 'Modèle de rappel' : 'Autre modèle'}
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
          {template.savedBy ? `Par ${template.savedBy}` : 'Ajouté le'} {new Date(template.date).toLocaleDateString('fr-FR')}
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={() => openPreviewDialog(template)}>
            <Eye className="h-4 w-4" />
          </Button>
          {!template.permanent && canSaveTemplate && (
            <Button variant="ghost" size="sm" onClick={() => openSaveDialog(template)}>
              <Check className="h-4 w-4 text-green-600" />
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => openDeleteDialog(template)}
            disabled={template.permanent && !(template.savedBy === 'system')}
          >
            <Trash2 className={`h-4 w-4 ${template.permanent ? 'text-slate-400' : 'text-destructive'}`} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TemplateCard;
