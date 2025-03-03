
import { toast } from 'sonner';

export const exportToCsv = (selectedData: any[], headers: string[]) => {
  if (selectedData.length === 0) {
    toast.error("Sélection vide", { 
      description: "Veuillez sélectionner au moins une ligne pour exporter." 
    });
    return false;
  }
  
  const csvContent = [
    headers.join(','),
    ...selectedData.map(row => 
      headers.map(header => {
        const value = row[header] || '';
        return `"${String(value).replace(/"/g, '""')}"`; 
      }).join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'exported_data.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  toast.success("Export réussi", { 
    description: `${selectedData.length} lignes exportées au format CSV.` 
  });
  
  return true;
};
