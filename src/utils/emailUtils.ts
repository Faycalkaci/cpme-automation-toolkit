
import { toast } from 'sonner';

export const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const getValidEmailsFromData = (data: any[]) => {
  const emailsByRow = data.map(row => {
    const validEmails = [];
    if (row['E MAIL 1'] && validateEmail(row['E MAIL 1'])) {
      validEmails.push(row['E MAIL 1']);
    }
    if (row['E Mail 2'] && validateEmail(row['E Mail 2'])) {
      validEmails.push(row['E Mail 2']);
    }
    return {
      row,
      emails: validEmails
    };
  });
  
  const rowsWithNoEmails = emailsByRow.filter(item => item.emails.length === 0);
  const totalEmailCount = emailsByRow.reduce((sum, item) => sum + item.emails.length, 0);
  
  return { emailsByRow, rowsWithNoEmails, totalEmailCount };
};

export const displayEmailResults = (data: ReturnType<typeof getValidEmailsFromData>) => {
  const { rowsWithNoEmails, totalEmailCount } = data;
  
  if (totalEmailCount === 0) {
    toast.error("Adresses email manquantes", { 
      description: "Aucune adresse email valide n'a été trouvée dans les colonnes 'E MAIL 1' ou 'E Mail 2'." 
    });
    return false;
  }
  
  if (rowsWithNoEmails.length > 0) {
    toast.warning("Emails manquants", { 
      description: `${rowsWithNoEmails.length} ligne(s) n'ont pas d'adresse email valide.` 
    });
  }
  
  return true;
};

export const displayEmailAddresses = (allValidEmails: string[]) => {
  if (allValidEmails.length > 0) {
    toast.info(`Adresses email détectées (${allValidEmails.length})`, {
      description: allValidEmails.length > 3 
        ? `${allValidEmails.slice(0, 3).join(', ')} et ${allValidEmails.length - 3} autres adresses`
        : allValidEmails.join(', ')
    });
  }
};
