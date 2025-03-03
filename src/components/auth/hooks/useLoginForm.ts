
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { loginFormSchema, LoginFormValues } from '@/pages/auth/loginSchema';
import { useAuth } from '@/contexts/AuthContext';
import { firestoreService } from '@/services/firebase/firestoreService';
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
      const loginResult = await login(data.email, data.password);
      
      // Si la connexion est réussie, réinitialiser la limitation
      if (loginResult) {
        resetOnSuccess();
        
        // Mise à jour du profil utilisateur
        const userProfile = await firestoreService.users.getByEmail(data.email);
        
        if (userProfile) {
          // Mettre à jour les informations de dernière connexion
          await firestoreService.users.update(userProfile.id!, {
            lastLogin: Timestamp.now(),
            lastLocation: userProfile.lastLocation || ''
          });
        }
        
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setLoginError(error.message || "Erreur lors de la connexion. Vérifiez vos identifiants.");
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
