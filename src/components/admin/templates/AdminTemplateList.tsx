
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Template } from '@/services/templateStorage';

interface AdminTemplateListProps {
  templates: Template[];
  onDeleteTemplate: (templateId: string) => void;
}

const AdminTemplateList: React.FC<AdminTemplateListProps> = ({ 
  templates, 
  onDeleteTemplate 
}) => {
  if (templates.length === 0) {
    return (
      <div className="border border-dashed rounded-lg p-12 text-center space-y-4">
        <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
        <h3 className="text-lg font-medium">Aucun modèle disponible</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Ajoutez des modèles de documents PDF pour pouvoir générer des documents personnalisés à partir de vos données.
        </p>
        <Button variant="outline" onClick={() => window.dispatchEvent(new CustomEvent('open-add-template-dialog'))}>
          <FileText className="h-4 w-4 mr-2" />
          Ajouter un modèle
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence>
        {templates.map((template) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="border rounded-lg overflow-hidden shadow-sm"
          >
            <div className="bg-slate-100 h-48 flex items-center justify-center">
              <FileText className="h-16 w-16 text-slate-400" />
            </div>
            <div className="p-4">
              <h3 className="font-medium text-lg mb-1">{template.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">
                {template.mappingFields.length} champs mappés
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {template.mappingFields.slice(0, 5).map((field, index) => (
                  <span key={index} className="text-xs bg-slate-100 px-2 py-1 rounded">
                    {field}
                  </span>
                ))}
                {template.mappingFields.length > 5 && (
                  <span className="text-xs bg-slate-100 px-2 py-1 rounded">
                    +{template.mappingFields.length - 5}
                  </span>
                )}
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDeleteTemplate(template.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default AdminTemplateList;
