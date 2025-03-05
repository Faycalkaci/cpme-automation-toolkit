
import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  Firestore, 
  Timestamp,
  orderBy,
  limit
} from 'firebase/firestore';
import { DataFile, DataFileDTO } from './types';
import { dataStorageUtils } from './storageUtils';

export class DataService {
  private db: Firestore;
  private collectionName = 'data';

  constructor(db: Firestore) {
    this.db = db;
  }

  async uploadFile(file: File, userId: string, organizationId?: string): Promise<DataFile> {
    try {
      // Create a unique ID for the file
      const fileId = `${Date.now()}_${file.name.replace(/[^a-z0-9]/gi, '_')}`;
      
      // Upload the file to storage and get the URL
      const fileUrl = await dataStorageUtils.uploadFile(fileId, file);
      
      // Create the file metadata
      const fileType = dataStorageUtils.getFileType(file.name);
      const fileData: Omit<DataFileDTO, 'id'> = {
        name: file.name,
        headers: [], // Will be filled after parsing
        rowCount: 0, // Will be filled after parsing
        createdAt: Timestamp.now(),
        userId,
        organizationId,
        fileUrl,
        fileType,
        fileSize: file.size
      };
      
      // Save metadata to Firestore
      const fileRef = await addDoc(collection(this.db, this.collectionName), fileData);
      
      // Return the complete file data
      return {
        ...fileData,
        id: fileRef.id,
        createdAt: fileData.createdAt.toDate(),
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async getFiles(userId: string, organizationId?: string): Promise<DataFile[]> {
    try {
      let q;
      
      if (organizationId) {
        q = query(
          collection(this.db, this.collectionName),
          where('organizationId', '==', organizationId),
          orderBy('createdAt', 'desc')
        );
      } else {
        q = query(
          collection(this.db, this.collectionName),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        );
      }
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data() as DataFileDTO;
        return {
          ...data,
          id: doc.id,
          createdAt: data.createdAt.toDate(),
          lastUpdated: data.lastUpdated?.toDate(),
        };
      });
    } catch (error) {
      console.error('Error getting files:', error);
      throw error;
    }
  }

  async getFileById(fileId: string): Promise<DataFile | null> {
    try {
      const fileRef = doc(this.db, this.collectionName, fileId);
      const fileSnapshot = await getDoc(fileRef);
      
      if (!fileSnapshot.exists()) {
        return null;
      }
      
      const data = fileSnapshot.data() as DataFileDTO;
      
      return {
        ...data,
        id: fileSnapshot.id,
        createdAt: data.createdAt.toDate(),
        lastUpdated: data.lastUpdated?.toDate(),
      };
    } catch (error) {
      console.error('Error getting file by ID:', error);
      throw error;
    }
  }

  async updateFile(fileId: string, updates: Partial<DataFile>): Promise<void> {
    try {
      const fileRef = doc(this.db, this.collectionName, fileId);
      
      // Convert Date objects to Timestamps
      const firestoreUpdates: any = {
        ...updates,
        lastUpdated: Timestamp.now()
      };
      
      if (updates.createdAt) {
        firestoreUpdates.createdAt = Timestamp.fromDate(updates.createdAt);
      }
      
      await updateDoc(fileRef, firestoreUpdates);
    } catch (error) {
      console.error('Error updating file:', error);
      throw error;
    }
  }

  async deleteFile(fileId: string): Promise<void> {
    try {
      // Get the file to access its URL
      const file = await this.getFileById(fileId);
      
      if (file && file.fileUrl) {
        // Delete from Storage
        await dataStorageUtils.deleteFile(file.fileUrl);
      }
      
      // Delete from Firestore
      const fileRef = doc(this.db, this.collectionName, fileId);
      await deleteDoc(fileRef);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  async getRecentFiles(limit: number = 5, organizationId?: string): Promise<DataFile[]> {
    try {
      let q;
      
      if (organizationId) {
        q = query(
          collection(this.db, this.collectionName),
          where('organizationId', '==', organizationId),
          orderBy('createdAt', 'desc'),
          limit(limit)
        );
      } else {
        q = query(
          collection(this.db, this.collectionName),
          orderBy('createdAt', 'desc'),
          limit(limit)
        );
      }
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data() as DataFileDTO;
        return {
          ...data,
          id: doc.id,
          createdAt: data.createdAt.toDate(),
          lastUpdated: data.lastUpdated?.toDate(),
        };
      });
    } catch (error) {
      console.error('Error getting recent files:', error);
      throw error;
    }
  }
}
