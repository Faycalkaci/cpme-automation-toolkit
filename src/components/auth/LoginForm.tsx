
import React from 'react';
import { Form } from '@/components/ui/form';
import { Captcha } from './Captcha';
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
    showCaptcha,
    captchaVerified,
    loginError,
    onSubmit,
    handleCaptchaVerify
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

      {showCaptcha && (
        <Captcha 
          onVerify={handleCaptchaVerify} 
          isRequired={true} 
        />
      )}

      <LoginFormFields 
        form={form}
        isLoading={isLoading}
        isBlocked={isBlocked}
        showCaptcha={showCaptcha}
        captchaVerified={captchaVerified}
        onSubmit={onSubmit}
      />
      
      <DemoAccounts form={form} />
    </Form>
  );
};
