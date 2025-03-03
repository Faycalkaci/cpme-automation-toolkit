
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

type UserRole = 'super-admin' | 'admin' | 'user' | null;

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organizationId?: string;
  organizationName?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
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
  const { toast } = useToast();

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Simulate auth check with localStorage
        const storedUser = localStorage.getItem('cpme-user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Authentication error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Mock login function - would be replaced with actual API calls
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data based on email
      let mockUser: User;
      
      if (email === 'super@cpmetool.fr') {
        mockUser = {
          id: '1',
          email,
          name: 'Super Admin',
          role: 'super-admin'
        };
      } else if (email.includes('admin')) {
        mockUser = {
          id: '2',
          email,
          name: 'CPME Admin',
          role: 'admin',
          organizationId: '93',
          organizationName: 'CPME Seine-Saint-Denis'
        };
      } else {
        mockUser = {
          id: '3',
          email,
          name: 'Standard User',
          role: 'user',
          organizationId: '93',
          organizationName: 'CPME Seine-Saint-Denis'
        };
      }
      
      // Save to localStorage
      localStorage.setItem('cpme-user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      toast({
        title: "Connexion réussie",
        description: `Bienvenue, ${mockUser.name}`,
      });
    } catch (error) {
      console.error('Login error:', error);
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real scenario, this would create the user and return data
      // For demo, we'll just simulate success
      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé. Veuillez vous connecter.",
      });
    } catch (error) {
      console.error('Registration error:', error);
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
    localStorage.removeItem('cpme-user');
    setUser(null);
    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté avec succès.",
    });
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Email envoyé",
        description: "Instructions de réinitialisation du mot de passe envoyées à votre adresse email.",
      });
    } catch (error) {
      console.error('Password reset error:', error);
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

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    resetPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
