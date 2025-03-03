
import React, { useState } from 'react';
import { FileSpreadsheet, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import FileUploader from '@/components/data/FileUploader';
import DataTable from '@/components/data/DataTable';
import { useSpreadsheetTemplates } from '@/hooks/useSpreadsheetTemplates';
import { exportToCSV, validateEmailFields } from '@/utils/spreadsheetUtils';
import GeneratePdfDialog from '@/components/spreadsheets/GeneratePdfDialog';
import EmailDialog from '@/components/spreadsheets/EmailDialog';
import ImportInstructions from '@/components/spreadsheets/ImportInstructions';
import DataActions from '@/components/spreadsheets/DataActions';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

const Spreadsheets = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [data, setData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { templates, selectedTemplate, setSelectedTemplate } = useSpreadsheetTemplates();
  
  const handleFileUploaded = (parsedData: any[], headers: string[]) => {
    setData(parsedData);
    setHeaders(headers);
    setActiveTab('data');
    
    toast.success('Fichier importé avec succès', {
      description: `${parsedData.length} lignes ont été importées.`
    });
  };
  
  const handleGeneratePdf = (rows: any[]) => {
    if (rows.length === 0) {
      toast.error('Aucune ligne sélectionnée', {
        description: 'Veuillez sélectionner au moins une ligne pour générer un PDF.'
      });
      return;
    }
    
    setSelectedRows(rows);
    setShowGenerateDialog(true);
  };
  
  const handleSendEmail = (rows: any[]) => {
    if (rows.length === 0) {
      toast.error('Aucune ligne sélectionnée', {
        description: 'Veuillez sélectionner au moins une ligne pour envoyer un email.'
      });
      return;
    }
    
    setSelectedRows(rows);
    
    if (!validateEmailFields(rows)) {
      return;
    }
    
    setShowEmailDialog(true);
  };
  
  const handleExport = () => {
    setIsProcessing(true);
    
    toast.success('Export en cours', {
      description: `${data.length} lignes sont en cours d'exportation.`
    });
    
    try {
      exportToCSV(data, headers);
      toast.success('Export terminé', {
        description: `${data.length} lignes ont été exportées avec succès.`
      });
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Erreur d\'export', {
        description: 'Une erreur est survenue lors de l\'exportation des données.'
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Define keyboard shortcuts
  const shortcuts = [
    {
      key: 'u',
      altKey: true,
      action: () => setActiveTab('upload'),
      description: 'Aller à l\'onglet d\'importation'
    },
    {
      key: 'd',
      altKey: true,
      action: () => data.length > 0 && setActiveTab('data'),
      description: 'Aller à l\'onglet des données'
    },
    {
      key: 'p',
      altKey: true,
      action: () => {
        const selectedData = document.querySelectorAll('input[type="checkbox"]:checked');
        if (selectedData.length > 0 && activeTab === 'data') {
          handleGeneratePdf(selectedRows);
        } else {
          toast.info('Sélectionnez des lignes avant de générer des PDF');
        }
      },
      description: 'Générer des PDF pour les lignes sélectionnées'
    },
    {
      key: 'e',
      altKey: true,
      action: () => {
        const selectedData = document.querySelectorAll('input[type="checkbox"]:checked');
        if (selectedData.length > 0 && activeTab === 'data') {
          handleSendEmail(selectedRows);
        } else {
          toast.info('Sélectionnez des lignes avant d\'envoyer des emails');
        }
      },
      description: 'Envoyer des emails pour les lignes sélectionnées'
    },
    {
      key: 'x',
      altKey: true,
      action: () => {
        if (data.length > 0 && activeTab === 'data') {
          handleExport();
        }
      },
      description: 'Exporter les données'
    },
    {
      key: '?',
      action: () => showAvailableShortcuts(),
      description: 'Afficher cette aide'
    }
  ];
  
  const { showAvailableShortcuts } = useKeyboardShortcuts(shortcuts);
  
  return (
    <div className="w-full max-w-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center">
          <FileSpreadsheet className="h-8 w-8 mr-3 text-cpme" />
          Gestion des données
        </h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={showAvailableShortcuts}
          aria-label="Afficher les raccourcis clavier"
        >
          <HelpCircle className="h-5 w-5 mr-1" />
          <span className="text-sm">Raccourcis</span>
        </Button>
      </div>
      
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
              <ImportInstructions />
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
              <DataActions 
                data={data}
                onGeneratePdf={handleGeneratePdf}
                onSendEmail={handleSendEmail}
                onExport={handleExport}
                isProcessing={isProcessing}
              />
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
      
      <GeneratePdfDialog
        open={showGenerateDialog}
        onOpenChange={setShowGenerateDialog}
        selectedRows={selectedRows}
        selectedTemplate={selectedTemplate}
        setSelectedTemplate={setSelectedTemplate}
        templates={templates}
      />
      
      <EmailDialog
        open={showEmailDialog}
        onOpenChange={setShowEmailDialog}
        selectedRows={selectedRows}
        selectedTemplate={selectedTemplate}
        setSelectedTemplate={setSelectedTemplate}
        templates={templates}
      />
    </div>
  );
};

export default Spreadsheets;
