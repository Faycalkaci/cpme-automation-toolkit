import { collection, doc, setDoc, getDocs, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebaseService';

export class DataChunkService {
  /**
   * Saves data in chunks to a subcollection
   */
  async saveDataChunks(fileId: string, data: any[]): Promise<void> {
    if (data.length === 0) return;
    
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
  }

  /**
   * Retrieves all data chunks for a file
   */
  async getDataChunks(fileId: string): Promise<any[]> {
    const dataFileRef = doc(db, 'dataFiles', fileId);
    const dataCollectionRef = collection(dataFileRef, 'rows');
    
    const chunksSnapshot = await getDocs(query(dataCollectionRef, orderBy('index')));
    
    if (chunksSnapshot.empty) {
      return [];
    }
    
    // Reconstruct all data
    let allRows: any[] = [];
    chunksSnapshot.forEach(doc => {
      const chunkData = doc.data();
      allRows = [...allRows, ...chunkData.rows];
    });
    
    return allRows;
  }

  /**
   * Deletes all data chunks for a file
   */
  async deleteDataChunks(fileId: string): Promise<void> {
    const dataFileRef = doc(db, 'dataFiles', fileId);
    const rowsCollectionRef = collection(dataFileRef, 'rows');
    const rowsSnapshot = await getDocs(rowsCollectionRef);
    
    const deletionPromises: Promise<void>[] = [];
    rowsSnapshot.forEach(doc => {
      deletionPromises.push(deleteDoc(doc.ref));
    });
    
    await Promise.all(deletionPromises);
  }
}

export const dataChunkService = new DataChunkService();
