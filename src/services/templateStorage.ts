
import { toast } from 'sonner';

// Template interface
export interface Template {
  id: string;
  name: string;
  file?: File;
  previewUrl?: string;
  mappingFields: string[];
  createdAt: Date;
  createdBy?: string;
  lastUpdated?: Date;
}

// Storage keys
const TEMPLATES_KEY = 'cpme_pdf_templates';

/**
 * Service for storing and retrieving PDF templates
 * This uses localStorage for a simple implementation, but could be
 * extended to use Firebase, IndexedDB, or another persistent storage solution
 */
export const templateStorage = {
  /**
   * Save a template to storage
   */
  saveTemplate: async (template: Template): Promise<Template> => {
    try {
      // Get existing templates
      const templates = await templateStorage.getTemplates();
      
      // Check if template with same ID already exists
      const existingIndex = templates.findIndex(t => t.id === template.id);
      if (existingIndex >= 0) {
        // Update existing template
        templates[existingIndex] = {
          ...template,
          lastUpdated: new Date()
        };
      } else {
        // Add new template
        templates.push(template);
      }
      
      // Save to localStorage
      localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
      
      // If this were a Firebase implementation, we would do something like:
      // const templatesRef = collection(db, 'templates');
      // await setDoc(doc(templatesRef, template.id), template);
      
      return template;
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Erreur lors de la sauvegarde du modèle');
      throw error;
    }
  },
  
  /**
   * Get all templates from storage
   */
  getTemplates: async (): Promise<Template[]> => {
    try {
      const templatesJson = localStorage.getItem(TEMPLATES_KEY);
      if (!templatesJson) return [];
      
      // Parse templates from localStorage
      const templates = JSON.parse(templatesJson) as Template[];
      
      // Convert date strings to Date objects
      return templates.map(template => ({
        ...template,
        createdAt: new Date(template.createdAt),
        lastUpdated: template.lastUpdated ? new Date(template.lastUpdated) : undefined
      }));
      
      // If this were a Firebase implementation, we would do something like:
      // const templatesRef = collection(db, 'templates');
      // const snapshot = await getDocs(templatesRef);
      // return snapshot.docs.map(doc => doc.data() as Template);
    } catch (error) {
      console.error('Error retrieving templates:', error);
      toast.error('Erreur lors de la récupération des modèles');
      return [];
    }
  },
  
  /**
   * Delete a template from storage
   */
  deleteTemplate: async (templateId: string): Promise<void> => {
    try {
      const templates = await templateStorage.getTemplates();
      const updatedTemplates = templates.filter(t => t.id !== templateId);
      
      localStorage.setItem(TEMPLATES_KEY, JSON.stringify(updatedTemplates));
      
      // If this were a Firebase implementation, we would do something like:
      // const templateRef = doc(db, 'templates', templateId);
      // await deleteDoc(templateRef);
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Erreur lors de la suppression du modèle');
      throw error;
    }
  },
  
  /**
   * Clear all templates (admin use only)
   */
  clearTemplates: async (): Promise<void> => {
    try {
      localStorage.removeItem(TEMPLATES_KEY);
      
      // If this were a Firebase implementation, we would do something like:
      // const templatesRef = collection(db, 'templates');
      // const snapshot = await getDocs(templatesRef);
      // snapshot.docs.forEach(async (doc) => {
      //   await deleteDoc(doc.ref);
      // });
    } catch (error) {
      console.error('Error clearing templates:', error);
      toast.error('Erreur lors de la suppression des modèles');
      throw error;
    }
  }
};

// Firebase implementation notes:
// To use Firebase instead of localStorage:
// 1. Install Firebase SDK: npm install firebase
// 2. Create a Firebase project and configuration
// 3. Replace the localStorage operations with Firebase Firestore operations
// 4. For file storage, use Firebase Storage

/*
Example Firebase implementation (commented out):

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

// Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export const templateStorage = {
  saveTemplate: async (template: Template): Promise<Template> => {
    try {
      // If there's a file, upload it to Firebase Storage
      if (template.file) {
        const storageRef = ref(storage, `templates/${template.id}`);
        await uploadBytes(storageRef, template.file);
        const downloadUrl = await getDownloadURL(storageRef);
        template.previewUrl = downloadUrl;
      }
      
      // Save template metadata to Firestore
      const templatesRef = collection(db, 'templates');
      await setDoc(doc(templatesRef, template.id), {
        ...template,
        file: undefined, // Don't store the File object in Firestore
        createdAt: new Date()
      });
      
      return template;
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Erreur lors de la sauvegarde du modèle');
      throw error;
    }
  },
  
  // Other methods would be similarly implemented using Firebase APIs
};
*/
