
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  User,
  browserPopupRedirectResolver
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';
import { firebaseConfig } from './config';

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
export const googleProvider = new GoogleAuthProvider();

// Configuration supplémentaire pour le provider Google
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Service d'authentification
export const firebaseAuth = {
  // Connexion avec email/mot de passe
  loginWithEmail: async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw error;
    }
  },

  // Connexion avec Google
  loginWithGoogle: async () => {
    try {
      // Utiliser le resolver de popup explicitement
      const result = await signInWithPopup(auth, googleProvider, browserPopupRedirectResolver);
      console.log("Connexion Google réussie:", result.user);
      return result.user;
    } catch (error) {
      console.error('Erreur de connexion Google:', error);
      throw error;
    }
  },

  // Inscription
  register: async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      throw error;
    }
  },

  // Déconnexion
  logout: async () => {
    try {
      await signOut(auth);
      return true;
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
      throw error;
    }
  },

  // Réinitialisation du mot de passe
  resetPassword: async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (error) {
      console.error('Erreur de réinitialisation du mot de passe:', error);
      throw error;
    }
  },

  // État actuel de l'authentification
  getCurrentUser: (): User | null => {
    return auth.currentUser;
  }
};
