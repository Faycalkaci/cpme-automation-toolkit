
import React, { useState, useEffect } from 'react';
import { FileText, Download, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { templateStorage } from '@/services/templateStorage';

const Templates = () => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [templateToDelete, setTemplateToDelete] = useState<any | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'super-admin';

  // Load templates from storage on component mount
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        // Seulement charger les templates partagés (pas les templates d'administration)
        const storedTemplates = await templateStorage.getTemplates(false);
        setTemplates(storedTemplates);
      } catch (error) {
        console.error('Error loading templates:', error);
        toast.error('Erreur lors du chargement des modèles');
      }
    };
    
    loadTemplates();
  }, []);

  // Delete a template
  const deleteTemplate = async (templateId: string) => {
    try {
      await templateStorage.deleteTemplate(templateId, false);
      setTemplates(templates.filter(t => t.id !== templateId));
      setShowDeleteDialog(false);
      setTemplateToDelete(null);
      toast.success('Modèle supprimé avec succès');
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Erreur lors de la suppression du modèle');
    }
  };

  const openDeleteDialog = (template: any) => {
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
        {/* Le bouton d'ajout a été retiré comme demandé */}
      </div>

      {templates.length === 0 ? (
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
                    {template.fields?.length || template.mappingFields?.length || 0} champs mappés
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(template.fields || template.mappingFields || []).slice(0, 5).map((field: string, index: number) => (
                      <span key={index} className="text-xs bg-slate-100 px-2 py-1 rounded">
                        {field}
                      </span>
                    ))}
                    {(template.fields?.length || template.mappingFields?.length || 0) > 5 && (
                      <span className="text-xs bg-slate-100 px-2 py-1 rounded">
                        +{(template.fields?.length || template.mappingFields?.length || 0) - 5}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <Button variant="ghost" size="sm">
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
              onClick={() => templateToDelete && deleteTemplate(templateToDelete.id)}
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
          <div className="flex space-x-2">
            <Button 
              variant="destructive" 
              onClick={async () => {
                if (confirm('Êtes-vous sûr de vouloir supprimer tous les modèles ? Cette action est irréversible.')) {
                  await templateStorage.clearTemplates(false);
                  setTemplates([]);
                  toast.success('Tous les modèles ont été supprimés');
                }
              }}
            >
              Supprimer tous les modèles
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Templates;
