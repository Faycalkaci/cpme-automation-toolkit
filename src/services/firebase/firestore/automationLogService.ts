
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  addDoc,
  Timestamp,
  Firestore
} from 'firebase/firestore';
import { AutomationLog } from './types';

export class AutomationLogService {
  private db: Firestore;
  private collectionName = 'automationLogs';

  constructor(db: Firestore) {
    this.db = db;
  }

  async add(log: Omit<AutomationLog, 'id' | 'timestamp'>): Promise<string> {
    try {
      const logWithTimestamp = {
        ...log,
        timestamp: Timestamp.now()
      };
      
      const logsCol = collection(this.db, this.collectionName);
      const docRef = await addDoc(logsCol, logWithTimestamp);
      return docRef.id;
    } catch (error) {
      console.error('Erreur lors de l\'ajout du log d\'automatisation:', error);
      throw error;
    }
  }

  async getAll(): Promise<AutomationLog[]> {
    try {
      const logsCol = collection(this.db, this.collectionName);
      const logsSnapshot = await getDocs(logsCol);
      return logsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AutomationLog));
    } catch (error) {
      console.error('Erreur lors de la récupération des logs d\'automatisation:', error);
      throw error;
    }
  }

  async getByUser(userId: string): Promise<AutomationLog[]> {
    try {
      const logsCol = collection(this.db, this.collectionName);
      const q = query(logsCol, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AutomationLog));
    } catch (error) {
      console.error('Erreur lors de la récupération des logs d\'automatisation par utilisateur:', error);
      throw error;
    }
  }
}
