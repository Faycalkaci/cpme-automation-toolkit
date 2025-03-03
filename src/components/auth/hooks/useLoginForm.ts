
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { loginFormSchema, LoginFormValues } from '@/pages/auth/loginSchema';
import { useAuth } from '@/contexts/AuthContext';
import { firestoreService } from '@/services/firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import { useRateLimit } from './useRateLimit';

export const useLoginForm = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  const {
    isBlocked,
    attemptsLeft,
    timeRemaining,
    showCaptcha,
    recordAttempt,
    resetOnSuccess
  } = useRateLimit();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoginError(null);
    
    // Validation supplémentaire des entrées
    if (!data.email || !data.password) {
      setLoginError("Veuillez remplir tous les champs");
      return;
    }
    
    // Sanitization simple des entrées
    const sanitizedEmail = data.email.trim().toLowerCase();
    
    // Vérifier si l'utilisateur est bloqué
    if (isBlocked) {
      return;
    }
    
    // Vérifier si le captcha est requis et validé
    if (showCaptcha && !captchaVerified) {
      setLoginError("Veuillez valider le captcha avant de vous connecter.");
      return;
    }
    
    try {
      // Enregistrer une tentative
      const isUserBlocked = recordAttempt();
      
      if (isUserBlocked) {
        return;
      }
      
      // Login avec Firebase Auth
      const loginResult = await login(sanitizedEmail, data.password);
      
      // Si la connexion est réussie, réinitialiser la limitation
      if (loginResult) {
        resetOnSuccess();
        
        // Mise à jour du profil utilisateur - ne pas bloquer en cas d'erreur
        try {
          const userProfile = await firestoreService.users.getByEmail(sanitizedEmail);
          
          if (userProfile) {
            // Vérification de cohérence des identifiants
            if (userProfile.uid && userProfile.uid !== loginResult.uid) {
              console.error("Incohérence d'identifiants détectée");
              throw new Error("Erreur de sécurité: identifiants incohérents");
            }
            
            // Mettre à jour les informations de dernière connexion
            await firestoreService.users.update(userProfile.id!, {
              lastLogin: Timestamp.now(),
              lastLocation: userProfile.lastLocation || '',
              authProvider: 'email',
              uid: loginResult.uid // S'assurer que l'UID est toujours à jour
            });
          }
        } catch (profileError) {
          console.warn("Erreur lors de la mise à jour du profil, mais la connexion continue:", profileError);
        }
        
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Messages d'erreur plus sécurisés (ne pas révéler si l'email existe)
      let errorMessage = "Identifiants incorrects ou compte inexistant.";
      
      if (error.code === 'auth/too-many-requests') {
        errorMessage = "Trop de tentatives. Veuillez réessayer plus tard.";
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = "Problème de connexion réseau. Vérifiez votre connexion internet.";
      }
      
      setLoginError(errorMessage);
    }
  };

  const handleCaptchaVerify = (success: boolean) => {
    setCaptchaVerified(success);
  };

  return {
    form,
    isLoading,
    isBlocked,
    attemptsLeft,
    timeRemaining,
    showCaptcha,
    captchaVerified,
    loginError,
    onSubmit: form.handleSubmit(onSubmit),
    handleCaptchaVerify,
  };
};
