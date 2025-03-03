
import { useState } from 'react';
import { toast } from 'sonner';
import { License } from './types';

export const useLicenses = () => {
  const [licenses, setLicenses] = useState<License[]>([
    {
      id: '1',
      cpme: 'CPME Seine-Saint-Denis (93)',
      plan: 'enterprise',
      status: 'active',
      users: 3,
      maxUsers: 3,
      startDate: '2023-01-15',
      endDate: '2024-01-15'
    },
    {
      id: '2',
      cpme: 'CPME Paris (75)',
      plan: 'pro',
      status: 'active',
      users: 1,
      maxUsers: 1,
      startDate: '2023-03-22',
      endDate: '2024-03-22'
    },
    {
      id: '3',
      cpme: 'CPME Val-de-Marne (94)',
      plan: 'standard',
      status: 'expired',
      users: 1,
      maxUsers: 1,
      startDate: '2023-02-10',
      endDate: '2023-12-10'
    },
    {
      id: '4',
      cpme: 'CPME Hauts-de-Seine (92)',
      plan: 'pro',
      status: 'pending',
      users: 0,
      maxUsers: 1,
      startDate: '2024-01-01',
      endDate: '2025-01-01'
    }
  ]);

  const addLicense = (license: Omit<License, 'id' | 'status' | 'users'>) => {
    // Update max users based on plan
    let maxUsers = 1; // Default for standard and pro
    if (license.plan === 'enterprise') {
      maxUsers = 3;
    }
    
    const newLicense: License = {
      id: Date.now().toString(),
      cpme: license.cpme,
      plan: license.plan,
      status: 'active',
      users: 0,
      maxUsers,
      startDate: license.startDate,
      endDate: license.endDate
    };
    
    setLicenses([...licenses, newLicense]);
    
    toast.success('Licence ajoutée avec succès', {
      description: `La licence pour "${newLicense.cpme}" a été créée.`
    });

    return newLicense;
  };
  
  const renewLicense = (licenseId: string) => {
    setLicenses(licenses.map(license => {
      if (license.id === licenseId) {
        const newEndDate = new Date(new Date(license.endDate).setFullYear(new Date(license.endDate).getFullYear() + 1)).toISOString().split('T')[0];
        return {
          ...license,
          status: 'active',
          endDate: newEndDate
        };
      }
      return license;
    }));
    
    toast.success('Licence renouvelée', {
      description: `La licence a été prolongée d'un an.`
    });
  };
  
  const suspendLicense = (licenseId: string) => {
    setLicenses(licenses.map(license => {
      if (license.id === licenseId) {
        return {
          ...license,
          status: 'expired'
        };
      }
      return license;
    }));
    
    toast.success('Licence suspendue', {
      description: `L'accès a été temporairement désactivé.`
    });
  };

  return {
    licenses,
    addLicense,
    renewLicense,
    suspendLicense
  };
};
