
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Mail, 
  Search, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  FileText, 
  Eye
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';

// Mock email data
const MOCK_EMAILS = [
  {
    id: '1',
    recipient: 'jean.dupont@example.com',
    company: 'Dupont SAS',
    subject: 'Appel de cotisation CPME',
    date: '12/03/2023',
    status: 'sent',
    documentType: 'Appel de cotisation'
  },
  {
    id: '2',
    recipient: 'sophie.martin@example.com',
    company: 'Martin & Co',
    subject: 'Facture CPME #2023-045',
    date: '10/03/2023',
    status: 'sent',
    documentType: 'Facture'
  },
  {
    id: '3',
    recipient: 'pierre.dubois@example.com',
    company: 'Dubois SARL',
    subject: 'Rappel de cotisation CPME',
    date: '05/03/2023',
    status: 'failed',
    documentType: 'Rappel de cotisation'
  },
  {
    id: '4',
    recipient: 'julie.lefevre@example.com',
    company: 'Lefevre Inc',
    subject: 'Appel de cotisation CPME',
    date: '01/03/2023',
    status: 'sent',
    documentType: 'Appel de cotisation'
  }
];

const Emails = () => {
  const { toast } = useToast();
  const [emails] = useState(MOCK_EMAILS);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const toggleSelectEmail = (id: string) => {
    setSelectedEmails(prev => 
      prev.includes(id) 
        ? prev.filter(emailId => emailId !== id) 
        : [...prev, id]
    );
  };

  const selectAllEmails = () => {
    if (selectedEmails.length === filteredEmails.length) {
      setSelectedEmails([]);
    } else {
      setSelectedEmails(filteredEmails.map(email => email.id));
    }
  };

  const resendEmail = (id: string) => {
    toast({
      title: "Email renvoyé",
      description: "L'email a été renvoyé avec succès."
    });
  };

  const bulkDelete = () => {
    if (selectedEmails.length === 0) {
      toast({
        title: "Aucun email sélectionné",
        description: "Veuillez sélectionner au moins un email.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Emails supprimés",
      description: `${selectedEmails.length} email(s) ont été supprimés avec succès.`
    });
    
    setSelectedEmails([]);
  };

  const viewEmail = (id: string) => {
    toast({
      title: "Détails de l'email",
      description: "Les détails de l'email s'afficheront bientôt."
    });
  };

  const viewDocument = (id: string) => {
    toast({
      title: "Aperçu du document",
      description: "L'aperçu du document s'ouvrira dans un nouvel onglet."
    });
  };

  const filteredEmails = emails.filter(email => {
    // Filter by search term
    const matchesSearch = 
      email.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by tab
    const matchesTab = 
      activeTab === 'all' ||
      (activeTab === 'sent' && email.status === 'sent') ||
      (activeTab === 'failed' && email.status === 'failed');
    
    return matchesSearch && matchesTab;
  });

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Emails envoyés</h1>
        <p className="text-slate-600 mb-6">
          Suivez et gérez les emails envoyés automatiquement
        </p>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Historique des emails</CardTitle>
                <CardDescription>
                  {emails.length} email(s) - {selectedEmails.length} sélectionné(s)
                </CardDescription>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={bulkDelete}
                  disabled={selectedEmails.length === 0}
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
                  placeholder="Rechercher un email..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Tabs defaultValue="all" className="w-full sm:w-auto" onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">Tous</TabsTrigger>
                  <TabsTrigger value="sent">Envoyés</TabsTrigger>
                  <TabsTrigger value="failed">Échecs</TabsTrigger>
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
                        checked={selectedEmails.length === filteredEmails.length && filteredEmails.length > 0}
                        onCheckedChange={selectAllEmails}
                      />
                    </th>
                    <th className="p-3 text-slate-500 font-medium text-sm">Destinataire</th>
                    <th className="p-3 text-slate-500 font-medium text-sm hidden md:table-cell">Entreprise</th>
                    <th className="p-3 text-slate-500 font-medium text-sm hidden md:table-cell">Type</th>
                    <th className="p-3 text-slate-500 font-medium text-sm hidden md:table-cell">Date</th>
                    <th className="p-3 text-slate-500 font-medium text-sm">Statut</th>
                    <th className="p-3 text-slate-500 font-medium text-sm text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmails.length > 0 ? (
                    filteredEmails.map((email) => (
                      <tr key={email.id} className="border-t border-slate-200 hover:bg-slate-50">
                        <td className="p-3">
                          <Checkbox
                            checked={selectedEmails.includes(email.id)}
                            onCheckedChange={() => toggleSelectEmail(email.id)}
                          />
                        </td>
                        <td className="p-3">
                          <div className="flex items-center">
                            <Mail className="h-5 w-5 text-primary mr-2" />
                            <span className="font-medium text-slate-900">{email.recipient}</span>
                          </div>
                          <div className="text-xs text-slate-500 mt-1 hidden sm:block">{email.subject}</div>
                        </td>
                        <td className="p-3 hidden md:table-cell text-slate-700">{email.company}</td>
                        <td className="p-3 hidden md:table-cell">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            email.documentType === 'Appel de cotisation' ? 'bg-blue-100 text-blue-800' :
                            email.documentType === 'Facture' ? 'bg-green-100 text-green-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {email.documentType}
                          </span>
                        </td>
                        <td className="p-3 hidden md:table-cell text-slate-700">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 text-slate-400 mr-2" />
                            {email.date}
                          </div>
                        </td>
                        <td className="p-3">
                          {email.status === 'sent' ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Envoyé
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <XCircle className="h-3 w-3 mr-1" />
                              Échec
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => viewDocument(email.id)}>
                              <FileText className="h-4 w-4 text-slate-700" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => viewEmail(email.id)}>
                              <Eye className="h-4 w-4 text-slate-700" />
                            </Button>
                            {email.status === 'failed' && (
                              <Button variant="ghost" size="icon" onClick={() => resendEmail(email.id)}>
                                <Mail className="h-4 w-4 text-slate-700" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-8 text-center">
                        <Mail className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                        <h3 className="text-lg font-medium text-slate-900 mb-1">Aucun email trouvé</h3>
                        <p className="text-slate-500">
                          {searchTerm 
                            ? "Aucun email ne correspond à votre recherche." 
                            : "Aucun email n'a été envoyé pour le moment."}
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

export default Emails;
