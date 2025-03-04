
import React, { createContext, useContext, useEffect } from 'react';
import { AuthContextType, User } from './types';
import { useAuthState } from './useAuthState';
import { useAuthMethods } from './useAuthMethods';
import { useTwoFactorAuth } from './useTwoFactorAuth';
import { useDeviceManagement } from './useDeviceManagement';
import { getDeviceId, getLocation } from './authUtils';
import { Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from '@/services/firebase/config';
import { initializeApp } from 'firebase/app';

// Initialize Firebase if it hasn't been initialized yet
let firebaseApp;
try {
  firebaseApp = initializeApp(firebaseConfig);
} catch (error) {
  // App already initialized, ignore
  console.debug("Firebase already initialized");
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
  const { 
    user, 
    setUser, 
    isLoading, 
    setIsLoading, 
    isTwoFactorEnabled, 
    setIsTwoFactorEnabled, 
    toast, 
    userProfile, 
    isFirebaseLoading,
    MAX_DEVICES 
  } = useAuthState();

  const { login, register, logout, resetPassword } = useAuthMethods(
    setUser, 
    setIsLoading, 
    setIsTwoFactorEnabled, 
    toast, 
    user
  );

  const { enableTwoFactorAuth, verifyTwoFactorCode } = useTwoFactorAuth(
    setIsLoading, 
    setIsTwoFactorEnabled, 
    toast
  );

  const { checkDeviceLimit, getDeviceCount } = useDeviceManagement(
    user, 
    MAX_DEVICES
  );

  useEffect(() => {
    if (!isFirebaseLoading && userProfile) {
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
  }, [isFirebaseLoading, userProfile, setUser, setIsLoading]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!userProfile) {
          const storedUser = localStorage.getItem('cpme-user');
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            
            const deviceId = getDeviceId();
            if (!parsedUser.devices) {
              parsedUser.devices = [deviceId];
            } else if (!parsedUser.devices.includes(deviceId)) {
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
            
            parsedUser.lastLogin = new Date().toISOString();
            
            // Safe location tracking with error handling
            try {
              parsedUser.lastLocation = await getLocation();
            } catch (locationError) {
              console.error("Location access error:", locationError);
              parsedUser.lastLocation = "Unknown";
            }
            
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
  }, [toast, isFirebaseLoading, userProfile, isLoading, setUser, setIsLoading, MAX_DEVICES]);

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
