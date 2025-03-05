
import React from 'react';
import DocumentsContainer from '@/components/documents/DocumentsContainer';
import { useLicenseGuard } from '@/services/guards/licenseGuard';
import { Spinner } from '@/components/ui/spinner';

const Documents = () => {
  const { isAuthorized, isLoading } = useLicenseGuard('documents');

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Component will redirect via the license guard
  }

  return (
    <div className="w-full max-w-full">
      <DocumentsContainer />
    </div>
  );
};

export default Documents;
