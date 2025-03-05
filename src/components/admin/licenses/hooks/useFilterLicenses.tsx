
import { useState, useMemo } from 'react';
import { License } from '@/services/firebase/firestore/types';
import { FilterOptions } from '../LicenseFilter';

export const useFilterLicenses = (licenses: License[]) => {
  const [filters, setFilters] = useState<FilterOptions>({
    status: 'all',
    search: '',
  });

  const filteredLicenses = useMemo(() => {
    return licenses.filter(license => {
      // Filter by status
      if (filters.status !== 'all' && license.status !== filters.status) {
        return false;
      }
      
      // Filter by search term (CPME name)
      if (filters.search && !license.cpme?.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  }, [licenses, filters]);

  return {
    filters,
    setFilters,
    filteredLicenses
  };
};
