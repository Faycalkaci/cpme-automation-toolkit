
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { LoginFormValues } from '@/pages/auth/loginSchema';

interface PasswordInputProps {
  form: UseFormReturn<LoginFormValues>;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({ form }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <FormField
      control={form.control}
      name="password"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Mot de passe</FormLabel>
          <FormControl>
            <div className="relative">
              <Input 
                placeholder="••••••••" 
                type={showPassword ? "text" : "password"} 
                autoComplete="current-password"
                {...field} 
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
