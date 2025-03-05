
import React from 'react';
import { Form } from '@/components/ui/form';
import { DemoAccounts } from './DemoAccounts';
import { LoginFormFields } from './LoginFormFields';
import { LoginAlerts } from './LoginAlerts';
import { useLoginForm } from './hooks/useLoginForm';
import { useTimeFormat } from './hooks/useTimeFormat';

export const LoginForm: React.FC = () => {
  const {
    form,
    isLoading,
    isBlocked,
    attemptsLeft,
    timeRemaining,
    loginError,
    onSubmit
  } = useLoginForm();
  
  const formattedTime = useTimeFormat(timeRemaining);

  return (
    <Form {...form}>
      <LoginAlerts 
        loginError={loginError}
        isBlocked={isBlocked}
        timeRemaining={formattedTime}
        attemptsLeft={attemptsLeft}
      />

      <LoginFormFields 
        form={form}
        isLoading={isLoading}
        isBlocked={isBlocked}
        onSubmit={onSubmit}
      />
      
      <DemoAccounts form={form} />
    </Form>
  );
};
