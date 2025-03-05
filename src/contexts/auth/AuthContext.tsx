
import React, { createContext, useContext, useEffect } from 'react';
import { AuthContextType, User } from './types';
import { useAuthState } from './useAuthState';
import { useAuthMethods } from './useAuthMethods';
import { useTwoFactorAuth } from './useTwoFactorAuth';
import { useDeviceManagement } from './useDeviceManagement';
import { getDeviceId, getLocation } from './authUtils';

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
      try {
        console.log('User profile loaded from Firebase:', userProfile.email);
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
        console.log('User set in context:', convertedUser.email, 'role:', convertedUser.role);
        setIsLoading(false);
      } catch (error) {
        console.error('Error setting user from profile:', error);
        setUser(null);
        setIsLoading(false);
      }
    } else if (!isFirebaseLoading) {
      console.log('No user profile found in Firebase, setting user to null');
      setUser(null);
      setIsLoading(false);
    }
  }, [isFirebaseLoading, userProfile, setUser, setIsLoading]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!userProfile) {
          console.log('No Firebase user profile, checking localStorage');
          const storedUser = localStorage.getItem('cpme-user');
          if (storedUser) {
            console.log('Found user in localStorage');
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
            parsedUser.lastLocation = await getLocation();
            
            localStorage.setItem('cpme-user', JSON.stringify(parsedUser));
            console.log('Updated user in localStorage and setting in context');
            setUser(parsedUser);
          } else {
            console.log('No user found in localStorage');
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
