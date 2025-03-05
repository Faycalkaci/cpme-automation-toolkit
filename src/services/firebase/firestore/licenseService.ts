
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  addDoc,
  Timestamp,
  Firestore
} from 'firebase/firestore';
import { License } from './types';

export class LicenseService {
  private db: Firestore;
  private collectionName = 'licenses';

  constructor(db: Firestore) {
    this.db = db;
  }

  async getAll(): Promise<License[]> {
    try {
      const licensesCol = collection(this.db, this.collectionName);
      const licensesSnapshot = await getDocs(licensesCol);
      return licensesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as License));
    } catch (error) {
      console.error('Erreur lors de la récupération des licences:', error);
      throw error;
    }
  }

  async getById(licenseId: string): Promise<License | null> {
    try {
      const licenseDoc = doc(this.db, this.collectionName, licenseId);
      const licenseSnapshot = await getDoc(licenseDoc);
      if (licenseSnapshot.exists()) {
        return { id: licenseSnapshot.id, ...licenseSnapshot.data() } as License;
      }
      return null;
    } catch (error) {
      console.error('Erreur lors de la récupération de la licence:', error);
      throw error;
    }
  }

  async create(license: License): Promise<string> {
    try {
      license.createdAt = Timestamp.now();
      license.updatedAt = Timestamp.now();
      
      const licensesCol = collection(this.db, this.collectionName);
      const docRef = await addDoc(licensesCol, license);
      return docRef.id;
    } catch (error) {
      console.error('Erreur lors de la création de la licence:', error);
      throw error;
    }
  }

  async update(licenseId: string, licenseData: Partial<License>): Promise<void> {
    try {
      licenseData.updatedAt = Timestamp.now();
      const licenseDoc = doc(this.db, this.collectionName, licenseId);
      await updateDoc(licenseDoc, licenseData);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la licence:', error);
      throw error;
    }
  }

  async delete(licenseId: string): Promise<void> {
    try {
      const licenseDoc = doc(this.db, this.collectionName, licenseId);
      await deleteDoc(licenseDoc);
    } catch (error) {
      console.error('Erreur lors de la suppression de la licence:', error);
      throw error;
    }
  }

  async getByCpme(cpmeName: string): Promise<License[]> {
    try {
      const licensesCol = collection(this.db, this.collectionName);
      const q = query(licensesCol, where('cpme', '==', cpmeName));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as License));
    } catch (error) {
      console.error('Erreur lors de la recherche des licences par CPME:', error);
      throw error;
    }
  }

  async getBySubscriptionId(subscriptionId: string): Promise<License | null> {
    try {
      const licensesCol = collection(this.db, this.collectionName);
      const q = query(licensesCol, where('stripeSubscriptionId', '==', subscriptionId));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const licenseDoc = querySnapshot.docs[0];
        return { id: licenseDoc.id, ...licenseDoc.data() } as License;
      }
      return null;
    } catch (error) {
      console.error('Erreur lors de la recherche de la licence par ID d\'abonnement:', error);
      throw error;
    }
  }
}
