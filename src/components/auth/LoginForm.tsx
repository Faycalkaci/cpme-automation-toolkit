
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { PasswordInput } from './PasswordInput';
import { DemoAccounts } from './DemoAccounts';
import { loginFormSchema, LoginFormValues } from '@/pages/auth/loginSchema';
import { useAuth } from '@/contexts/AuthContext';
import { firestoreService } from '@/services/firebase/firestoreService';
import { Timestamp } from 'firebase/firestore';
import { Captcha } from './Captcha';
import { rateLimitService } from '@/services/rateLimitService';
import { LoginBlockedAlert } from './LoginBlockedAlert';
import { AttemptsRemainingAlert } from './AttemptsRemainingAlert';
import { ErrorAlert } from './ErrorAlert';
import { useTimeFormat } from './hooks/useTimeFormat';

export const LoginForm: React.FC = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isBlocked, setIsBlocked] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(5);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const formattedTime = useTimeFormat(timeRemaining);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Vérifier le statut de blocage et captcha au chargement
  useEffect(() => {
    const checkRateLimit = () => {
      const blocked = rateLimitService.isBlocked();
      setIsBlocked(blocked);
      
      if (blocked) {
        setTimeRemaining(rateLimitService.getTimeRemaining());
      }
    };
    
    checkRateLimit();
    
    // Vérifier si le captcha doit être affiché
    setShowCaptcha(rateLimitService.shouldShowCaptcha());
    
    // Mettre à jour le compteur toutes les secondes
    const timer = setInterval(() => {
      if (rateLimitService.isBlocked()) {
        setTimeRemaining(rateLimitService.getTimeRemaining());
      } else if (isBlocked) {
        setIsBlocked(false);
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isBlocked]);

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
      const rateLimit = rateLimitService.recordAttempt();
      setAttemptsLeft(rateLimit.attemptsLeft);
      
      if (rateLimit.blocked) {
        setIsBlocked(true);
        setTimeRemaining(rateLimitService.getTimeRemaining());
        return;
      }
      
      // Vérifier si le captcha doit être affiché après cette tentative
      setShowCaptcha(rateLimitService.shouldShowCaptcha());
      
      // Login avec Firebase Auth
      const loginResult = await login(data.email, data.password);
      
      // Si la connexion est réussie, réinitialiser la limitation
      if (loginResult) {
        rateLimitService.resetOnSuccess();
        
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
      
      // Le captcha est géré automatiquement par le service de limitation de requêtes
      setShowCaptcha(rateLimitService.shouldShowCaptcha());
    }
  };

  const handleCaptchaVerify = (success: boolean) => {
    setCaptchaVerified(success);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {loginError && <ErrorAlert error={loginError} />}
        
        {isBlocked && <LoginBlockedAlert timeRemaining={formattedTime} />}
        
        {!isBlocked && attemptsLeft < 3 && (
          <AttemptsRemainingAlert attemptsLeft={attemptsLeft} />
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                  placeholder="exemple@cpmetool.fr" 
                  type="email" 
                  autoComplete="email"
                  {...field} 
                  disabled={isBlocked}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mot de passe</FormLabel>
              <FormControl>
                <PasswordInput {...field} disabled={isBlocked} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {showCaptcha && (
          <Captcha 
            onVerify={handleCaptchaVerify} 
            isRequired={true} 
          />
        )}

        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-sm text-primary hover:underline">
            Mot de passe oublié ?
          </Link>
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading || isBlocked || (showCaptcha && !captchaVerified)}
        >
          {isLoading ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Connexion en cours...
            </>
          ) : (
            'Se connecter'
          )}
        </Button>
      </form>
      
      <DemoAccounts form={form} />
    </Form>
  );
};
