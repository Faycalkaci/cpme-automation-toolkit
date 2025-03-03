
import React, { useState } from 'react';
import TemplateCard from './TemplateCard';
import { Template } from './types';
import { SpreadsheetTemplate } from '@/hooks/useSpreadsheetTemplates';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, File, Filter, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

// Define the union type
type TemplateType = Template | SpreadsheetTemplate;

interface TemplateListProps {
  templates: Template[];
  canSaveTemplate: boolean;
  openDeleteDialog: (template: Template) => void;
  openPreviewDialog: (template: TemplateType) => void;
  openSaveDialog: (template: Template) => void;
}

const TemplateList: React.FC<TemplateListProps> = ({
  templates,
  canSaveTemplate,
  openDeleteDialog,
  openPreviewDialog,
  openSaveDialog,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'pdf' | 'word'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  
  // Helper function to check if a template is of type Template
  const isTemplate = (template: any): template is Template => {
    return 'documentType' in template;
  };
  
  const filteredTemplates = templates.filter(template => {
    if (activeTab === 'pdf' && isTemplate(template) && template.documentType !== 'pdf') {
      return false;
    }
    if (activeTab === 'word' && isTemplate(template) && 
        !['doc', 'docx'].includes(template.documentType || '')) {
      return false;
    }
    
    if (typeFilter !== 'all' && template.type !== typeFilter) {
      return false;
    }
    
    return true;
  });
  
  // Count PDF templates
  const pdfCount = templates.filter(t => isTemplate(t) && t.documentType === 'pdf').length;
  
  // Count Word templates
  const wordCount = templates.filter(t => 
    isTemplate(t) && ['doc', 'docx'].includes(t.documentType || '')
  ).length;
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Tabs defaultValue="all" value={activeTab} onValueChange={(value) => setActiveTab(value as 'all' | 'pdf' | 'word')} className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="all" className="flex items-center">
              Tous <Badge variant="outline" className="ml-2">{templates.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="pdf" className="flex items-center">
              <FileText className="h-4 w-4 mr-1" /> PDF
              <Badge variant="outline" className="ml-2">{pdfCount}</Badge>
            </TabsTrigger>
            <TabsTrigger value="word" className="flex items-center">
              <File className="h-4 w-4 mr-1" /> Word
              <Badge variant="outline" className="ml-2">{wordCount}</Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Type de document" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="facture">Factures</SelectItem>
              <SelectItem value="appel">Appels de cotisation</SelectItem>
              <SelectItem value="rappel">Rappels</SelectItem>
              <SelectItem value="autre">Autres</SelectItem>
            </SelectContent>
          </Select>
          
          {typeFilter !== 'all' && (
            <Button variant="ghost" size="icon" onClick={() => setTypeFilter('all')}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {filteredTemplates.length === 0 ? (
        <div className="border border-dashed rounded-lg p-12 text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
            {activeTab === 'pdf' ? (
              <FileText className="h-6 w-6 text-slate-400" />
            ) : activeTab === 'word' ? (
              <File className="h-6 w-6 text-slate-400" />
            ) : (
              <Filter className="h-6 w-6 text-slate-400" />
            )}
          </div>
          <h3 className="text-lg font-medium">Aucun modèle trouvé</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            {activeTab === 'all' 
              ? 'Aucun modèle ne correspond aux critères de filtrage actuels.'
              : activeTab === 'pdf' 
                ? 'Aucun modèle PDF ne correspond aux critères de filtrage actuels.'
                : 'Aucun modèle Word ne correspond aux critères de filtrage actuels.'
            }
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
