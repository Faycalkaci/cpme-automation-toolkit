
import { useFetchLicenses } from './hooks/useFetchLicenses';
import { useAddLicense } from './hooks/useAddLicense';
import { useRenewLicense } from './hooks/useRenewLicense';
import { useSuspendLicense } from './hooks/useSuspendLicense';
import { License } from './types';

export const useLicenses = () => {
  const { licenses, setLicenses, isLoading } = useFetchLicenses();
  const { addLicense, isAdding } = useAddLicense(licenses, setLicenses);
  const { renewLicense, isRenewing } = useRenewLicense(licenses, setLicenses);
  const { suspendLicense, isSuspending } = useSuspendLicense(licenses, setLicenses);

  return {
    licenses,
    isLoading,
    isAdding,
    isRenewing,
    isSuspending,
    addLicense,
    renewLicense,
    suspendLicense
  };
};
