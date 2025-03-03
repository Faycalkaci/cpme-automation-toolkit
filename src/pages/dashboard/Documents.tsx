
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  FileText, 
  Download, 
  Mail, 
  Search, 
  Calendar, 
  Trash2, 
  Eye
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';

// Mock document data
const MOCK_DOCUMENTS = [
  {
    id: '1',
    name: 'Appel de cotisation - Dupont SAS.pdf',
    type: 'Appel de cotisation',
    date: '12/03/2023',
    size: '52 Ko',
    sent: true,
    company: 'Dupont SAS'
  },
  {
    id: '2',
    name: 'Facture - Martin & Co.pdf',
    type: 'Facture',
    date: '10/03/2023',
    size: '48 Ko',
    sent: true,
    company: 'Martin & Co'
  },
  {
    id: '3',
    name: 'Rappel de cotisation - Dubois SARL.pdf',
    type: 'Rappel de cotisation',
    date: '05/03/2023',
    size: '51 Ko',
    sent: false,
    company: 'Dubois SARL'
  },
  {
    id: '4',
    name: 'Appel de cotisation - Lefevre Inc.pdf',
    type: 'Appel de cotisation',
    date: '01/03/2023',
    size: '53 Ko',
    sent: true,
    company: 'Lefevre Inc'
  },
  {
    id: '5',
    name: 'Facture - Moreau SARL.pdf',
    type: 'Facture',
    date: '28/02/2023',
    size: '49 Ko',
    sent: true,
    company: 'Moreau SARL'
  }
];

const Documents = () => {
  const { toast } = useToast();
  const [documents] = useState(MOCK_DOCUMENTS);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const downloadDocument = (id: string) => {
    toast({
      title: "Téléchargement en cours",
      description: "Le document sera téléchargé dans quelques instants."
    });
  };

  const viewDocument = (id: string) => {
    toast({
      title: "Aperçu du document",
      description: "L'aperçu du document s'ouvrira dans un nouvel onglet."
    });
    // In a real app, this would open the document in a new tab or modal
  };

  const sendEmail = (id: string) => {
    toast({
      title: "Email envoyé",
      description: "Le document a été envoyé par email avec succès."
    });
  };

  const deleteDocument = (id: string) => {
    toast({
      title: "Document supprimé",
      description: "Le document a été supprimé avec succès."
    });
  };

  const toggleSelectDocument = (id: string) => {
    setSelectedDocs(prev => 
      prev.includes(id) 
        ? prev.filter(docId => docId !== id) 
        : [...prev, id]
    );
  };

  const selectAllDocuments = () => {
    if (selectedDocs.length === filteredDocuments.length) {
      setSelectedDocs([]);
    } else {
      setSelectedDocs(filteredDocuments.map(doc => doc.id));
    }
  };

  const bulkDownload = () => {
    if (selectedDocs.length === 0) {
      toast({
        title: "Aucun document sélectionné",
        description: "Veuillez sélectionner au moins un document.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Téléchargement en cours",
      description: `${selectedDocs.length} document(s) seront téléchargés dans quelques instants.`
    });
  };

  const bulkEmail = () => {
    if (selectedDocs.length === 0) {
      toast({
        title: "Aucun document sélectionné",
        description: "Veuillez sélectionner au moins un document.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Emails envoyés",
      description: `${selectedDocs.length} document(s) ont été envoyés par email avec succès.`
    });
  };

  const bulkDelete = () => {
    if (selectedDocs.length === 0) {
      toast({
        title: "Aucun document sélectionné",
        description: "Veuillez sélectionner au moins un document.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Documents supprimés",
      description: `${selectedDocs.length} document(s) ont été supprimés avec succès.`
    });
  };

  const filteredDocuments = documents.filter(doc => {
    // Filter by search term
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by tab
    const matchesTab = 
      activeTab === 'all' ||
      (activeTab === 'appel' && doc.type === 'Appel de cotisation') ||
      (activeTab === 'facture' && doc.type === 'Facture') ||
      (activeTab === 'rappel' && doc.type === 'Rappel de cotisation');
    
    return matchesSearch && matchesTab;
  });

  return (
    <div className="w-full max-w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Mes documents</h1>
        <p className="text-slate-600 mb-6">
          Gérez les documents PDF générés à partir de vos données
        </p>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Documents générés</CardTitle>
                <CardDescription>
                  {documents.length} document(s) - {selectedDocs.length} sélectionné(s)
                </CardDescription>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={bulkDownload}
                  disabled={selectedDocs.length === 0}
                  className="flex items-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={bulkEmail}
                  disabled={selectedDocs.length === 0}
                  className="flex items-center"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Envoyer
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={bulkDelete}
                  disabled={selectedDocs.length === 0}
                  className="flex items-center text-red-500 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4">
              <div className="relative w-full sm:w-auto sm:flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Rechercher un document..."
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
            <div className="border rounded-md overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 text-left">
                    <th className="p-3 w-[50px] text-slate-500 font-medium text-sm">
                      <Checkbox
                        checked={selectedDocs.length === filteredDocuments.length && filteredDocuments.length > 0}
                        onCheckedChange={selectAllDocuments}
                      />
                    </th>
                    <th className="p-3 text-slate-500 font-medium text-sm">Document</th>
                    <th className="p-3 text-slate-500 font-medium text-sm hidden md:table-cell">Entreprise</th>
                    <th className="p-3 text-slate-500 font-medium text-sm hidden md:table-cell">Type</th>
                    <th className="p-3 text-slate-500 font-medium text-sm hidden md:table-cell">Date</th>
                    <th className="p-3 text-slate-500 font-medium text-sm hidden md:table-cell">Taille</th>
                    <th className="p-3 text-slate-500 font-medium text-sm text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.length > 0 ? (
                    filteredDocuments.map((doc) => (
                      <tr key={doc.id} className="border-t border-slate-200 hover:bg-slate-50">
                        <td className="p-3">
                          <Checkbox
                            checked={selectedDocs.includes(doc.id)}
                            onCheckedChange={() => toggleSelectDocument(doc.id)}
                          />
                        </td>
                        <td className="p-3">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 text-primary mr-2" />
                            <span className="font-medium text-slate-900 line-clamp-1">{doc.name}</span>
                          </div>
                        </td>
                        <td className="p-3 hidden md:table-cell text-slate-700">{doc.company}</td>
                        <td className="p-3 hidden md:table-cell">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            doc.type === 'Appel de cotisation' ? 'bg-blue-100 text-blue-800' :
                            doc.type === 'Facture' ? 'bg-green-100 text-green-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {doc.type}
                          </span>
                        </td>
                        <td className="p-3 hidden md:table-cell text-slate-700">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 text-slate-400 mr-2" />
                            {doc.date}
                          </div>
                        </td>
                        <td className="p-3 hidden md:table-cell text-slate-700">{doc.size}</td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => viewDocument(doc.id)}>
                              <Eye className="h-4 w-4 text-slate-700" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => downloadDocument(doc.id)}>
                              <Download className="h-4 w-4 text-slate-700" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => sendEmail(doc.id)}>
                              <Mail className="h-4 w-4 text-slate-700" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-8 text-center">
                        <FileText className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                        <h3 className="text-lg font-medium text-slate-900 mb-1">Aucun document trouvé</h3>
                        <p className="text-slate-500">
                          {searchTerm 
                            ? "Aucun document ne correspond à votre recherche." 
                            : "Générez des documents à partir de vos données pour les voir apparaître ici."}
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Documents;
