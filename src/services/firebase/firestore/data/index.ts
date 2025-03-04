
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { uploadFile, deleteFile, determineFileType } from './fileOperations';
import { saveDataRows, getDataRows } from './dataOperations';
import { saveFileMetadata, getUserDataFiles, getFileMetadata } from './metadataOperations';
import { DataFile } from './types';
import { collection, doc, deleteDoc, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseService';

export class DataService {
  private collectionRef;
  
  constructor(firestore = db) {
    this.collectionRef = collection(firestore, 'dataFiles');
  }
  
  /**
   * Save a data file to Firestore and Storage
   */
  async saveDataFile(
    file: File, 
    headers: string[], 
    data: any[], 
    userId: string, 
    organizationId?: string
  ): Promise<string> {
    try {
      const fileId = uuidv4();
      
      // Upload file to Storage
      const fileUrl = await uploadFile(fileId, file);
      
      // Determine file type
      const fileType = determineFileType(file.name);
      
      // Prepare metadata for Firestore
      const dataFileData: DataFile = {
        id: fileId,
        name: file.name,
        headers,
        rowCount: data.length,
        createdAt: new Date(),
        userId,
        organizationId,
        fileUrl,
        fileType,
        fileSize: file.size
      };
      
      // Save metadata to Firestore
      await saveFileMetadata(dataFileData);
      
      // Save the actual data rows
      if (data.length > 0) {
        await saveDataRows(fileId, data);
      }
      
      return fileId;
    } catch (error) {
      console.error('Error saving data file:', error);
      toast.error('Erreur lors de la sauvegarde du fichier de données');
      throw error;
    }
  }
  
  /**
   * Get all data files for a user
   */
  async getDataFiles(userId: string): Promise<DataFile[]> {
    return getUserDataFiles(userId);
  }
  
  /**
   * Get data rows for a specific file
   */
  async getDataFileRows(fileId: string): Promise<any[]> {
    return getDataRows(fileId);
  }
  
  /**
   * Delete a data file
   */
  async deleteDataFile(fileId: string): Promise<void> {
    try {
      // Get file metadata
      const dataFile = await getFileMetadata(fileId);
      
      if (!dataFile) {
        throw new Error('Data file not found');
      }
      
      // Delete rows in the subcollection
      const dataFileRef = doc(this.collectionRef, fileId);
      const rowsCollectionRef = collection(dataFileRef, 'rows');
      const rowsSnapshot = await getDocs(rowsCollectionRef);
      
      const deletionPromises: Promise<void>[] = [];
      rowsSnapshot.forEach(doc => {
        deletionPromises.push(deleteDoc(doc.ref));
      });
      
      await Promise.all(deletionPromises);
      
      // Delete the main document
      await deleteDoc(dataFileRef);
      
      // Delete the file in Storage
      if (dataFile.fileUrl) {
        await deleteFile(dataFile.fileUrl);
      }
    } catch (error) {
      console.error('Error deleting data file:', error);
      toast.error('Erreur lors de la suppression du fichier de données');
      throw error;
    }
  }
}

// Export types and utilities for external use
export * from './types';
export * from './fileOperations';
export * from './dataOperations';
export * from './metadataOperations';
