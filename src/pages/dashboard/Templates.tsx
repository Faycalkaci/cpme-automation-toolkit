
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Upload, 
  Plus, 
  Edit, 
  Trash2, 
  FileUp, 
  Check,
  XCircle
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

// Mock template data
const MOCK_TEMPLATES = [
  {
    id: '1',
    name: 'Appel de cotisation',
    fields: ['Raison sociale', 'Adresse', 'Code postal', 'Ville', 'Email', 'Montant'],
    lastUpdated: '15/02/2023',
    type: 'appel',
    status: 'active'
  },
  {
    id: '2',
    name: 'Facture standard',
    fields: ['Raison sociale', 'Adresse', 'Code postal', 'Ville', 'Email', 'Montant', 'Numéro de facture'],
    lastUpdated: '10/02/2023',
    type: 'facture',
    status: 'active'
  },
  {
    id: '3',
    name: 'Rappel de cotisation',
    fields: ['Raison sociale', 'Adresse', 'Code postal', 'Ville', 'Email', 'Montant', 'Date d\'échéance'],
    lastUpdated: '05/02/2023',
    type: 'rappel',
    status: 'active'
  }
];

const Templates = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [templates] = useState(MOCK_TEMPLATES);
  const [isUploading, setIsUploading] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');

  // Check if user is admin or super-admin
  const isAdmin = user?.role === 'admin' || user?.role === 'super-admin';

  if (!isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  const handleTemplateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      if (!file.name.endsWith('.pdf')) {
        toast({
          title: "Format non supporté",
          description: "Veuillez télécharger un fichier PDF.",
          variant: "destructive"
        });
        return;
      }
      
      setIsUploading(true);
      
      // Simulate upload delay
      setTimeout(() => {
        setIsUploading(false);
        toast({
          title: "Template ajouté",
          description: "Le nouveau modèle a été ajouté avec succès."
        });
      }, 1500);
    }
  };

  const addTemplate = () => {
    if (!newTemplateName.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un nom pour le modèle.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Modèle créé",
      description: `Le modèle "${newTemplateName}" a été créé avec succès.`
    });
    
    setNewTemplateName('');
  };

  const editTemplate = (id: string) => {
    toast({
      title: "Modification du modèle",
      description: "L'éditeur de modèle va s'ouvrir."
    });
  };

  const deleteTemplate = (id: string) => {
    toast({
      title: "Modèle supprimé",
      description: "Le modèle a été supprimé avec succès."
    });
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Modèles de documents</h1>
        <p className="text-slate-600 mb-6">
          Gérez les modèles PDF pour la génération de documents
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Left sidebar - Upload new template */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Ajouter un modèle</CardTitle>
              <CardDescription>
                Téléchargez un nouveau modèle PDF
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className="border-2 border-dashed border-slate-200 rounded-md p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-600 mb-2">Glissez-déposez votre PDF ici</p>
                <p className="text-xs text-slate-500 mb-4">ou</p>
                <Button size="sm" asChild disabled={isUploading}>
                  <label>
                    {isUploading ? (
                      <>Téléchargement...</>
                    ) : (
                      <>Parcourir</>
                    )}
                    <input
                      type="file"
                      onChange={handleTemplateUpload}
                      accept=".pdf"
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                </Button>
              </div>

              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="template-name">Nom du modèle</Label>
                  <Input
                    id="template-name"
                    placeholder="Ex: Facture standard"
                    value={newTemplateName}
                    onChange={(e) => setNewTemplateName(e.target.value)}
                  />
                </div>
                
                <Button 
                  className="w-full"
                  onClick={addTemplate}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Créer un modèle
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Main content - Templates list */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Modèles disponibles</CardTitle>
              <CardDescription>
                {templates.length} modèle(s) configuré(s)
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">Tous</TabsTrigger>
                  <TabsTrigger value="appel">Appel de cotisation</TabsTrigger>
                  <TabsTrigger value="facture">Facture</TabsTrigger>
                  <TabsTrigger value="rappel">Rappel</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="mt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {templates.map((template) => (
                      <Card key={template.id} className="overflow-hidden border-slate-200">
                        <div className={`h-2 ${
                          template.type === 'appel' ? 'bg-blue-500' :
                          template.type === 'facture' ? 'bg-green-500' :
                          'bg-amber-500'
                        }`} />
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center">
                              <FileText className={`h-5 w-5 mr-2 ${
                                template.type === 'appel' ? 'text-blue-500' :
                                template.type === 'facture' ? 'text-green-500' :
                                'text-amber-500'
                              }`} />
                              <CardTitle className="text-lg">{template.name}</CardTitle>
                            </div>
                            <div className="flex items-center">
                              {template.status === 'active' ? (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <Check className="h-3 w-3 mr-1" />
                                  Actif
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Inactif
                                </span>
                              )}
                            </div>
                          </div>
                          <CardDescription>
                            Mis à jour le {template.lastUpdated}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="text-sm text-slate-500 mb-2">
                            Champs mappés:
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {template.fields.map((field, index) => (
                              <span 
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700"
                              >
                                {field}
                              </span>
                            ))}
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-slate-700"
                            onClick={() => editTemplate(template.id)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-600"
                            onClick={() => deleteTemplate(template.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="appel" className="mt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {templates.filter(t => t.type === 'appel').map((template) => (
                      <Card key={template.id} className="overflow-hidden border-slate-200">
                        <div className="h-2 bg-blue-500" />
                        {/* ... Same card content as above ... */}
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center">
                              <FileText className="h-5 w-5 mr-2 text-blue-500" />
                              <CardTitle className="text-lg">{template.name}</CardTitle>
                            </div>
                            <div className="flex items-center">
                              {template.status === 'active' ? (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <Check className="h-3 w-3 mr-1" />
                                  Actif
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Inactif
                                </span>
                              )}
                            </div>
                          </div>
                          <CardDescription>
                            Mis à jour le {template.lastUpdated}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="text-sm text-slate-500 mb-2">
                            Champs mappés:
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {template.fields.map((field, index) => (
                              <span 
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700"
                              >
                                {field}
                              </span>
                            ))}
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-slate-700"
                            onClick={() => editTemplate(template.id)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-600"
                            onClick={() => deleteTemplate(template.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                {/* Similar content for other tabs */}
                <TabsContent value="facture" className="mt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {templates.filter(t => t.type === 'facture').map((template) => (
                      <Card key={template.id} className="overflow-hidden border-slate-200">
                        <div className="h-2 bg-green-500" />
                        {/* ... Card content ... */}
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center">
                              <FileText className="h-5 w-5 mr-2 text-green-500" />
                              <CardTitle className="text-lg">{template.name}</CardTitle>
                            </div>
                            <div className="flex items-center">
                              {template.status === 'active' ? (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <Check className="h-3 w-3 mr-1" />
                                  Actif
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Inactif
                                </span>
                              )}
                            </div>
                          </div>
                          <CardDescription>
                            Mis à jour le {template.lastUpdated}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="text-sm text-slate-500 mb-2">
                            Champs mappés:
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {template.fields.map((field, index) => (
                              <span 
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700"
                              >
                                {field}
                              </span>
                            ))}
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-slate-700"
                            onClick={() => editTemplate(template.id)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-600"
                            onClick={() => deleteTemplate(template.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="rappel" className="mt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {templates.filter(t => t.type === 'rappel').map((template) => (
                      <Card key={template.id} className="overflow-hidden border-slate-200">
                        <div className="h-2 bg-amber-500" />
                        {/* ... Card content ... */}
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center">
                              <FileText className="h-5 w-5 mr-2 text-amber-500" />
                              <CardTitle className="text-lg">{template.name}</CardTitle>
                            </div>
                            <div className="flex items-center">
                              {template.status === 'active' ? (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <Check className="h-3 w-3 mr-1" />
                                  Actif
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Inactif
                                </span>
                              )}
                            </div>
                          </div>
                          <CardDescription>
                            Mis à jour le {template.lastUpdated}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="text-sm text-slate-500 mb-2">
                            Champs mappés:
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {template.fields.map((field, index) => (
                              <span 
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700"
                              >
                                {field}
                              </span>
                            ))}
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-slate-700"
                            onClick={() => editTemplate(template.id)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-600"
                            onClick={() => deleteTemplate(template.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default Templates;
