
import React, { useState } from 'react';
import { FileText, Download, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useTemplates } from '@/hooks/useTemplates';
import { Template } from '@/components/admin/templates/types';

const Templates = () => {
  const [templateToDelete, setTemplateToDelete] = useState<Template | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'super-admin';
  
  // Use the new useTemplates hook - set isAdmin to false to get only shared templates
  const { templates, isLoading, deleteTemplate } = useTemplates(false);

  // Delete a template
  const handleDeleteTemplate = async () => {
    if (!templateToDelete) return;
    
    try {
      await deleteTemplate(templateToDelete.id);
      setShowDeleteDialog(false);
      setTemplateToDelete(null);
      toast.success('Modèle supprimé avec succès');
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Erreur lors de la suppression du modèle');
    }
  };

  const openDeleteDialog = (template: Template) => {
    setTemplateToDelete(template);
    setShowDeleteDialog(true);
  };

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Modèles de documents</h1>
          <p className="text-muted-foreground mt-1">
            Consultez les modèles de documents disponibles pour générer vos PDF
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : templates.length === 0 ? (
        <div className="border border-dashed rounded-lg p-12 text-center space-y-4">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="text-lg font-medium">Aucun modèle disponible</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Les modèles de documents sont créés par l'administrateur du système dans la section Administration.
          </p>
        </div>
      ) : (
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
                    {template.fields?.length || 0} champs mappés
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(template.fields || []).slice(0, 5).map((field: string, index: number) => (
                      <span key={index} className="text-xs bg-slate-100 px-2 py-1 rounded">
                        {field}
                      </span>
                    ))}
                    {(template.fields?.length || 0) > 5 && (
                      <span className="text-xs bg-slate-100 px-2 py-1 rounded">
                        +{(template.fields?.length || 0) - 5}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <Button variant="ghost" size="sm" onClick={() => template.fileUrl && window.open(template.fileUrl, '_blank')}>
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger
                    </Button>
                    {isSuperAdmin && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => openDeleteDialog(template)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Delete Template Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce modèle ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          
          {templateToDelete && (
            <div className="py-4">
              <p className="font-medium">{templateToDelete.name}</p>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Annuler
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteTemplate}
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Super Admin Controls */}
      {isSuperAdmin && (
        <div className="mt-8 p-4 border rounded-lg bg-slate-50">
          <h2 className="text-lg font-medium mb-2">Contrôles administrateur</h2>
          <p className="text-sm text-slate-600 mb-4">
            Pour ajouter de nouveaux modèles, utilisez la section "Modèles PDF" dans l'Administration.
          </p>
        </div>
      )}
    </div>
  );
};

export default Templates;
