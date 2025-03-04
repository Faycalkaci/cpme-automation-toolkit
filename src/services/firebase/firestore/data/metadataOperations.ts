
import { db } from '../../firebaseService';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  query, 
  where, 
  orderBy, 
  Timestamp, 
  DocumentData
} from 'firebase/firestore';
import { toast } from 'sonner';
import { DataFile } from './types';

/**
 * Save metadata about a data file to Firestore
 */
export const saveFileMetadata = async (metadata: DataFile): Promise<void> => {
  try {
    const dataFileRef = doc(db, 'dataFiles', metadata.id);
    
    // Save metadata to Firestore
    await setDoc(dataFileRef, {
      ...metadata,
      createdAt: Timestamp.fromDate(metadata.createdAt)
    });
  } catch (error) {
    console.error('Error saving file metadata to Firestore:', error);
    toast.error('Erreur lors de la sauvegarde des métadonnées');
    throw error;
  }
};

/**
 * Get all data files for a user from Firestore
 */
export const getUserDataFiles = async (userId: string): Promise<DataFile[]> => {
  try {
    const dataFilesRef = collection(db, 'dataFiles');
    const q = query(
      dataFilesRef, 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as DocumentData;
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
};

/**
 * Get metadata for a specific data file
 */
export const getFileMetadata = async (fileId: string): Promise<DataFile | null> => {
  try {
    const dataFileRef = doc(db, 'dataFiles', fileId);
    const dataFileDoc = await getDoc(dataFileRef);
    
    if (!dataFileDoc.exists()) {
      return null;
    }
    
    const data = dataFileDoc.data() as DocumentData;
    return {
      ...data,
      id: dataFileDoc.id,
      createdAt: data.createdAt?.toDate() || new Date(),
      lastUpdated: data.lastUpdated?.toDate(),
    } as DataFile;
  } catch (error) {
    console.error('Error getting file metadata from Firestore:', error);
    toast.error('Erreur lors du chargement des métadonnées');
    throw error;
  }
};
