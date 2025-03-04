
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Spinner } from '@/components/ui/spinner';

interface PaymentRequiredRouteProps {
  children?: React.ReactNode;
}

const PaymentRequiredRoute: React.FC<PaymentRequiredRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" className="text-primary" />
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (!user.hasPaid) {
    return <Navigate to="/billing" />;
  }
  
  return children ? <>{children}</> : <Outlet />;
};

export default PaymentRequiredRoute;
