
import React from 'react';
import { Button } from '@/components/ui/button';
import { UseFormReturn } from 'react-hook-form';
import { LoginFormValues } from '@/pages/auth/loginSchema';

interface DemoAccountsProps {
  form: UseFormReturn<LoginFormValues>;
}

export const DemoAccounts: React.FC<DemoAccountsProps> = ({ form }) => {
  return (
    <div className="mt-8 pt-6 border-t border-slate-100">
      <p className="text-sm text-slate-500 mb-2 text-center font-medium">Comptes de démonstration</p>
      <div className="grid grid-cols-1 gap-2">
        <Button 
          variant="outline" 
          size="sm"
          className="text-sm justify-start"
          onClick={() => {
            form.setValue('email', 'super@cpmetool.fr');
            form.setValue('password', 'password123');
          }}
        >
          Super Admin: super@cpmetool.fr
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="text-sm justify-start"
          onClick={() => {
            form.setValue('email', 'admin@cpmetool.fr');
            form.setValue('password', 'password123');
          }}
        >
          Admin CPME: admin@cpmetool.fr
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="text-sm justify-start"
          onClick={() => {
            form.setValue('email', 'user@cpmetool.fr');
            form.setValue('password', 'password123');
          }}
        >
          Utilisateur: user@cpmetool.fr
        </Button>
      </div>
    </div>
  );
};
