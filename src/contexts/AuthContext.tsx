
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { firebaseAuth } from '@/services/firebase/firebaseService';
import { firestoreService, UserProfile } from '@/services/firebase/firestoreService';
import { useFirebase } from './FirebaseContext';

type UserRole = 'super-admin' | 'admin' | 'user' | null;

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organizationId?: string;
  organizationName?: string;
  devices?: string[];
  lastLogin?: string;
  lastLocation?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  enableTwoFactorAuth: () => Promise<void>;
  verifyTwoFactorCode: (code: string) => Promise<boolean>;
  isTwoFactorEnabled: boolean;
  checkDeviceLimit: () => boolean;
  getDeviceCount: () => number;
  MAX_DEVICES: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
  const { toast } = useToast();
  const { userProfile, isLoading: isFirebaseLoading } = useFirebase();
  
  const MAX_DEVICES = 3; // Limite maximale d'appareils connectés par compte

  // Mettre à jour l'utilisateur lorsque le profil Firebase change
  useEffect(() => {
    if (!isFirebaseLoading && userProfile) {
      // Convertir le profil Firebase en format utilisateur pour notre application
      const convertedUser: User = {
        id: userProfile.id || '',
        email: userProfile.email,
        name: userProfile.name,
        role: userProfile.role,
        organizationId: userProfile.organizationId,
        organizationName: userProfile.organizationName,
        devices: userProfile.devices,
        lastLogin: userProfile.lastLogin,
        lastLocation: userProfile.lastLocation
      };
      
      setUser(convertedUser);
      setIsLoading(false);
    } else if (!isFirebaseLoading) {
      setUser(null);
      setIsLoading(false);
    }
  }, [isFirebaseLoading, userProfile]);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Cette logique est maintenant gérée par Firebase Context
        // Le code existant reste pour la rétrocompatibilité
        
        // Si Firebase n'est pas utilisé, vérifier l'authentification locale
        if (!userProfile) {
          const storedUser = localStorage.getItem('cpme-user');
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            
            // Ajouter l'appareil actuel s'il n'est pas déjà enregistré
            const deviceId = getDeviceId();
            if (!parsedUser.devices) {
              parsedUser.devices = [deviceId];
            } else if (!parsedUser.devices.includes(deviceId)) {
              // Vérifier la limite d'appareils
              if (parsedUser.devices.length >= MAX_DEVICES) {
                toast({
                  title: "Limite d'appareils atteinte",
                  description: "Vous avez atteint le nombre maximum d'appareils autorisés.",
                  variant: "destructive"
                });
                localStorage.removeItem('cpme-user');
                setUser(null);
                setIsLoading(false);
                return;
              }
              parsedUser.devices.push(deviceId);
            }
            
            // Mettre à jour la dernière connexion et localisation
            parsedUser.lastLogin = new Date().toISOString();
            parsedUser.lastLocation = await getLocation();
            
            // Sauvegarder les modifications
            localStorage.setItem('cpme-user', JSON.stringify(parsedUser));
            setUser(parsedUser);
          }
        }
      } catch (error) {
        console.error('Erreur d\'authentification:', error);
      } finally {
        if (isLoading && !isFirebaseLoading) {
          setIsLoading(false);
        }
      }
    };

    checkAuth();
  }, [toast, isFirebaseLoading, userProfile]);

  // Générer un ID unique pour l'appareil
  const getDeviceId = () => {
    let deviceId = localStorage.getItem('cpme-device-id');
    if (!deviceId) {
      deviceId = `device_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('cpme-device-id', deviceId);
    }
    return deviceId;
  };

  // Obtenir la géolocalisation de l'utilisateur
  const getLocation = async (): Promise<string> => {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      return `${position.coords.latitude},${position.coords.longitude}`;
    } catch (error) {
      console.error('Erreur de géolocalisation:', error);
      return 'Localisation inconnue';
    }
  };

  // Vérifier la limite d'appareils
  const checkDeviceLimit = () => {
    if (!user || !user.devices) return true;
    return user.devices.length < MAX_DEVICES;
  };

  // Obtenir le nombre d'appareils connectés
  const getDeviceCount = () => {
    if (!user || !user.devices) return 0;
    return user.devices.length;
  };

  // Fonction de connexion avec Firebase
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Connexion via Firebase Auth
      await firebaseAuth.loginWithEmail(email, password);
      
      // La mise à jour de l'utilisateur se fait via l'effet useEffect qui écoute les changements Firebase
      
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté",
      });
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

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      // Inscription via Firebase Auth
      const fbUser = await firebaseAuth.register(email, password);
      
      // Créer un profil utilisateur dans Firestore
      const userProfile: UserProfile = {
        email,
        name,
        role: 'user',
        devices: [getDeviceId()],
        lastLogin: new Date().toISOString(),
        lastLocation: await getLocation()
      };
      
      await firestoreService.users.create({
        ...userProfile,
        id: fbUser.uid
      });
      
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

  // Activer l'authentification à deux facteurs
  const enableTwoFactorAuth = async () => {
    setIsLoading(true);
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsTwoFactorEnabled(true);
      
      toast({
        title: "2FA activée",
        description: "L'authentification à deux facteurs a été activée pour votre compte.",
      });
      
      return;
    } catch (error) {
      console.error('Erreur d\'activation 2FA:', error);
      toast({
        title: "Échec de l'activation",
        description: "Impossible d'activer l'authentification à deux facteurs. Veuillez réessayer.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Vérifier le code 2FA
  const verifyTwoFactorCode = async (code: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Pour la démo, n'importe quel code à 6 chiffres est valide
      const isValid = /^\d{6}$/.test(code);
      
      if (isValid) {
        toast({
          title: "Code validé",
          description: "Code d'authentification validé avec succès.",
        });
      } else {
        toast({
          title: "Code invalide",
          description: "Le code d'authentification est invalide. Veuillez réessayer.",
          variant: "destructive"
        });
      }
      
      return isValid;
    } catch (error) {
      console.error('Erreur de vérification du code:', error);
      toast({
        title: "Erreur de vérification",
        description: "Impossible de vérifier le code. Veuillez réessayer.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading: isLoading || isFirebaseLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    resetPassword,
    enableTwoFactorAuth,
    verifyTwoFactorCode,
    isTwoFactorEnabled,
    checkDeviceLimit,
    getDeviceCount,
    MAX_DEVICES
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
