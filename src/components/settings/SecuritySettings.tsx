
import React from 'react';
import PasswordManagement from './security/PasswordManagement';
import TwoFactorAuth from './security/TwoFactorAuth';
import SecurityAlert from './security/SecurityAlert';

const SecuritySettings = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Password Change Card */}
        <PasswordManagement />
        
        {/* Two-Factor Auth Card */}
        <TwoFactorAuth />
      </div>
      
      {/* Security Alert */}
      <div className="mt-6">
        <SecurityAlert />
      </div>
    </>
  );
};

export default SecuritySettings;
