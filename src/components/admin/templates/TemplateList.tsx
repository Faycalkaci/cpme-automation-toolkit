
import React, { useState } from 'react';
import TemplateCard from './TemplateCard';
import { Template } from './types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FileText, File, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
  const [activeTab, setActiveTab] = useState<string>('all');
  const [activeDocFilter, setActiveDocFilter] = useState<string>('all');
  
  // Filter templates based on active tab and document type filter
  const filteredTemplates = templates.filter(template => {
    const typeMatch = activeTab === 'all' || template.type === activeTab;
    const docTypeMatch = activeDocFilter === 'all' || template.documentType === activeDocFilter;
    return typeMatch && docTypeMatch;
  });
  
  // Count templates by type
  const countByType = {
    all: templates.length,
    facture: templates.filter(t => t.type === 'facture').length,
    appel: templates.filter(t => t.type === 'appel').length,
    rappel: templates.filter(t => t.type === 'rappel').length,
    autre: templates.filter(t => t.type === 'autre').length,
  };
  
  // Count templates by document type
  const countByDocType = {
    all: templates.length,
    pdf: templates.filter(t => t.documentType === 'pdf').length,
    doc: templates.filter(t => t.documentType === 'doc').length,
    docx: templates.filter(t => t.documentType === 'docx').length,
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <Tabs 
          defaultValue="all" 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full sm:w-auto"
        >
          <TabsList className="grid grid-cols-5 w-full sm:w-auto">
            <TabsTrigger value="all" className="relative">
              Tous
              <Badge variant="secondary" className="ml-1 text-xs">{countByType.all}</Badge>
            </TabsTrigger>
            <TabsTrigger value="facture" className="relative">
              Factures
              <Badge variant="secondary" className="ml-1 text-xs">{countByType.facture}</Badge>
            </TabsTrigger>
            <TabsTrigger value="appel" className="relative">
              Appels
              <Badge variant="secondary" className="ml-1 text-xs">{countByType.appel}</Badge>
            </TabsTrigger>
            <TabsTrigger value="rappel" className="relative">
              Rappels
              <Badge variant="secondary" className="ml-1 text-xs">{countByType.rappel}</Badge>
            </TabsTrigger>
            <TabsTrigger value="autre" className="relative">
              Autres
              <Badge variant="secondary" className="ml-1 text-xs">{countByType.autre}</Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setActiveDocFilter('all')}
            className={activeDocFilter === 'all' ? 'bg-primary/10' : ''}
          >
            <Filter className="h-4 w-4 mr-1" />
            Tous
            <Badge variant="secondary" className="ml-1 text-xs">{countByDocType.all}</Badge>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setActiveDocFilter('pdf')}
            className={activeDocFilter === 'pdf' ? 'bg-primary/10' : ''}
          >
            <FileText className="h-4 w-4 mr-1" />
            PDF
            <Badge variant="secondary" className="ml-1 text-xs">{countByDocType.pdf}</Badge>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setActiveDocFilter('doc')}
            className={activeDocFilter === 'doc' || activeDocFilter === 'docx' ? 'bg-primary/10' : ''}
          >
            <File className="h-4 w-4 mr-1" />
            DOC
            <Badge variant="secondary" className="ml-1 text-xs">{countByDocType.doc + countByDocType.docx}</Badge>
          </Button>
        </div>
      </div>
      
      {filteredTemplates.length === 0 ? (
        <div className="border border-dashed rounded-lg p-8 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Aucun modèle trouvé</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Aucun modèle ne correspond à vos critères de recherche. 
            Essayez de changer vos filtres ou ajoutez de nouveaux modèles.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map(template => (
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
      )}
    </div>
  );
};

export default TemplateList;
