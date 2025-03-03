
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  listAll, 
  deleteObject 
} from 'firebase/storage';
import { storage } from './firebaseService';

export const storageService = {
  // Télécharger un fichier
  uploadFile: async (file: File, path: string): Promise<string> => {
    try {
      const storageRef = ref(storage, `${path}/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    } catch (error) {
      console.error('Erreur lors du téléchargement du fichier:', error);
      throw error;
    }
  },

  // Télécharger un fichier avec un nom personnalisé
  uploadFileWithCustomName: async (file: File, path: string, customName: string): Promise<string> => {
    try {
      const fileExtension = file.name.split('.').pop();
      const fileName = `${customName}.${fileExtension}`;
      const storageRef = ref(storage, `${path}/${fileName}`);
      
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    } catch (error) {
      console.error('Erreur lors du téléchargement du fichier:', error);
      throw error;
    }
  },

  // Télécharger un Blob (pour les fichiers PDF générés)
  uploadBlob: async (blob: Blob, path: string, fileName: string): Promise<string> => {
    try {
      const storageRef = ref(storage, `${path}/${fileName}`);
      const snapshot = await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    } catch (error) {
      console.error('Erreur lors du téléchargement du blob:', error);
      throw error;
    }
  },

  // Obtenir l'URL de téléchargement d'un fichier
  getFileURL: async (path: string): Promise<string> => {
    try {
      const storageRef = ref(storage, path);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'URL du fichier:', error);
      throw error;
    }
  },

  // Lister tous les fichiers dans un dossier
  listFiles: async (path: string): Promise<string[]> => {
    try {
      const storageRef = ref(storage, path);
      const res = await listAll(storageRef);
      
      const urls = await Promise.all(
        res.items.map(async (itemRef) => {
          return await getDownloadURL(itemRef);
        })
      );
      
      return urls;
    } catch (error) {
      console.error('Erreur lors de la récupération des fichiers:', error);
      throw error;
    }
  },

  // Supprimer un fichier
  deleteFile: async (path: string): Promise<void> => {
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Erreur lors de la suppression du fichier:', error);
      throw error;
    }
  }
};
