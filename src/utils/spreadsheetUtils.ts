
import { toast } from 'sonner';

export const exportToCSV = (data: any[], headers: string[]) => {
  const csvContent = [
    headers.join(','), // Header row
    ...data.map(row => headers.map(header => row[header]).join(',')) // Data rows
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'export_data.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  toast.success('Export terminé', {
    description: `Les données ont été exportées avec succès.`
  });
};

export const validateEmailFields = (rows: any[]) => {
  const emailCount = rows.reduce((count, row) => {
    let rowCount = 0;
    if (row['E MAIL 1'] && row['E MAIL 1'].includes('@')) rowCount++;
    if (row['E Mail 2'] && row['E Mail 2'].includes('@')) rowCount++;
    return count + rowCount;
  }, 0);
  
  if (emailCount === 0) {
    toast.error("Adresses email manquantes", {
      description: "Aucune adresse email valide n'a été trouvée dans les colonnes 'E MAIL 1' ou 'E Mail 2'."
    });
    return false;
  }
  
  return true;
};
