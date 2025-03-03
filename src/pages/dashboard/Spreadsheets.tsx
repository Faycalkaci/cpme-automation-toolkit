
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { FileSpreadsheet, ChevronDown, FileText, Mail, Download } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import FileUploader from '@/components/data/FileUploader';
import DataTable from '@/components/data/DataTable';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Spreadsheets = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [data, setData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  
  // Define templates with their mapping fields
  const templates = [
    { 
      id: 'appel', 
      name: 'Appel de cotisation',
      mappingFields: [
        'DATE ECHEANCE',
        'Cotisation',
        'N° adh',
        'SOCIETE',
        'Dirigeant',
        'E MAIL 1',
        'E Mail 2',
        'Adresse',
        'ville'
      ]
    },
    { id: 'facture', name: 'Facture standard' },
    { id: 'rappel', name: 'Rappel de cotisation' }
  ];
  
  const handleFileUploaded = (parsedData: any[], headers: string[]) => {
    setData(parsedData);
    setHeaders(headers);
    setActiveTab('data');
    
    toast.success('Fichier importé avec succès', {
      description: `${parsedData.length} lignes ont été importées.`
    });
  };
  
  const handleGeneratePdf = (rows: any[]) => {
    setSelectedRows(rows);
    setShowGenerateDialog(true);
  };
  
  const handleSendEmail = (rows: any[]) => {
    setSelectedRows(rows);
    setShowEmailDialog(true);
  };
  
  const handleExport = () => {
    // Implement export functionality
    toast.success('Export en cours', {
      description: `${data.length} lignes sont en cours d'exportation.`
    });
    
    // Create CSV content
    const csvContent = [
      headers.join(','), // Header row
      ...data.map(row => headers.map(header => row[header]).join(',')) // Data rows
    ].join('\n');
    
    // Create a blob and download it
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'export_data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Export terminé', {
      description: `Les données ont été exportées avec succès.`
    });
  };
  
  const confirmGeneration = () => {
    if (!selectedTemplate) {
      toast.error('Sélection requise', {
        description: 'Veuillez sélectionner un modèle de document.'
      });
      return;
    }
    
    // Get the selected template object
    const templateObj = templates.find(t => t.id === selectedTemplate);
    
    // Display mapping information if available
    if (templateObj && templateObj.mappingFields && templateObj.mappingFields.length > 0) {
      toast.info('Champs mappés', {
        description: `Les champs suivants seront utilisés: ${templateObj.mappingFields.join(', ')}`
      });
    }
    
    // Simulate PDF generation
    toast.success('Génération en cours', {
      description: `${selectedRows.length} documents sont en cours de génération.`
    });
    
    // Simulate completion after a delay
    setTimeout(() => {
      toast.success('Génération terminée', {
        description: `${selectedRows.length} documents ont été générés avec succès.`
      });
      setShowGenerateDialog(false);
    }, 2000);
  };
  
  const confirmSendEmail = () => {
    // Get the selected template object
    const templateObj = templates.find(t => t.id === selectedTemplate);
    
    // Check for email fields in the mapping
    if (templateObj && templateObj.id === 'appel') {
      const emailFields = templateObj.mappingFields.filter(field => 
        field.toLowerCase().includes('mail')
      );
      
      if (emailFields.length > 0) {
        toast.info('Emails détectés', {
          description: `Les emails seront envoyés aux champs: ${emailFields.join(', ')}`
        });
      }
    }
    
    // Simulate email sending
    toast.success('Envoi en cours', {
      description: `${selectedRows.length} emails sont en cours d'envoi.`
    });
    
    // Simulate completion after a delay
    setTimeout(() => {
      toast.success('Envoi terminé', {
        description: `${selectedRows.length} emails ont été envoyés avec succès.`
      });
      setShowEmailDialog(false);
    }, 2000);
  };
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center">
        <FileSpreadsheet className="h-8 w-8 mr-3 text-cpme" />
        Gestion des données
      </h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="upload">Importation</TabsTrigger>
          <TabsTrigger value="data" disabled={data.length === 0}>Données</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle>Importer vos données</CardTitle>
              <CardDescription>
                Téléchargez votre fichier Excel ou CSV contenant les informations de vos adhérents.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUploader onFileUploaded={handleFileUploaded} />
              
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Instructions d'importation</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium">Préparez votre fichier</h4>
                      <p className="text-slate-600 text-sm">
                        Assurez-vous que votre fichier Excel ou CSV contient des en-têtes de colonnes clairs pour chaque type de données.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium">Importez votre fichier</h4>
                      <p className="text-slate-600 text-sm">
                        Glissez-déposez votre fichier dans la zone ci-dessus ou cliquez pour sélectionner un fichier.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium">Mappez vos données</h4>
                      <p className="text-slate-600 text-sm">
                        Une fois importé, vous pourrez associer les colonnes de votre fichier aux champs des modèles de document.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle>Données importées</CardTitle>
              <CardDescription>
                Visualisez, filtrez et sélectionnez les adhérents pour générer des documents.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {data.length > 0 && (
                <div className="mb-4 flex space-x-2">
                  <Button onClick={() => handleGeneratePdf(data)}>
                    <FileText className="mr-2 h-4 w-4" />
                    Générer des PDF
                  </Button>
                  <Button onClick={() => handleSendEmail(data)}>
                    <Mail className="mr-2 h-4 w-4" />
                    Envoyer par email
                  </Button>
                  <Button variant="outline" onClick={handleExport}>
                    <Download className="mr-2 h-4 w-4" />
                    Exporter
                  </Button>
                </div>
              )}
              <DataTable 
                data={data} 
                headers={headers} 
                onGeneratePdf={handleGeneratePdf}
                onSendEmail={handleSendEmail}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* PDF Generation Dialog */}
      <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Générer des documents PDF</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="mb-4">
              Vous êtes sur le point de générer {selectedRows.length} {selectedRows.length > 1 ? 'documents' : 'document'}.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Modèle de document</label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un modèle" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedTemplate === 'appel' && (
                <div className="mt-4 p-3 bg-slate-50 rounded-md border border-slate-200">
                  <h4 className="text-sm font-medium mb-2">Champs à mapper pour "Appel de cotisation"</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {templates.find(t => t.id === 'appel')?.mappingFields.map((field, index) => (
                      <div key={index} className="text-xs bg-white p-2 rounded border border-slate-100 flex items-center">
                        <span className="bg-primary/10 text-primary text-[10px] px-1 rounded mr-1">{{'{{'}{field}{'}}'}}}</span>
                        <span className="truncate">{field}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowGenerateDialog(false)}>
              Annuler
            </Button>
            <Button onClick={confirmGeneration} disabled={!selectedTemplate}>
              <FileText className="mr-2 h-4 w-4" />
              Générer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Email Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Envoyer par email</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="mb-4">
              Vous êtes sur le point d'envoyer des emails à {selectedRows.length} {selectedRows.length > 1 ? 'destinataires' : 'destinataire'}.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Modèle de document à joindre</label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un modèle" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedTemplate === 'appel' && (
                <div className="mt-2">
                  <p className="text-sm text-slate-600 mb-2">
                    Les emails seront envoyés en utilisant les champs suivants:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {templates.find(t => t.id === 'appel')?.mappingFields
                      .filter(field => field.toLowerCase().includes('mail'))
                      .map((field, index) => (
                        <span key={index} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          {field}
                        </span>
                      ))
                    }
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEmailDialog(false)}>
              Annuler
            </Button>
            <Button onClick={confirmSendEmail} disabled={!selectedTemplate}>
              <Mail className="mr-2 h-4 w-4" />
              Envoyer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Spreadsheets;
