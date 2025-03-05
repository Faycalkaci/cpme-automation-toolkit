
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

  // Charger le profil utilisateur depuis Firestore
  const loadUserProfile = async (user: FirebaseUser) => {
    try {
      // Vérifier si l'utilisateur existe déjà dans Firestore
      let profile = await firestoreService.users.getByEmail(user.email || '');
      
      // Si l'utilisateur n'existe pas, créer un nouveau profil
      if (!profile && user.email) {
        const newUser: UserProfile = {
          email: user.email,
          name: user.displayName || user.email.split('@')[0],
          role: 'user', // Rôle par défaut
          devices: []
        };
        
        const userId = await firestoreService.users.create(newUser);
        profile = { ...newUser, id: userId };
      }
      
      if (profile) {
        // Mettre à jour le dernier login
        await firestoreService.users.update(profile.id!, {
          lastLogin: new Date().toISOString()
        });
        
        setUserProfile(profile);
        setHasFirestorePermissions(true);
      }
    } catch (error: any) {
      console.error('Erreur lors du chargement du profil utilisateur:', error);
      
      // Check if this is a permissions error
      if (error.code === 'permission-denied' || 
          error.message?.includes('Missing or insufficient permissions')) {
        
        setHasFirestorePermissions(false);
        
        // Create a minimal local profile with the Firebase user info
        if (user.email) {
          const localProfile: UserProfile = {
            id: user.uid,
            email: user.email,
            name: user.displayName || user.email.split('@')[0],
            role: 'user',
            devices: []
          };
          setUserProfile(localProfile);
        }

        // Only show toast for permission errors in non-development environments
        if (process.env.NODE_ENV !== 'development') {
          toast({
            title: "Mode hors ligne activé",
            description: "Certaines fonctionnalités avancées ne sont pas disponibles.",
            variant: "default"
          });
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

  // Écouter les changements d'état d'authentification Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      
      if (user) {
        await loadUserProfile(user);
      } else {
        setUserProfile(null);
        setHasFirestorePermissions(true); // Reset on logout
      }
      
      setIsLoading(false);
    });
    
    return () => unsubscribe();
  }, [toast]);

  // Fonction pour actualiser le profil utilisateur
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
