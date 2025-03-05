
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { collection, doc, setDoc, getDoc, getDocs, deleteDoc, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../../firebaseService';
import { DataFile, DataFileDTO } from './types';
import { dataStorageUtils } from './storageUtils';
import { dataChunkService } from './dataChunkService';

export class DataService {
  private collectionRef;
  
  constructor(firestore = db) {
    this.collectionRef = collection(firestore, 'dataFiles');
  }
  
  /**
   * Saves a data file to Firestore and Storage
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
      const dataFileRef = doc(this.collectionRef, fileId);
      
      // Upload the file to Storage
      const fileUrl = await dataStorageUtils.uploadFile(fileId, file);
      
      // Determine file type
      const fileType = dataStorageUtils.getFileType(file.name);
      
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
      await setDoc(dataFileRef, {
        ...dataFileData,
        createdAt: Timestamp.fromDate(dataFileData.createdAt)
      });
      
      // Save data chunks if necessary
      await dataChunkService.saveDataChunks(fileId, data);
      
      return fileId;
    } catch (error) {
      console.error('Error saving data file to Firestore:', error);
      toast.error('Erreur lors de la sauvegarde du fichier de données');
      throw error;
    }
  }
  
  /**
   * Retrieves all data files for a user
   */
  async getDataFiles(userId: string): Promise<DataFile[]> {
    try {
      const q = query(
        this.collectionRef, 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data() as DataFileDTO;
        return {
          ...data,
          id: doc.id,
          createdAt: data.createdAt?.toDate() || new Date(),
          lastUpdated: data.lastUpdated?.toDate(),
        } as DataFile;
      });
    } catch (error) {
      console.error('Error getting data files from Firestore:', error);
      toast.error('Erreur lors du chargement des fichiers de données');
      throw error;
    }
  }
  
  /**
   * Retrieves data for a file
   */
  async getDataFileRows(fileId: string): Promise<any[]> {
    try {
      return await dataChunkService.getDataChunks(fileId);
    } catch (error) {
      console.error('Error getting data file rows from Firestore:', error);
      toast.error('Erreur lors du chargement des données');
      throw error;
    }
  }
  
  /**
   * Deletes a data file
   */
  async deleteDataFile(fileId: string): Promise<void> {
    try {
      // Get file info to have the URL
      const dataFileRef = doc(this.collectionRef, fileId);
      const dataFileDoc = await getDoc(dataFileRef);
      
      if (!dataFileDoc.exists()) {
        throw new Error('Data file not found');
      }
      
      const dataFile = dataFileDoc.data() as DataFile;
      
      // Delete rows in the subcollection
      await dataChunkService.deleteDataChunks(fileId);
      
      // Delete the main document
      await deleteDoc(dataFileRef);
      
      // Delete the file in Storage
      if (dataFile.fileUrl) {
        await dataStorageUtils.deleteFile(dataFile.fileUrl);
      }
    } catch (error) {
      console.error('Error deleting data file from Firestore:', error);
      toast.error('Erreur lors de la suppression du fichier de données');
      throw error;
    }
  }
}
