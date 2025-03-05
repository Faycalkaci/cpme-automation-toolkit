
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
import { Template } from '@/components/admin/templates/types';

export class TemplateService {
  private collectionRef;
  
  constructor(firestore = db) {
    this.collectionRef = collection(firestore, 'templates');
  }
  
  /**
   * Sauvegarde un template dans Firestore et son fichier dans Storage
   */
  async saveTemplate(template: Template, isAdmin: boolean = false): Promise<string> {
    console.log('TemplateService.saveTemplate called with:', { id: template.id, name: template.name, isAdmin });
    try {
      const templateId = template.id || Date.now().toString();
      const templateRef = doc(this.collectionRef, templateId);
      
      // Si le template a un fichier, on l'upload dans Storage
      let fileUrl = template.fileUrl;
      if (template.file) {
        console.log('Uploading file to Storage:', template.file.name);
        const fileRef = ref(storage, `templates/${templateId}/${template.file.name}`);
        await uploadBytes(fileRef, template.file);
        fileUrl = await getDownloadURL(fileRef);
        console.log('File uploaded successfully, fileUrl:', fileUrl);
      }
      
      // Préparer les données pour Firestore
      const templateData = {
        ...template,
        id: templateId,
        fileUrl,
        createdAt: template.createdAt || Timestamp.now(),
        lastUpdated: Timestamp.now(),
        isAdmin,
        // Supprimer le File object car il n'est pas serialisable
        file: undefined
      };
      
      console.log('Saving template data to Firestore');
      // Sauvegarder dans Firestore
      await setDoc(templateRef, templateData);
      console.log('Template saved successfully to Firestore');
      
      return templateId;
    } catch (error) {
      console.error('Error saving template to Firestore:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message, error.stack);
      }
      toast.error('Erreur lors de la sauvegarde du modèle');
      throw error;
    }
  }
  
  /**
   * Récupère tous les templates depuis Firestore
   */
  async getTemplates(isAdmin: boolean = false): Promise<Template[]> {
    console.log('TemplateService.getTemplates called, isAdmin:', isAdmin);
    try {
      let q;
      if (isAdmin) {
        // Admin peut voir tous les templates
        console.log('Admin query - getting all templates');
        q = query(
          this.collectionRef, 
          orderBy('createdAt', 'desc')
        );
      } else {
        // Utilisateurs normaux ne voient que les templates permanents
        console.log('User query - getting only permanent templates');
        q = query(
          this.collectionRef, 
          where('permanent', '==', true),
          orderBy('createdAt', 'desc')
        );
      }
      
      console.log('Executing Firestore query');
      const querySnapshot = await getDocs(q);
      console.log('Query complete, documents count:', querySnapshot.docs.length);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data() as DocumentData;
        return {
          ...data,
          id: doc.id,
          createdAt: data.createdAt?.toDate() || new Date(),
          lastUpdated: data.lastUpdated?.toDate(),
        } as Template;
      });
    } catch (error) {
      console.error('Error getting templates from Firestore:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message, error.stack);
      }
      toast.error('Erreur lors du chargement des modèles');
      throw error;
    }
  }
  
  /**
   * Récupère un template par son ID
   */
  async getTemplateById(templateId: string): Promise<Template | null> {
    console.log('TemplateService.getTemplateById called for ID:', templateId);
    try {
      const templateRef = doc(this.collectionRef, templateId);
      const templateDoc = await getDoc(templateRef);
      
      if (!templateDoc.exists()) {
        console.log('Template not found');
        return null;
      }
      
      const data = templateDoc.data() as DocumentData;
      return {
        ...data,
        id: templateDoc.id,
        createdAt: data.createdAt?.toDate() || new Date(),
        lastUpdated: data.lastUpdated?.toDate(),
      } as Template;
    } catch (error) {
      console.error('Error getting template by ID from Firestore:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message, error.stack);
      }
      toast.error('Erreur lors du chargement du modèle');
      throw error;
    }
  }
  
  /**
   * Supprime un template
   */
  async deleteTemplate(templateId: string): Promise<void> {
    console.log('TemplateService.deleteTemplate called for ID:', templateId);
    try {
      // Récupérer les infos du template pour avoir l'URL du fichier
      const template = await this.getTemplateById(templateId);
      
      // Supprimer le document Firestore
      console.log('Deleting document from Firestore');
      const templateRef = doc(this.collectionRef, templateId);
      await deleteDoc(templateRef);
      
      // Si le template a un fichier, le supprimer de Storage
      if (template && template.fileUrl) {
        console.log('Template has fileUrl, deleting from Storage:', template.fileUrl);
        try {
          // Extraire le chemin du fichier à partir de l'URL
          const storageRef = ref(storage, template.fileUrl);
          await deleteObject(storageRef);
          console.log('File deleted successfully from Storage');
        } catch (storageError) {
          console.error('Error deleting template file from Storage:', storageError);
          // On continue même si la suppression du fichier échoue
        }
      }
    } catch (error) {
      console.error('Error deleting template from Firestore:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message, error.stack);
      }
      toast.error('Erreur lors de la suppression du modèle');
      throw error;
    }
  }
  
  /**
   * Met à jour un template existant
   */
  async updateTemplate(templateId: string, updates: Partial<Template>): Promise<void> {
    console.log('TemplateService.updateTemplate called for ID:', templateId);
    try {
      const templateRef = doc(this.collectionRef, templateId);
      
      // Ajouter lastUpdated aux mises à jour
      const updatesWithTimestamp = {
        ...updates,
        lastUpdated: Timestamp.now()
      };
      
      console.log('Updating document in Firestore');
      await updateDoc(templateRef, updatesWithTimestamp);
      console.log('Document updated successfully');
    } catch (error) {
      console.error('Error updating template in Firestore:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message, error.stack);
      }
      toast.error('Erreur lors de la mise à jour du modèle');
      throw error;
    }
  }
}
