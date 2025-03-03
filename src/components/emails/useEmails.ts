
import { useState } from 'react';
import { MOCK_EMAILS, Email } from './mockData';
import { useToast } from '@/components/ui/use-toast';

export const useEmails = () => {
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

  const selectAllEmails = (filteredEmails: Email[]) => {
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

  const filterEmails = () => {
    return emails.filter(email => {
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
  };

  return {
    emails,
    selectedEmails,
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab,
    toggleSelectEmail,
    selectAllEmails,
    resendEmail,
    bulkDelete,
    viewEmail,
    viewDocument,
    filterEmails
  };
};
