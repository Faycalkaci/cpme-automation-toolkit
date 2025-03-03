
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

// Import our new components
import EmailList from '@/components/emails/EmailList';
import EmailSearchBar from '@/components/emails/EmailSearchBar';
import EmailActions from '@/components/emails/EmailActions';
import { useEmails } from '@/components/emails/useEmails';

const Emails = () => {
  const {
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
  } = useEmails();

  const filteredEmails = filterEmails();

  return (
    <div className="w-full max-w-full">
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
            <EmailActions 
              selectedEmailsCount={selectedEmails.length} 
              totalEmailCount={emails.length}
              bulkDelete={bulkDelete}
            />

            <EmailSearchBar 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </CardHeader>
          
          <CardContent>
            <div className="border rounded-md overflow-hidden">
              <EmailList 
                filteredEmails={filteredEmails}
                selectedEmails={selectedEmails}
                toggleSelectEmail={toggleSelectEmail}
                viewDocument={viewDocument}
                viewEmail={viewEmail}
                resendEmail={resendEmail}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Emails;
