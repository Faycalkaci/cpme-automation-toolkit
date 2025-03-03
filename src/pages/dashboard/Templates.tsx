
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { templateStorage, Template } from '@/services/templateStorage';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import AdminTemplateList from '@/components/admin/templates/AdminTemplateList';
import AddTemplateDialog from '@/components/admin/templates/AddTemplateDialog';
import SuperAdminControls from '@/components/admin/templates/SuperAdminControls';
import TemplateHeader from '@/components/admin/templates/TemplateHeader';

const Templates = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'super-admin';

  // Load templates from storage on component mount
  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const storedTemplates = await templateStorage.getTemplates();
      setTemplates(storedTemplates);
    } catch (error) {
      console.error('Error loading templates:', error);
      toast.error('Erreur lors du chargement des modèles');
    }
  };

  // Save the new template
  const saveTemplate = async (templateData: {
    name: string;
    file: File;
    mappingFields: string[];
  }) => {
    try {
      // Create a complete template object
      const completeTemplate: Template = {
        id: `template-${Date.now()}`,
        name: templateData.name,
        file: templateData.file,
        previewUrl: URL.createObjectURL(templateData.file),
        mappingFields: templateData.mappingFields,
        createdAt: new Date(),
        createdBy: user?.id
      };

      // Save to storage
      await templateStorage.saveTemplate(completeTemplate);
      
      // Update the local state
      setTemplates([...templates, completeTemplate]);
      
      // Close the dialog
      setShowAddDialog(false);
      
      toast.success('Modèle ajouté avec succès');
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Erreur lors de la sauvegarde du modèle');
    }
  };

  // Delete a template
  const deleteTemplate = async (templateId: string) => {
    try {
      await templateStorage.deleteTemplate(templateId);
      setTemplates(templates.filter(t => t.id !== templateId));
      toast.success('Modèle supprimé avec succès');
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Erreur lors de la suppression du modèle');
    }
  };

  // Clear all templates (admin only)
  const clearTemplates = async () => {
    try {
      await templateStorage.clearTemplates();
      setTemplates([]);
    } catch (error) {
      console.error('Error clearing templates:', error);
      toast.error('Erreur lors de la suppression des modèles');
    }
  };

  // Add a custom event listener for the "Add Template" button in empty state
  useEffect(() => {
    const handleOpenAddDialog = () => setShowAddDialog(true);
    window.addEventListener('open-add-template-dialog', handleOpenAddDialog);
    
    return () => {
      window.removeEventListener('open-add-template-dialog', handleOpenAddDialog);
    };
  }, []);

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Modèles de documents</h1>
          <p className="text-muted-foreground mt-1">
            Gérez les modèles de documents utilisés pour générer vos PDF
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un modèle
        </Button>
      </div>

      <AdminTemplateList 
        templates={templates} 
        onDeleteTemplate={deleteTemplate} 
      />

      <AddTemplateDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSaveTemplate={saveTemplate}
      />

      {/* Super Admin Controls (only shown for super admin users) */}
      {isSuperAdmin && (
        <SuperAdminControls onClearTemplates={clearTemplates} />
      )}
    </div>
  );
};

export default Templates;
