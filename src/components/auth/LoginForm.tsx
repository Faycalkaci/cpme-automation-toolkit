
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { loginFormSchema, LoginFormValues } from '@/pages/auth/loginSchema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { useToast } from '@/components/ui/use-toast';
import { DemoAccounts } from './DemoAccounts';
import { PasswordInput } from './PasswordInput';
import { firebaseAuth } from '@/services/firebase/firebaseService';
import { firestoreService } from '@/services/firebase/firestoreService';
import { useFirebase } from '@/contexts/FirebaseContext';

export const LoginForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { refreshProfile } = useFirebase();
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });
  
  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      // Authenticate with Firebase
      const user = await firebaseAuth.loginWithEmail(values.email, values.password);
      
      // Check if user profile exists in Firestore
      const userProfile = await firestoreService.users.getByEmail(user.email || '');
      
      if (!userProfile && user.email) {
        // Create a new user profile if none exists
        await firestoreService.users.create({
          email: user.email,
          name: user.displayName || user.email.split('@')[0],
          role: 'user', // Default role
          devices: [],
          lastLogin: new Date().toISOString(),
          createdAt: new Date(),
          updatedAt: new Date()
        });
      } else if (userProfile) {
        // Update last login timestamp
        await firestoreService.users.update(userProfile.id!, {
          lastLogin: new Date().toISOString()
        });
      }
      
      // Refresh user profile in context
      await refreshProfile();

      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté",
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error during login:', error);
      
      toast({
        title: "Échec de la connexion",
        description: error.message || "Identifiants incorrects. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" aria-label="Formulaire de connexion">
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
          Email
        </label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          {...form.register('email')}
          aria-invalid={!!form.formState.errors.email}
          disabled={isLoading}
        />
        {form.formState.errors.email && (
          <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="block text-sm font-medium text-slate-700">
            Mot de passe
          </label>
          <Link to="/reset-password" className="text-sm text-primary hover:underline">
            Mot de passe oublié ?
          </Link>
        </div>
        <PasswordInput
          id="password"
          autoComplete="current-password"
          {...form.register('password')}
          aria-invalid={!!form.formState.errors.password}
          disabled={isLoading}
        />
        {form.formState.errors.password && (
          <p className="text-red-500 text-sm mt-1">{form.formState.errors.password.message}</p>
        )}
      </div>
      
      <Button 
        type="submit" 
        className="w-full"
        disabled={isLoading}
        aria-label="Se connecter"
      >
        {isLoading ? (
          <>
            <Spinner size="sm" className="mr-2" />
            Connexion en cours...
          </>
        ) : (
          "Se connecter"
        )}
      </Button>
      
      <DemoAccounts form={form} />
    </form>
  );
};
