
import { useFetchLicenses } from './hooks/useFetchLicenses';
import { useAddLicense } from './hooks/useAddLicense';
import { useRenewLicense } from './hooks/useRenewLicense';
import { useSuspendLicense } from './hooks/useSuspendLicense';
import { License } from '@/services/firebase/firestore/types';

export const useLicenses = () => {
  const { licenses, setLicenses, isLoading, error, refreshLicenses } = useFetchLicenses();
  const { addLicense, isAdding, addError } = useAddLicense(licenses, setLicenses);
  const { renewLicense, isRenewing, renewError } = useRenewLicense(licenses, setLicenses);
  const { suspendLicense, isSuspending, suspensionError } = useSuspendLicense(licenses, setLicenses);

  return {
    licenses,
    isLoading,
    error,
    isAdding,
    isRenewing,
    isSuspending,
    addError,
    renewError,
    suspensionError,
    addLicense,
    renewLicense,
    suspendLicense,
    refreshLicenses
  };
};
