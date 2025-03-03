
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
  Timestamp,
  Firestore
} from 'firebase/firestore';
import { UserProfile } from './types';

export class UserService {
  private db: Firestore;
  private collectionName = 'users';

  constructor(db: Firestore) {
    this.db = db;
  }

  async getAll(): Promise<UserProfile[]> {
    try {
      const usersCol = collection(this.db, this.collectionName);
      const usersSnapshot = await getDocs(usersCol);
      return usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserProfile));
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      throw error;
    }
  }

  async getById(userId: string): Promise<UserProfile | null> {
    try {
      const userDoc = doc(this.db, this.collectionName, userId);
      const userSnapshot = await getDoc(userDoc);
      if (userSnapshot.exists()) {
        return { id: userSnapshot.id, ...userSnapshot.data() } as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      throw error;
    }
  }

  async create(user: UserProfile): Promise<string> {
    try {
      user.createdAt = Timestamp.now();
      user.updatedAt = Timestamp.now();
      
      if (user.id) {
        const userDoc = doc(this.db, this.collectionName, user.id);
        await setDoc(userDoc, user);
        return user.id;
      } else {
        const usersCol = collection(this.db, this.collectionName);
        const docRef = await addDoc(usersCol, user);
        return docRef.id;
      }
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      throw error;
    }
  }

  async update(userId: string, userData: Partial<UserProfile>): Promise<void> {
    try {
      userData.updatedAt = Timestamp.now();
      const userDoc = doc(this.db, this.collectionName, userId);
      await updateDoc(userDoc, userData);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      throw error;
    }
  }

  async delete(userId: string): Promise<void> {
    try {
      const userDoc = doc(this.db, this.collectionName, userId);
      await deleteDoc(userDoc);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      throw error;
    }
  }

  async getByEmail(email: string): Promise<UserProfile | null> {
    try {
      const usersCol = collection(this.db, this.collectionName);
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
}
