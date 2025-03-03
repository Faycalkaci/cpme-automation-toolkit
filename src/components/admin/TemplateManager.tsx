
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileUp, Eye, Trash2, Check, X, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

type Template = {
  id: string;
  name: string;
  type: 'facture' | 'appel' | 'rappel' | 'autre';
  date: string;
  fields: string[];
  fileUrl: string;
};

const TemplateManager: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: '1',
      name: 'Appel de cotisation',
      type: 'appel',
      date: '2023-06-15',
      fields: ['Entreprise', 'Adresse', 'Code Postal', 'Ville', 'Email', 'Montant'],
      fileUrl: '/templates/appel-cotisation.pdf'
    },
    {
      id: '2',
      name: 'Facture standard',
      type: 'facture',
      date: '2023-08-20',
      fields: ['Entreprise', 'Adresse', 'Code Postal', 'Ville', 'Email', 'Référence', 'Date', 'Montant HT', 'TVA', 'Total TTC'],
      fileUrl: '/templates/facture.pdf'
    },
    {
      id: '3',
      name: 'Rappel de cotisation',
      type: 'rappel',
      date: '2023-09-05',
      fields: ['Entreprise', 'Adresse', 'Code Postal', 'Ville', 'Email', 'Montant', 'Date échéance'],
      fileUrl: '/templates/rappel-cotisation.pdf'
    }
  ]);
  
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<Template | null>(null);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [templateToPreview, setTemplateToPreview] = useState<Template | null>(null);
  
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateType, setNewTemplateType] = useState<'facture' | 'appel' | 'rappel' | 'autre'>('autre');
  
  const handleUpload = () => {
    const newTemplate: Template = {
      id: Date.now().toString(),
      name: newTemplateName,
      type: newTemplateType,
      date: new Date().toISOString().split('T')[0],
      fields: ['Entreprise', 'Email'], // Default fields, would be extracted from PDF
      fileUrl: `/templates/${newTemplateName.toLowerCase().replace(/\s+/g, '-')}.pdf`
    };
    
    setTemplates([...templates, newTemplate]);
    setShowUploadDialog(false);
    setNewTemplateName('');
    setNewTemplateType('autre');
    
    toast.success('Modèle ajouté avec succès', {
      description: `Le modèle "${newTemplateName}" a été ajouté à votre bibliothèque.`
    });
  };
  
  const handleDeleteTemplate = () => {
    if (templateToDelete) {
      setTemplates(templates.filter(t => t.id !== templateToDelete.id));
      setShowDeleteDialog(false);
      setTemplateToDelete(null);
      
      toast.success('Modèle supprimé', {
        description: `Le modèle "${templateToDelete.name}" a été supprimé.`
      });
    }
  };
  
  const openDeleteDialog = (template: Template) => {
    setTemplateToDelete(template);
    setShowDeleteDialog(true);
  };
  
  const openPreviewDialog = (template: Template) => {
    setTemplateToPreview(template);
    setShowPreviewDialog(true);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des modèles PDF</h2>
        <Button onClick={() => setShowUploadDialog(true)}>
          <FileUp className="mr-2 h-4 w-4" /> Ajouter un modèle
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map(template => (
          <Card key={template.id} className="overflow-hidden">
            <CardHeader className="bg-slate-50 pb-4">
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-primary" />
                {template.name}
              </CardTitle>
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
                Ajouté le {new Date(template.date).toLocaleDateString('fr-FR')}
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" onClick={() => openPreviewDialog(template)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => openDeleteDialog(template)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau modèle</DialogTitle>
            <DialogDescription>
              Téléchargez un fichier PDF qui servira de modèle pour la génération de documents.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="template-name" className="text-sm font-medium">
                Nom du modèle
              </label>
              <Input
                id="template-name"
                placeholder="Ex: Appel de cotisation 2024"
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Type de document</label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={newTemplateType === 'facture' ? 'default' : 'outline'}
                  onClick={() => setNewTemplateType('facture')}
                  className="justify-start"
                >
                  Facture
                </Button>
                <Button
                  type="button"
                  variant={newTemplateType === 'appel' ? 'default' : 'outline'}
                  onClick={() => setNewTemplateType('appel')}
                  className="justify-start"
                >
                  Appel de cotisation
                </Button>
                <Button
                  type="button"
                  variant={newTemplateType === 'rappel' ? 'default' : 'outline'}
                  onClick={() => setNewTemplateType('rappel')}
                  className="justify-start"
                >
                  Rappel
                </Button>
                <Button
                  type="button"
                  variant={newTemplateType === 'autre' ? 'default' : 'outline'}
                  onClick={() => setNewTemplateType('autre')}
                  className="justify-start"
                >
                  Autre
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="template-file" className="text-sm font-medium">
                Fichier PDF
              </label>
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-4">
                <div className="text-center">
                  <FileUp className="h-8 w-8 mx-auto text-slate-400" />
                  <p className="mt-2 text-sm text-slate-600">
                    Glissez-déposez votre fichier PDF ici ou cliquez pour parcourir
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                  >
                    Parcourir
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleUpload} disabled={!newTemplateName}>
              Ajouter le modèle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
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
              <p className="text-sm text-slate-500">
                Type: {templateToDelete.type === 'facture' ? 'Facture' : 
                      templateToDelete.type === 'appel' ? 'Appel de cotisation' :
                      templateToDelete.type === 'rappel' ? 'Rappel de cotisation' : 'Autre'}
              </p>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteTemplate}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Preview Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Aperçu du modèle</DialogTitle>
          </DialogHeader>
          
          {templateToPreview && (
            <div className="py-4">
              <div className="aspect-[3/4] bg-slate-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <FileText className="h-12 w-12 text-slate-400 mx-auto" />
                  <p className="mt-4 text-slate-600">
                    Aperçu non disponible en mode démo
                  </p>
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="font-medium">Champs à mapper :</h3>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {templateToPreview.fields.map((field, idx) => (
                    <div key={idx} className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                      <span className="text-sm">{field}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setShowPreviewDialog(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TemplateManager;
