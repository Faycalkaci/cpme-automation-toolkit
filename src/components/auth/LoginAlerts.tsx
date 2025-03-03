
import React from 'react';
import { ErrorAlert } from './ErrorAlert';
import { LoginBlockedAlert } from './LoginBlockedAlert';
import { AttemptsRemainingAlert } from './AttemptsRemainingAlert';

interface LoginAlertsProps {
  loginError: string | null;
  isBlocked: boolean;
  timeRemaining: string;
  attemptsLeft: number;
}

export const LoginAlerts: React.FC<LoginAlertsProps> = ({
  loginError,
  isBlocked,
  timeRemaining,
  attemptsLeft
}) => {
  return (
    <>
      {loginError && <ErrorAlert error={loginError} />}
      
      {isBlocked && <LoginBlockedAlert timeRemaining={timeRemaining} />}
      
      {!isBlocked && attemptsLeft < 3 && (
        <AttemptsRemainingAlert attemptsLeft={attemptsLeft} />
      )}
    </>
  );
};
