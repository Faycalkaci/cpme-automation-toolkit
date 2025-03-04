
import { storage } from '../../firebaseService';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { toast } from 'sonner';

/**
 * Upload a file to Firebase Storage
 */
export const uploadFile = async (fileId: string, file: File): Promise<string> => {
  try {
    const fileRef = ref(storage, `data/${fileId}/${file.name}`);
    await uploadBytes(fileRef, file);
    const fileUrl = await getDownloadURL(fileRef);
    return fileUrl;
  } catch (error) {
    console.error('Error uploading file to Firebase Storage:', error);
    toast.error('Erreur lors de l\'upload du fichier');
    throw error;
  }
};

/**
 * Delete a file from Firebase Storage
 */
export const deleteFile = async (fileUrl: string): Promise<void> => {
  try {
    // Attempt to delete the file from Storage
    const storageRef = ref(storage, fileUrl);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting file from Storage:', error);
    // We continue even if file deletion fails
  }
};

/**
 * Determine the file type from filename
 */
export const determineFileType = (fileName: string): 'csv' | 'xlsx' | 'xls' => {
  if (fileName.toLowerCase().endsWith('.xlsx')) {
    return 'xlsx';
  } else if (fileName.toLowerCase().endsWith('.xls')) {
    return 'xls';
  }
  return 'csv';
};
