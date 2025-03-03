
import { firebaseAuth } from '@/services/firebase/firebaseService';
import { firestoreService } from '@/services/firebase/firestoreService';
import { getDeviceId, getLocation } from './authUtils';
import { User, UserRole } from './types';
import { User as FirebaseUser } from 'firebase/auth';

export const useAuthMethods = (
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setIsTwoFactorEnabled: React.Dispatch<React.SetStateAction<boolean>>,
  toast: any,
  user: User | null
) => {
  // Login function
  const login = async (email: string, password: string): Promise<FirebaseUser | null> => {
    setIsLoading(true);
    try {
      // Connexion via Firebase Auth
      const result = await firebaseAuth.loginWithEmail(email, password);
      
      // La mise à jour de l'utilisateur se fait via l'effet useEffect qui écoute les changements Firebase
      
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté",
      });
      
      return result;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      toast({
        title: "Échec de la connexion",
        description: "Identifiants incorrects. Veuillez réessayer.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      // Inscription via Firebase Auth
      const fbUser = await firebaseAuth.register(email, password);
      
      // Créer un profil utilisateur dans Firestore
      const userRole: UserRole = 'user';
      const userProfile = {
        email,
        name,
        role: userRole,
        devices: [getDeviceId()],
        lastLogin: new Date().toISOString(),
        lastLocation: await getLocation(),
        id: fbUser.uid
      };
      
      await firestoreService.users.create(userProfile);
      
      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé. Vous êtes maintenant connecté.",
      });
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      toast({
        title: "Échec de l'inscription",
        description: "Impossible de créer le compte. Veuillez réessayer.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    // Déconnexion Firebase
    firebaseAuth.logout();
    
    // Conserver la logique existante pour la rétrocompatibilité
    if (user && user.devices) {
      // Supprimer uniquement l'appareil actuel de la liste
      const deviceId = getDeviceId();
      const updatedDevices = user.devices.filter(device => device !== deviceId);
      
      const updatedUser = { ...user, devices: updatedDevices };
      localStorage.setItem('cpme-user', JSON.stringify(updatedUser));
    }
    
    setUser(null);
    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté avec succès.",
    });
  };

  // Reset password function
  const resetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      // Réinitialisation du mot de passe via Firebase
      await firebaseAuth.resetPassword(email);
      
      toast({
        title: "Email envoyé",
        description: "Instructions de réinitialisation du mot de passe envoyées à votre adresse email.",
      });
    } catch (error) {
      console.error('Erreur de réinitialisation du mot de passe:', error);
      toast({
        title: "Échec de l'envoi",
        description: "Impossible d'envoyer les instructions. Veuillez réessayer.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    register,
    logout,
    resetPassword
  };
};
