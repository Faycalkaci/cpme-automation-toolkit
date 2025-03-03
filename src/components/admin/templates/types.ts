
export type Template = {
  id: string;
  name: string;
  type: 'facture' | 'appel' | 'rappel' | 'autre';
  date: string;
  fields: string[];
  fileUrl: string;
  file?: File;
  savedBy?: string;
  permanent?: boolean;
};
