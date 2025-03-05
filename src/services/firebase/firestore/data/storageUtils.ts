
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../../firebaseService';

export const dataStorageUtils = {
  /**
   * Uploads a file to Firebase Storage
   */
  async uploadFile(fileId: string, file: File): Promise<string> {
    const fileRef = ref(storage, `data/${fileId}/${file.name}`);
    await uploadBytes(fileRef, file);
    return getDownloadURL(fileRef);
  },

  /**
   * Deletes a file from Firebase Storage
   */
  async deleteFile(fileUrl: string): Promise<void> {
    try {
      const storageRef = ref(storage, fileUrl);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Error deleting file from Storage:', error);
      // We continue even if deletion fails
    }
  },

  /**
   * Determines the file type based on file name
   */
  getFileType(fileName: string): 'csv' | 'xlsx' | 'xls' {
    const lowerCaseName = fileName.toLowerCase();
    if (lowerCaseName.endsWith('.xlsx')) {
      return 'xlsx';
    } else if (lowerCaseName.endsWith('.xls')) {
      return 'xls';
    }
    return 'csv';
  }
};
