
import { useState } from 'react';
import { User, UserRole } from './types';
import { useFirebase } from '../FirebaseContext';
import { useToast } from '@/components/ui/use-toast';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
  const { toast } = useToast();
  const { userProfile, isLoading: isFirebaseLoading } = useFirebase();
  
  const MAX_DEVICES = 3; // Limite maximale d'appareils connectés par compte

  return {
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
  };
};
