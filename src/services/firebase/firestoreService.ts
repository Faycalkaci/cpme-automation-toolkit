
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  addDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebaseService';

// Interface pour les types de données
export interface UserProfile {
  id?: string;
  email: string;
  name: string;
  role: 'super-admin' | 'admin' | 'user' | null;
  organizationId?: string;
  organizationName?: string;
  devices?: string[];
  lastLogin?: Timestamp | string;
  lastLocation?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface License {
  id?: string;
  cpme: string;
  plan: 'standard' | 'pro' | 'enterprise';
  status: 'active' | 'expired' | 'pending';
  users: number;
  maxUsers: number;
  startDate: string;
  endDate: string;
  stripeSubscriptionId?: string;
  customerId?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface AutomationLog {
  id?: string;
  type: string;
  details: any;
  status: 'success' | 'error' | 'pending';
  userId?: string;
  timestamp: Timestamp;
}

// Services Firestore
export const firestoreService = {
  // Services Utilisateurs
  users: {
    getAll: async (): Promise<UserProfile[]> => {
      try {
        const usersCol = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCol);
        return usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserProfile));
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        throw error;
      }
    },

    getById: async (userId: string): Promise<UserProfile | null> => {
      try {
        const userDoc = doc(db, 'users', userId);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          return { id: userSnapshot.id, ...userSnapshot.data() } as UserProfile;
        }
        return null;
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        throw error;
      }
    },

    create: async (user: UserProfile): Promise<string> => {
      try {
        user.createdAt = Timestamp.now();
        user.updatedAt = Timestamp.now();
        
        if (user.id) {
          const userDoc = doc(db, 'users', user.id);
          await setDoc(userDoc, user);
          return user.id;
        } else {
          const usersCol = collection(db, 'users');
          const docRef = await addDoc(usersCol, user);
          return docRef.id;
        }
      } catch (error) {
        console.error('Erreur lors de la création de l\'utilisateur:', error);
        throw error;
      }
    },

    update: async (userId: string, userData: Partial<UserProfile>): Promise<void> => {
      try {
        userData.updatedAt = Timestamp.now();
        const userDoc = doc(db, 'users', userId);
        await updateDoc(userDoc, userData);
      } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
        throw error;
      }
    },

    delete: async (userId: string): Promise<void> => {
      try {
        const userDoc = doc(db, 'users', userId);
        await deleteDoc(userDoc);
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'utilisateur:', error);
        throw error;
      }
    },

    getByEmail: async (email: string): Promise<UserProfile | null> => {
      try {
        const usersCol = collection(db, 'users');
        const q = query(usersCol, where('email', '==', email));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          return { id: userDoc.id, ...userDoc.data() } as UserProfile;
        }
        return null;
      } catch (error) {
        console.error('Erreur lors de la recherche de l\'utilisateur par email:', error);
        throw error;
      }
    }
  },

  // Services Licences
  licenses: {
    getAll: async (): Promise<License[]> => {
      try {
        const licensesCol = collection(db, 'licenses');
        const licensesSnapshot = await getDocs(licensesCol);
        return licensesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as License));
      } catch (error) {
        console.error('Erreur lors de la récupération des licences:', error);
        throw error;
      }
    },

    getById: async (licenseId: string): Promise<License | null> => {
      try {
        const licenseDoc = doc(db, 'licenses', licenseId);
        const licenseSnapshot = await getDoc(licenseDoc);
        if (licenseSnapshot.exists()) {
          return { id: licenseSnapshot.id, ...licenseSnapshot.data() } as License;
        }
        return null;
      } catch (error) {
        console.error('Erreur lors de la récupération de la licence:', error);
        throw error;
      }
    },

    create: async (license: License): Promise<string> => {
      try {
        license.createdAt = Timestamp.now();
        license.updatedAt = Timestamp.now();
        
        const licensesCol = collection(db, 'licenses');
        const docRef = await addDoc(licensesCol, license);
        return docRef.id;
      } catch (error) {
        console.error('Erreur lors de la création de la licence:', error);
        throw error;
      }
    },

    update: async (licenseId: string, licenseData: Partial<License>): Promise<void> => {
      try {
        licenseData.updatedAt = Timestamp.now();
        const licenseDoc = doc(db, 'licenses', licenseId);
        await updateDoc(licenseDoc, licenseData);
      } catch (error) {
        console.error('Erreur lors de la mise à jour de la licence:', error);
        throw error;
      }
    },

    delete: async (licenseId: string): Promise<void> => {
      try {
        const licenseDoc = doc(db, 'licenses', licenseId);
        await deleteDoc(licenseDoc);
      } catch (error) {
        console.error('Erreur lors de la suppression de la licence:', error);
        throw error;
      }
    },

    getByCpme: async (cpmeName: string): Promise<License[]> => {
      try {
        const licensesCol = collection(db, 'licenses');
        const q = query(licensesCol, where('cpme', '==', cpmeName));
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as License));
      } catch (error) {
        console.error('Erreur lors de la recherche des licences par CPME:', error);
        throw error;
      }
    },

    getBySubscriptionId: async (subscriptionId: string): Promise<License | null> => {
      try {
        const licensesCol = collection(db, 'licenses');
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
  },

  // Services Logs d'automatisation
  automationLogs: {
    add: async (log: Omit<AutomationLog, 'id' | 'timestamp'>): Promise<string> => {
      try {
        const logWithTimestamp = {
          ...log,
          timestamp: Timestamp.now()
        };
        
        const logsCol = collection(db, 'automationLogs');
        const docRef = await addDoc(logsCol, logWithTimestamp);
        return docRef.id;
      } catch (error) {
        console.error('Erreur lors de l\'ajout du log d\'automatisation:', error);
        throw error;
      }
    },

    getAll: async (): Promise<AutomationLog[]> => {
      try {
        const logsCol = collection(db, 'automationLogs');
        const logsSnapshot = await getDocs(logsCol);
        return logsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AutomationLog));
      } catch (error) {
        console.error('Erreur lors de la récupération des logs d\'automatisation:', error);
        throw error;
      }
    },

    getByUser: async (userId: string): Promise<AutomationLog[]> => {
      try {
        const logsCol = collection(db, 'automationLogs');
        const q = query(logsCol, where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AutomationLog));
      } catch (error) {
        console.error('Erreur lors de la récupération des logs d\'automatisation par utilisateur:', error);
        throw error;
      }
    }
  }
};
