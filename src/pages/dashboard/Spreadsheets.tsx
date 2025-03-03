
import React, { useState } from 'react';
import { FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FileUploader from '@/components/data/FileUploader';
import DataTable from '@/components/data/DataTable';
import { useSpreadsheetTemplates } from '@/hooks/useSpreadsheetTemplates';
import { exportToCSV, validateEmailFields } from '@/utils/spreadsheetUtils';
import GeneratePdfDialog from '@/components/spreadsheets/GeneratePdfDialog';
import EmailDialog from '@/components/spreadsheets/EmailDialog';
import ImportInstructions from '@/components/spreadsheets/ImportInstructions';
import DataActions from '@/components/spreadsheets/DataActions';

const Spreadsheets = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [data, setData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  
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
    setSelectedRows(rows);
    setShowGenerateDialog(true);
  };
  
  const handleSendEmail = (rows: any[]) => {
    setSelectedRows(rows);
    
    if (!validateEmailFields(rows)) {
      return;
    }
    
    setShowEmailDialog(true);
  };
  
  const handleExport = () => {
    toast.success('Export en cours', {
      description: `${data.length} lignes sont en cours d'exportation.`
    });
    
    exportToCSV(data, headers);
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
