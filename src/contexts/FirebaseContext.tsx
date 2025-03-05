
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase/firebaseService';
import { firestoreService, UserProfile } from '@/services/firebase/firestore';
import { useToast } from '@/components/ui/use-toast';

interface FirebaseContextType {
  firebaseUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  refreshProfile: () => Promise<void>;
  hasFirestorePermissions: boolean;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasFirestorePermissions, setHasFirestorePermissions] = useState(true);
  const { toast } = useToast();

  // Load user profile from Firestore
  const loadUserProfile = async (user: FirebaseUser) => {
    try {
      console.log("Attempting to load user profile for:", user.email);
      // Check if user already exists in Firestore
      let profile = await firestoreService.users.getByEmail(user.email || '');
      
      // If user doesn't exist, create a new profile
      if (!profile && user.email) {
        console.log("User profile not found, creating new profile");
        const newUser: UserProfile = {
          email: user.email,
          name: user.displayName || user.email.split('@')[0],
          role: 'user', // Default role
          devices: [],
          uid: user.uid // Store Firebase UID for security checks
        };
        
        const userId = await firestoreService.users.create(newUser);
        profile = { ...newUser, id: userId };
      }
      
      if (profile) {
        // Update last login time
        await firestoreService.users.update(profile.id!, {
          lastLogin: new Date().toISOString()
        });
        
        setUserProfile(profile);
        setHasFirestorePermissions(true);
      }
    } catch (error: any) {
      console.error('Error loading user profile:', error);
      
      // Check if this is a permissions error
      if (error.code === 'permission-denied' || 
          error.message?.includes('Missing or insufficient permissions')) {
        
        console.log("Firestore permissions denied, using local profile");
        setHasFirestorePermissions(false);
        
        // Create a minimal local profile with Firebase user info
        if (user.email) {
          const localProfile: UserProfile = {
            id: user.uid,
            email: user.email,
            name: user.displayName || user.email.split('@')[0],
            role: 'user',
            devices: [],
            uid: user.uid
          };
          setUserProfile(localProfile);
        }

        // Only show toast for permission errors in production
        if (process.env.NODE_ENV === 'production') {
          toast({
            title: "Mode hors ligne activé",
            description: "Certaines fonctionnalités avancées ne sont pas disponibles.",
            variant: "default"
          });
        } else {
          console.log("Running in development mode - suppressing offline mode toast");
        }
      } else {
        toast({
          title: "Erreur de profil",
          description: "Impossible de charger votre profil. Veuillez réessayer.",
          variant: "destructive"
        });
      }
    }
  };

  // Listen for Firebase auth state changes
  useEffect(() => {
    console.log("Setting up Firebase auth state listener");
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      
      if (user) {
        console.log("User is authenticated:", user.email);
        await loadUserProfile(user);
      } else {
        console.log("User logged out or not authenticated");
        setUserProfile(null);
        setHasFirestorePermissions(true); // Reset on logout
      }
      
      setIsLoading(false);
    });
    
    return () => unsubscribe();
  }, [toast]);

  // Function to refresh user profile
  const refreshProfile = async () => {
    if (firebaseUser) {
      setIsLoading(true);
      await loadUserProfile(firebaseUser);
      setIsLoading(false);
    }
  };

  const value = {
    firebaseUser,
    userProfile,
    isLoading,
    refreshProfile,
    hasFirestorePermissions
  };

  return <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>;
};
