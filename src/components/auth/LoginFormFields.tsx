
import React from 'react';
import { Link } from 'react-router-dom';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { PasswordInput } from './PasswordInput';
import { UseFormReturn } from 'react-hook-form';
import { LoginFormValues } from '@/pages/auth/loginSchema';

interface LoginFormFieldsProps {
  form: UseFormReturn<LoginFormValues>;
  isLoading: boolean;
  isBlocked: boolean;
  showCaptcha: boolean;
  captchaVerified: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const LoginFormFields: React.FC<LoginFormFieldsProps> = ({
  form,
  isLoading,
  isBlocked,
  showCaptcha,
  captchaVerified,
  onSubmit
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
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
  );
};
