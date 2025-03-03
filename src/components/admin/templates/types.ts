
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
  // Added fields for better tracking and management
  createdBy?: string;
  organizationId?: string;
  lastModified?: string;
  mappingConfig?: Record<string, string>;
  isPublic?: boolean;
};
