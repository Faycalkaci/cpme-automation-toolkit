import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { FileText, Download, Search, Eye, Check, Upload } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface Template {
  id: string;
  name: string;
  description: string;
  type: 'appel' | 'rappel' | 'facture';
  thumbnailUrl: string;
  fields: string[];
  createdAt: string;
}

const mockTemplates: Template[] = [
  {
    id: '1',
    name: 'Appel de cotisation standard',
    description: 'Template standard pour les appels de cotisation annuels',
    type: 'appel',
    thumbnailUrl: 'https://via.placeholder.com/600x800?text=Appel+de+Cotisation',
    fields: ['nom', 'adresse', 'montant', 'date', 'référence'],
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Facture CPME',
    description: 'Template de facture officiel CPME',
    type: 'facture',
    thumbnailUrl: 'https://via.placeholder.com/600x800?text=Facture+CPME',
    fields: ['nom', 'adresse', 'montant', 'date', 'référence', 'détails'],
    createdAt: '2024-02-10'
  },
  {
    id: '3',
    name: 'Rappel de cotisation',
    description: 'Template pour les rappels de cotisation',
    type: 'rappel',
    thumbnailUrl: 'https://via.placeholder.com/600x800?text=Rappel+Cotisation',
    fields: ['nom', 'adresse', 'montant', 'date', 'référence', 'échéance'],
    createdAt: '2024-03-05'
  }
];

const Templates = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [templates, setTemplates] = useState<Template[]>(mockTemplates);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    type: 'appel'
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const handleFileDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      toast({
        title: "Format non supporté",
        description: "Veuillez importer un fichier PDF uniquement."
      });
    }
  }, [toast]);
  
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      toast({
        title: "Format non supporté",
        description: "Veuillez importer un fichier PDF uniquement."
      });
    }
  };
  
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };
  
  const handleAddTemplate = () => {
    if (!newTemplate.name) {
      toast({
        title: "Nom requis",
        description: "Veuillez saisir un nom pour le template."
      });
      return;
    }
    
    if (!selectedFile) {
      toast({
        title: "Fichier requis",
        description: "Veuillez sélectionner un fichier PDF."
      });
      return;
    }
    
    const newTemplateId = Date.now().toString();
    const newTemplateObj: Template = {
      id: newTemplateId,
      name: newTemplate.name,
      description: newTemplate.description || `Template ${newTemplate.type}`,
      type: newTemplate.type as 'appel' | 'rappel' | 'facture',
      thumbnailUrl: URL.createObjectURL(selectedFile),
      fields: ['nom', 'adresse', 'montant', 'date', 'référence'],
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setTemplates([...templates, newTemplateObj]);
    setIsEditDialogOpen(false);
    setNewTemplate({
      name: '',
      description: '',
      type: 'appel'
    });
    setSelectedFile(null);
    
    toast({
      title: "Template ajouté",
      description: "Le nouveau template a été ajouté avec succès."
    });
  };
  
  const filteredTemplates = templates.filter(template => {
    const matchesTab = activeTab === 'all' || template.type === activeTab;
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          template.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesTab && matchesSearch;
  });
  
  const handlePreview = (template: Template) => {
    setPreviewTemplate(template);
  };
  
  const handleDownload = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    
    toast({
      title: "Téléchargement du template",
      description: `Le template "${template?.name}" va être téléchargé.`
    });
  };
  
  const handleTemplateSelection = (templateId: string) => {
    toast({
      title: "Template sélectionné",
      description: "Ce template sera utilisé pour la génération de vos documents."
    });
  };
  
  const canEditTemplates = user?.role === 'super-admin' || user?.role === 'admin' || user?.role === 'user';
  
  return (
    <div className="p-6 lg:p-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Templates de documents</h1>
        <p className="text-slate-600 mb-6">
          Consultez et utilisez les templates disponibles pour vos documents
        </p>
        
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle>Bibliothèque de templates</CardTitle>
                <CardDescription>
                  {templates.length} templates disponibles
                </CardDescription>
              </div>
              
              {canEditTemplates && (
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>Ajouter un template</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Ajouter un nouveau template</DialogTitle>
                      <DialogDescription>
                        Créez ou importez un nouveau template PDF pour votre organisation.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="template-name">Nom du template</Label>
                        <Input 
                          id="template-name" 
                          placeholder="Nom du template" 
                          value={newTemplate.name}
                          onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="template-description">Description (optionnelle)</Label>
                        <Input 
                          id="template-description" 
                          placeholder="Description du template" 
                          value={newTemplate.description}
                          onChange={(e) => setNewTemplate({...newTemplate, description: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="template-type">Type de document</Label>
                        <Select 
                          value={newTemplate.type}
                          onValueChange={(value) => setNewTemplate({...newTemplate, type: value})}
                        >
                          <SelectTrigger id="template-type">
                            <SelectValue placeholder="Sélectionner un type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="appel">Appel de cotisation</SelectItem>
                            <SelectItem value="rappel">Rappel de cotisation</SelectItem>
                            <SelectItem value="facture">Facture</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="template-file">Fichier PDF</Label>
                        <div 
                          className={`border-2 border-dashed border-slate-200 rounded-md p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer ${selectedFile ? 'border-primary bg-primary/5' : ''}`}
                          onDrop={handleFileDrop}
                          onDragOver={handleDragOver}
                        >
                          {selectedFile ? (
                            <div className="flex flex-col items-center">
                              <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
                              <p className="text-sm text-slate-600 mb-2">{selectedFile.name}</p>
                              <p className="text-xs text-slate-500">
                                {Math.round(selectedFile.size / 1024)} Ko
                              </p>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="mt-2"
                                onClick={() => setSelectedFile(null)}
                              >
                                Supprimer
                              </Button>
                            </div>
                          ) : (
                            <>
                              <FileText className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                              <p className="text-sm text-slate-600 mb-2">Glissez-déposez votre fichier PDF ici</p>
                              <p className="text-xs text-slate-500 mb-4">ou</p>
                              <Button size="sm" asChild>
                                <label>
                                  <Upload className="h-4 w-4 mr-2" />
                                  Parcourir
                                  <input
                                    type="file"
                                    id="template-file"
                                    accept=".pdf"
                                    className="hidden"
                                    onChange={handleFileSelect}
                                  />
                                </label>
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => {
                        setIsEditDialogOpen(false);
                        setSelectedFile(null);
                      }}>
                        Annuler
                      </Button>
                      <Button 
                        type="button" 
                        onClick={handleAddTemplate}
                        disabled={!newTemplate.name || !selectedFile}
                      >
                        Ajouter
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4">
              <div className="relative w-full sm:w-auto sm:flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Rechercher un template..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Tabs defaultValue="all" className="w-full sm:w-auto" onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">Tous</TabsTrigger>
                  <TabsTrigger value="appel">Appels</TabsTrigger>
                  <TabsTrigger value="facture">Factures</TabsTrigger>
                  <TabsTrigger value="rappel">Rappels</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.length > 0 ? (
                filteredTemplates.map((template) => (
                  <Card key={template.id} className="overflow-hidden border hover:shadow-md transition-shadow">
                    <div className="aspect-[3/4] relative bg-slate-100">
                      <img
                        src={template.thumbnailUrl}
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/50 transition-opacity">
                        <Button variant="secondary" size="sm" className="mr-2" onClick={() => handlePreview(template)}>
                          <Eye className="h-4 w-4 mr-1" />
                          Aperçu
                        </Button>
                        <Button variant="secondary" size="sm" onClick={() => handleDownload(template.id)}>
                          <Download className="h-4 w-4 mr-1" />
                          Télécharger
                        </Button>
                      </div>
                    </div>
                    <CardHeader className="py-3 px-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">{template.name}</CardTitle>
                          <CardDescription className="text-xs mt-1">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mr-2 ${
                              template.type === 'appel' ? 'bg-blue-100 text-blue-800' :
                              template.type === 'rappel' ? 'bg-amber-100 text-amber-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {template.type === 'appel' ? 'Appel' : 
                               template.type === 'rappel' ? 'Rappel' : 'Facture'}
                            </span>
                            Créé le {template.createdAt}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="py-2 px-4">
                      <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                        {template.description}
                      </p>
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="w-full"
                        onClick={() => handleTemplateSelection(template.id)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Utiliser ce template
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-1">Aucun template trouvé</h3>
                  <p className="text-slate-500">
                    {searchTerm 
                      ? "Aucun template ne correspond à votre recherche." 
                      : "Aucun template disponible pour cette catégorie."}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {previewTemplate && (
          <Dialog open={!!previewTemplate} onOpenChange={(open) => !open && setPreviewTemplate(null)}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>{previewTemplate.name}</DialogTitle>
                <DialogDescription>
                  {previewTemplate.description}
                </DialogDescription>
              </DialogHeader>
              
              <div className="mt-4 flex flex-col md:flex-row gap-6">
                <div className="md:w-2/3">
                  <div className="border rounded-md overflow-hidden">
                    <img
                      src={previewTemplate.thumbnailUrl}
                      alt={previewTemplate.name}
                      className="w-full h-auto"
                    />
                  </div>
                </div>
                
                <div className="md:w-1/3">
                  <h4 className="font-medium text-sm mb-2">Champs disponibles :</h4>
                  <ul className="space-y-1 text-sm">
                    {previewTemplate.fields.map((field, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="h-3 w-3 text-green-500 mr-2" />
                        {field}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-6 space-y-3">
                    <Button className="w-full" onClick={() => handleTemplateSelection(previewTemplate.id)}>
                      Utiliser ce template
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => handleDownload(previewTemplate.id)}>
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger
                    </Button>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setPreviewTemplate(null)}>
                  Fermer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </motion.div>
    </div>
  );
};

export default Templates;
