
import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Upload, 
  FileSpreadsheet, 
  X, 
  Download, 
  FileText, 
  Mail,
  Search
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import * as Papa from 'papaparse';
import { Input } from '@/components/ui/input';

const Spreadsheets = () => {
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<Array<Record<string, any>>>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const handleFileDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    const droppedFiles = Array.from(e.dataTransfer.files).filter(file => 
      file.name.endsWith('.csv') || 
      file.name.endsWith('.xlsx') || 
      file.name.endsWith('.xls')
    );
    
    if (droppedFiles.length === 0) {
      toast({
        title: "Format non supporté",
        description: "Veuillez télécharger un fichier CSV ou Excel (.xlsx, .xls)",
        variant: "destructive"
      });
      return;
    }
    
    setFiles(prev => [...prev, ...droppedFiles]);
    
    // Automatically load the first file
    if (droppedFiles.length > 0 && !currentFile) {
      handleFileSelect(droppedFiles[0]);
    }
    
    toast({
      title: "Fichier(s) ajouté(s)",
      description: `${droppedFiles.length} fichier(s) ont été ajoutés avec succès.`
    });
  }, [toast, currentFile]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleFileSelect = (file: File) => {
    setCurrentFile(file.name);
    
    if (file.name.endsWith('.csv')) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          setParsedData(results.data as Array<Record<string, any>>);
          if (results.data.length > 0) {
            setHeaders(Object.keys(results.data[0]));
          }
          toast({
            title: "Fichier chargé",
            description: `${file.name} a été chargé avec succès.`
          });
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
          toast({
            title: "Erreur",
            description: "Impossible de lire le fichier CSV. Vérifiez le format.",
            variant: "destructive"
          });
        }
      });
    } else {
      // For Excel files we would need to use another library
      // For now, just show a mock message
      toast({
        title: "Format Excel",
        description: "La lecture des fichiers Excel sera bientôt disponible."
      });
      
      // Mock data for demonstration
      const mockData = [
        { "Nom": "Dupont", "Prénom": "Jean", "Email": "jean.dupont@example.com", "Entreprise": "Dupont SAS" },
        { "Nom": "Martin", "Prénom": "Sophie", "Email": "sophie.martin@example.com", "Entreprise": "Martin & Co" },
        { "Nom": "Dubois", "Prénom": "Pierre", "Email": "pierre.dubois@example.com", "Entreprise": "Dubois SARL" },
      ];
      setParsedData(mockData);
      setHeaders(Object.keys(mockData[0]));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).filter(file => 
        file.name.endsWith('.csv') || 
        file.name.endsWith('.xlsx') || 
        file.name.endsWith('.xls')
      );
      
      if (newFiles.length === 0) {
        toast({
          title: "Format non supporté",
          description: "Veuillez télécharger un fichier CSV ou Excel (.xlsx, .xls)",
          variant: "destructive"
        });
        return;
      }
      
      setFiles(prev => [...prev, ...newFiles]);
      
      // Automatically load the first file
      if (newFiles.length > 0 && !currentFile) {
        handleFileSelect(newFiles[0]);
      }
      
      toast({
        title: "Fichier(s) ajouté(s)",
        description: `${newFiles.length} fichier(s) ont été ajoutés avec succès.`
      });
    }
  };

  const removeFile = (fileName: string) => {
    setFiles(prev => prev.filter(file => file.name !== fileName));
    
    if (currentFile === fileName) {
      setCurrentFile(null);
      setParsedData([]);
      setHeaders([]);
    }
    
    toast({
      title: "Fichier supprimé",
      description: `${fileName} a été supprimé.`
    });
  };

  const toggleRowSelection = (index: number) => {
    setSelectedRows(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    );
  };

  const selectAllRows = () => {
    if (selectedRows.length === parsedData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows([...Array(parsedData.length).keys()]);
    }
  };

  const filteredData = parsedData.filter(row => 
    Object.values(row).some(value => 
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const generatePDF = () => {
    if (selectedRows.length === 0) {
      toast({
        title: "Aucune ligne sélectionnée",
        description: "Veuillez sélectionner au moins une ligne pour générer un PDF.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Génération de PDF",
      description: `${selectedRows.length} document(s) PDF en cours de génération...`
    });
    
    // Simulate PDF generation delay
    setTimeout(() => {
      toast({
        title: "PDF générés",
        description: `${selectedRows.length} document(s) PDF ont été générés avec succès.`,
      });
    }, 2000);
  };

  const sendEmails = () => {
    if (selectedRows.length === 0) {
      toast({
        title: "Aucune ligne sélectionnée",
        description: "Veuillez sélectionner au moins une ligne pour envoyer des emails.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Envoi des emails",
      description: `${selectedRows.length} email(s) en cours d'envoi...`
    });
    
    // Simulate email sending delay
    setTimeout(() => {
      toast({
        title: "Emails envoyés",
        description: `${selectedRows.length} email(s) ont été envoyés avec succès.`,
      });
    }, 2000);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Mes classeurs</h1>
        <p className="text-slate-600 mb-6">
          Importez, visualisez et générez des documents à partir de vos données
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left sidebar - Files list */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Fichiers importés</CardTitle>
              <CardDescription>
                {files.length} fichier(s) disponible(s)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                onDrop={handleFileDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-slate-200 rounded-md p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-600 mb-2">Glissez-déposez vos fichiers ici</p>
                <p className="text-xs text-slate-500 mb-4">ou</p>
                <Button size="sm" asChild>
                  <label>
                    Parcourir
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      accept=".csv,.xls,.xlsx"
                      className="hidden"
                      multiple
                    />
                  </label>
                </Button>
              </div>

              <Separator />

              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {files.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-4">
                    Aucun fichier importé
                  </p>
                ) : (
                  files.map((file, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-2 rounded-md text-sm ${
                        currentFile === file.name ? 'bg-primary/10 text-primary' : 'hover:bg-slate-100'
                      }`}
                    >
                      <button
                        className="flex items-center flex-1 text-left"
                        onClick={() => handleFileSelect(file)}
                      >
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        <span className="truncate max-w-[150px]">{file.name}</span>
                      </button>
                      <button
                        onClick={() => removeFile(file.name)}
                        className="text-slate-400 hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Main content - Data table */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>
                    {currentFile ? (
                      <span className="flex items-center">
                        <FileSpreadsheet className="h-5 w-5 mr-2 text-primary" />
                        {currentFile}
                      </span>
                    ) : (
                      "Données"
                    )}
                  </CardTitle>
                  <CardDescription>
                    {parsedData.length > 0
                      ? `${parsedData.length} entrées - ${selectedRows.length} sélectionnée(s)`
                      : "Aucune donnée à afficher"}
                  </CardDescription>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={generatePDF}
                    disabled={selectedRows.length === 0}
                    className="flex items-center"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Générer PDF
                  </Button>
                  <Button
                    size="sm"
                    onClick={sendEmails}
                    disabled={selectedRows.length === 0}
                    className="flex items-center"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Envoyer par Email
                  </Button>
                </div>
              </div>

              {parsedData.length > 0 && (
                <div className="flex items-center mt-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Rechercher..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2"
                    onClick={() => setSearchTerm('')}
                  >
                    Effacer
                  </Button>
                </div>
              )}
            </CardHeader>
            
            <CardContent>
              {currentFile ? (
                parsedData.length > 0 ? (
                  <div className="border rounded-md overflow-hidden">
                    <div className="max-h-[500px] overflow-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[50px]">
                              <Checkbox
                                checked={selectedRows.length === parsedData.length && parsedData.length > 0}
                                onCheckedChange={selectAllRows}
                              />
                            </TableHead>
                            {headers.map((header, index) => (
                              <TableHead key={index}>{header}</TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredData.map((row, rowIndex) => (
                            <TableRow key={rowIndex} className={selectedRows.includes(rowIndex) ? "bg-primary/5" : ""}>
                              <TableCell>
                                <Checkbox
                                  checked={selectedRows.includes(rowIndex)}
                                  onCheckedChange={() => toggleRowSelection(rowIndex)}
                                />
                              </TableCell>
                              {headers.map((header, cellIndex) => (
                                <TableCell key={cellIndex}>{row[header]}</TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileSpreadsheet className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">Aucune donnée trouvée</h3>
                    <p className="text-slate-500 max-w-md mx-auto">
                      Le fichier sélectionné ne contient pas de données ou le format n'est pas pris en charge.
                    </p>
                  </div>
                )
              ) : (
                <div className="text-center py-12">
                  <FileSpreadsheet className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">Aucun fichier sélectionné</h3>
                  <p className="text-slate-500 max-w-md mx-auto">
                    Veuillez importer un fichier Excel ou CSV et le sélectionner dans la liste pour visualiser les données.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default Spreadsheets;
