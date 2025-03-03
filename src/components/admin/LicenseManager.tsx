
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useLicenses } from './licenses/useLicenses';
import LicenseCard from './licenses/LicenseCard';
import AddLicenseDialog from './licenses/AddLicenseDialog';

const LicenseManager: React.FC = () => {
  const { licenses, addLicense, renewLicense, suspendLicense } = useLicenses();
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des Licences</h2>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" /> Ajouter une licence
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {licenses.map((license) => (
          <LicenseCard 
            key={license.id}
            license={license}
            onRenew={renewLicense}
            onSuspend={suspendLicense}
          />
        ))}
      </div>
      
      <AddLicenseDialog 
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAddLicense={addLicense}
      />
    </div>
  );
};

export default LicenseManager;
