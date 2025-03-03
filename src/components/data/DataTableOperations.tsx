
import React from 'react';
import { toast } from 'sonner';
import { useDataTable } from './DataTableContext';
import { generateAndDownloadPdf, validateRequiredFields } from '@/utils/pdfUtils';
import { getValidEmailsFromData, displayEmailResults, displayEmailAddresses } from '@/utils/emailUtils';
import { exportToCsv } from '@/utils/exportUtils';

const DataTableOperations: React.FC = () => {
  const { 
    headers, 
    getSelectedRowsData, 
    onGeneratePdf, 
    onSendEmail 
  } = useDataTable();

  const handleGeneratePdf = () => {
    const selectedData = getSelectedRowsData();
    if (selectedData.length === 0) {
      toast.error("Sélection vide", { 
        description: "Veuillez sélectionner au moins une ligne pour générer un PDF." 
      });
      return;
    }
    
    const hasMissingFields = validateRequiredFields(selectedData);
    
    if (hasMissingFields) {
      toast.warning("Données incomplètes", { 
        description: "Certaines lignes sélectionnées n'ont pas toutes les données requises (SOCIETE, N° adh, Cotisation)." 
      });
    }
    
    onGeneratePdf(selectedData);
    generateAndDownloadPdf(selectedData, headers);
  };
  
  const handleSendEmail = () => {
    const selectedData = getSelectedRowsData();
    if (selectedData.length === 0) {
      toast.error("Sélection vide", { 
        description: "Veuillez sélectionner au moins une ligne pour envoyer un email." 
      });
      return;
    }
    
    const emailData = getValidEmailsFromData(selectedData);
    const isValid = displayEmailResults(emailData);
    
    if (!isValid) return;
    
    onSendEmail(selectedData);
    
    const allValidEmails = emailData.emailsByRow.flatMap(item => item.emails);
    displayEmailAddresses(allValidEmails);
  };
  
  const handleExportCsv = () => {
    const selectedData = getSelectedRowsData();
    exportToCsv(selectedData, headers);
  };

  return {
    handleGeneratePdf,
    handleSendEmail,
    handleExportCsv
  };
};

export default DataTableOperations;
