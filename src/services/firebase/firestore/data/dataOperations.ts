import { db } from '../../firebaseService';
import { 
  collection, 
  doc, 
  getDocs, 
  query, 
  orderBy, 
  setDoc
} from 'firebase/firestore';
import { toast } from 'sonner';

/**
 * Save data rows to Firestore, optionally in chunks
 */
export const saveDataRows = async (fileId: string, data: any[]): Promise<void> => {
  try {
    const dataFileRef = doc(db, 'dataFiles', fileId);
    const dataCollectionRef = collection(dataFileRef, 'rows');
    
    // If less than 500 rows, store in a single document
    if (data.length <= 500) {
      await setDoc(doc(dataCollectionRef, 'chunk-0'), {
        rows: data,
        index: 0
      });
    } else {
      // Otherwise divide into chunks of 500 rows
      const chunkSize = 500;
      for (let i = 0; i < data.length; i += chunkSize) {
        const chunk = data.slice(i, i + chunkSize);
        await setDoc(doc(dataCollectionRef, `chunk-${i/chunkSize}`), {
          rows: chunk,
          index: i/chunkSize
        });
      }
    }
  } catch (error) {
    console.error('Error saving data rows to Firestore:', error);
    toast.error('Erreur lors de la sauvegarde des données');
    throw error;
  }
};

/**
 * Retrieve all data rows from Firestore (potentially from multiple chunks)
 */
export const getDataRows = async (fileId: string): Promise<any[]> => {
  try {
    const dataFileRef = doc(db, 'dataFiles', fileId);
    const dataCollectionRef = collection(dataFileRef, 'rows');
    
    const chunksSnapshot = await getDocs(query(dataCollectionRef, orderBy('index')));
    
    if (chunksSnapshot.empty) {
      return [];
    }
    
    // Reconstruct all data from chunks
    let allRows: any[] = [];
    chunksSnapshot.forEach(doc => {
      const chunkData = doc.data();
      allRows = [...allRows, ...chunkData.rows];
    });
    
    return allRows;
  } catch (error) {
    console.error('Error getting data rows from Firestore:', error);
    toast.error('Erreur lors du chargement des données');
    throw error;
  }
};
