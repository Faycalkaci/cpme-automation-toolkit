
import React, { useState } from 'react';
import { useLicenses } from './licenses/useLicenses';
import AddLicenseDialog from './licenses/AddLicenseDialog';
import LicenseHeader from './licenses/LicenseHeader';
import LicenseFilter from './licenses/LicenseFilter';
import LicenseList from './licenses/LicenseList';
import { useFilterLicenses } from './licenses/hooks/useFilterLicenses';
import { License } from '@/services/firebase/firestore/types';

const LicenseManager: React.FC = () => {
  const { licenses, addLicense, renewLicense, suspendLicense } = useLicenses();
  const { filters, setFilters, filteredLicenses } = useFilterLicenses(licenses);
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  const handleAddLicenseClick = () => {
    setShowAddDialog(true);
  };

  // Create a wrapper function to handle the type difference
  const handleAddLicense = (license: Omit<License, 'id' | 'status' | 'users'>) => {
    addLicense(license);
  };
  
  return (
    <div className="space-y-6">
      <LicenseHeader onAddLicense={handleAddLicenseClick} />
      
      <LicenseFilter 
        filters={filters}
        onFilterChange={setFilters}
      />
      
      <LicenseList 
        licenses={filteredLicenses}
        onRenew={renewLicense}
        onSuspend={suspendLicense}
      />
      
      <AddLicenseDialog 
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAddLicense={handleAddLicense}
      />
    </div>
  );
};

export default LicenseManager;
