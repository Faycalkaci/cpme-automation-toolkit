
import React from 'react';
import LicenseCard from './LicenseCard';
import { License } from './types';

interface LicenseListProps {
  licenses: License[];
  onRenew: (id: string) => void;
  onSuspend: (id: string) => void;
}

const LicenseList: React.FC<LicenseListProps> = ({ 
  licenses, 
  onRenew, 
  onSuspend 
}) => {
  if (licenses.length === 0) {
    return (
      <div className="text-center py-10 bg-slate-50 rounded-lg">
        <p className="text-slate-500">Aucune licence trouvée</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {licenses.map((license) => (
        <LicenseCard 
          key={license.id}
          license={license}
          onRenew={onRenew}
          onSuspend={onSuspend}
        />
      ))}
    </div>
  );
};

export default LicenseList;
