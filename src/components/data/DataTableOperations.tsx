import React from 'react';
import { toast } from 'sonner';
import { useDataTable } from './DataTableContext';
import { validateRequiredFields } from '@/utils/pdfUtils';
import { getValidEmailsFromData, displayEmailResults, displayEmailAddresses } from '@/utils/emailUtils';
import { exportToCsv } from '@/utils/exportUtils';
import { documentStorage } from '@/services/documentStorage';
import { v4 as uuidv4 } from 'uuid';

export const useDataTableOperations = () => {
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
    
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`;
    
    const generatedDocuments = selectedData.map(row => {
      const company = row.SOCIETE || row.societe || row.Société || row.société || 'Entreprise';
      return {
        id: uuidv4(),
        name: `Appel de cotisation - ${company}.pdf`,
        type: 'Appel de cotisation',
        date: formattedDate,
        size: '52 Ko',
        sent: false,
        company
      };
    });
    
    documentStorage.saveDocuments(generatedDocuments)
      .then(() => {
        console.log(`${generatedDocuments.length} documents sauvegardés avec succès`);
      })
      .catch(error => {
        console.error('Erreur lors de la sauvegarde des documents:', error);
      });
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
    
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`;
    
    const generatedDocuments = selectedData.map(row => {
      const company = row.SOCIETE || row.societe || row.Société || row.société || 'Entreprise';
      return {
        id: uuidv4(),
        name: `Email - ${company}.pdf`,
        type: 'Email',
        date: formattedDate,
        size: '48 Ko',
        sent: true,
        company
      };
    });
    
    documentStorage.saveDocuments(generatedDocuments)
      .then(() => {
        console.log(`${generatedDocuments.length} documents envoyés sauvegardés avec succès`);
      })
      .catch(error => {
        console.error('Erreur lors de la sauvegarde des documents envoyés:', error);
      });
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

const DataTableOperations: React.FC = () => {
  return null; // Not used directly anymore
};

export default DataTableOperations;
