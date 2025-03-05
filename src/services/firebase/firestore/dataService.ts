
import { db, storage } from '../firebaseService';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  Timestamp, 
  updateDoc,
  DocumentData
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

// Type pour les métadonnées d'un fichier de données
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

export class DataService {
  private collectionRef;
  
  constructor(firestore = db) {
    this.collectionRef = collection(firestore, 'dataFiles');
  }
  
  /**
   * Sauvegarde un fichier de données dans Firestore et Storage
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
      
      // Upload du fichier dans Storage
      const fileRef = ref(storage, `data/${fileId}/${file.name}`);
      await uploadBytes(fileRef, file);
      const fileUrl = await getDownloadURL(fileRef);
      
      // Déterminer le type de fichier
      let fileType: 'csv' | 'xlsx' | 'xls' = 'csv';
      if (file.name.toLowerCase().endsWith('.xlsx')) {
        fileType = 'xlsx';
      } else if (file.name.toLowerCase().endsWith('.xls')) {
        fileType = 'xls';
      }
      
      // Préparer les métadonnées pour Firestore
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
      
      // Sauvegarder les métadonnées dans Firestore
      await setDoc(dataFileRef, {
        ...dataFileData,
        createdAt: Timestamp.fromDate(dataFileData.createdAt)
      });
      
      // Sauvegarder les données en chunks si nécessaire
      // Pour de gros fichiers, on pourrait diviser en plusieurs documents
      if (data.length > 0) {
        // On stocke les données dans une sous-collection
        const dataCollectionRef = collection(dataFileRef, 'rows');
        
        // Si moins de 500 lignes, on stocke tout en un seul document
        if (data.length <= 500) {
          await setDoc(doc(dataCollectionRef, 'chunk-0'), {
            rows: data,
            index: 0
          });
        } else {
          // Sinon on divise en chunks de 500 lignes
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
      
      return fileId;
    } catch (error) {
      console.error('Error saving data file to Firestore:', error);
      toast.error('Erreur lors de la sauvegarde du fichier de données');
      throw error;
    }
  }
  
  /**
   * Récupère tous les fichiers de données pour un utilisateur
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
  }
  
  /**
   * Récupère les données d'un fichier
   */
  async getDataFileRows(fileId: string): Promise<any[]> {
    try {
      const dataFileRef = doc(this.collectionRef, fileId);
      const dataCollectionRef = collection(dataFileRef, 'rows');
      
      const chunksSnapshot = await getDocs(query(dataCollectionRef, orderBy('index')));
      
      if (chunksSnapshot.empty) {
        return [];
      }
      
      // Reconstituer toutes les données
      let allRows: any[] = [];
      chunksSnapshot.forEach(doc => {
        const chunkData = doc.data();
        allRows = [...allRows, ...chunkData.rows];
      });
      
      return allRows;
    } catch (error) {
      console.error('Error getting data file rows from Firestore:', error);
      toast.error('Erreur lors du chargement des données');
      throw error;
    }
  }
  
  /**
   * Supprime un fichier de données
   */
  async deleteDataFile(fileId: string): Promise<void> {
    try {
      // Récupérer les infos du fichier pour avoir l'URL
      const dataFileRef = doc(this.collectionRef, fileId);
      const dataFileDoc = await getDoc(dataFileRef);
      
      if (!dataFileDoc.exists()) {
        throw new Error('Data file not found');
      }
      
      const dataFile = dataFileDoc.data() as DataFile;
      
      // Supprimer les rows dans la sous-collection
      const rowsCollectionRef = collection(dataFileRef, 'rows');
      const rowsSnapshot = await getDocs(rowsCollectionRef);
      
      const deletionPromises: Promise<void>[] = [];
      rowsSnapshot.forEach(doc => {
        deletionPromises.push(deleteDoc(doc.ref));
      });
      
      await Promise.all(deletionPromises);
      
      // Supprimer le document principal
      await deleteDoc(dataFileRef);
      
      // Supprimer le fichier dans Storage
      if (dataFile.fileUrl) {
        try {
          // Extraire le chemin du fichier à partir de l'URL
          const storageRef = ref(storage, dataFile.fileUrl);
          await deleteObject(storageRef);
        } catch (storageError) {
          console.error('Error deleting data file from Storage:', storageError);
          // On continue même si la suppression du fichier échoue
        }
      }
    } catch (error) {
      console.error('Error deleting data file from Firestore:', error);
      toast.error('Erreur lors de la suppression du fichier de données');
      throw error;
    }
  }
}
