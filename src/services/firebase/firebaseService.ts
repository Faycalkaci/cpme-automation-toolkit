
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
export const googleProvider = new GoogleAuthProvider();

// Additional config for Google provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Authentication service
export const firebaseAuth = {
  // Email/password login
  loginWithEmail: async (email: string, password: string) => {
    try {
      console.log("Attempting email login for:", email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Email login successful");
      return userCredential.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Google login
  loginWithGoogle: async () => {
    try {
      console.log("Attempting Google login");
      // Explicitly use popup resolver
      const result = await signInWithPopup(auth, googleProvider, browserPopupRedirectResolver);
      console.log("Google login successful:", result.user.email);
      return result.user;
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        console.log("Popup closed by user");
        throw new Error("Connexion annulée. La fenêtre a été fermée.");
      } else if (error.code === 'auth/popup-blocked') {
        console.error("Popup blocked by browser");
        throw new Error("Le navigateur a bloqué la fenêtre de connexion. Veuillez autoriser les popups pour ce site.");
      } else if (error.message?.includes('Cross-Origin-Opener-Policy')) {
        console.error("CORS policy error during Google auth");
        throw new Error("Erreur CORS: Essayez un autre navigateur ou désactivez les extensions de blocage.");
      }
      
      console.error('Google login error:', error);
      throw error;
    }
  },

  // Registration
  register: async (email: string, password: string) => {
    try {
      console.log("Registering new user:", email);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Registration successful");
      return userCredential.user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      console.log("Logging out user");
      await signOut(auth);
      console.log("Logout successful");
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  // Password reset
  resetPassword: async (email: string) => {
    try {
      console.log("Sending password reset email to:", email);
      await sendPasswordResetEmail(auth, email);
      console.log("Password reset email sent");
      return true;
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  },

  // Get current auth state
  getCurrentUser: (): User | null => {
    return auth.currentUser;
  }
};
