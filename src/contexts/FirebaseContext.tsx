
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
      }
    } catch (error) {
      console.error('Erreur lors du chargement du profil utilisateur:', error);
      toast({
        title: "Erreur de profil",
        description: "Impossible de charger votre profil. Veuillez réessayer.",
        variant: "destructive"
      });
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
    refreshProfile
  };

  return <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>;
};
