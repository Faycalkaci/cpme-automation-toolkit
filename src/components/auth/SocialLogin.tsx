
import React from 'react';
import { AuthDivider } from './dividers/AuthDivider';
import { GoogleButton } from './buttons/GoogleButton';
import { DomainErrorAlert } from './alerts/DomainErrorAlert';
import { CorsErrorAlert } from './alerts/CorsErrorAlert';
import { useGoogleAuth } from './hooks/useGoogleAuth';

export const SocialLogin: React.FC = () => {
  const { googleLoading, domainError, corsError, handleGoogleLogin } = useGoogleAuth();

  return (
    <>
      <AuthDivider />

      {domainError && <DomainErrorAlert />}
      {corsError && <CorsErrorAlert />}

      <div className="mt-4">
        <GoogleButton onClick={handleGoogleLogin} loading={googleLoading} />
      </div>
    </>
  );
};
