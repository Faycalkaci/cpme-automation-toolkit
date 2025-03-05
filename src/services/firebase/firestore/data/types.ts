
import { Timestamp } from 'firebase/firestore';

// Type for data file metadata
export interface DataFile {
  id: string;
  name: string;
  headers: string[];
  rowCount: number;
  createdAt: Date;
  lastUpdated?: Date;
  userId: string;
  organizationId?: string;
  fileUrl: string;
  fileType: 'csv' | 'xlsx' | 'xls';
  fileSize: number;
}

export interface DataFileDTO extends Omit<DataFile, 'createdAt' | 'lastUpdated'> {
  createdAt: Timestamp;
  lastUpdated?: Timestamp;
}
