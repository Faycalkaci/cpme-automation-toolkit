
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
}

export interface License {
  id: string;
  key: string;
  status: 'active' | 'expired' | 'pending' | 'revoked';
  userId: string;
  userName: string;
  productId: string;
  productName: string;
  createdAt: string;
  expiresAt: string;
  seats: number;
  usedSeats: number;
  plan: 'basic' | 'premium' | 'enterprise';
  autoRenew: boolean;
  stripeSubscriptionId?: string;  // Added this property to fix build errors
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'super-admin' | 'admin' | 'user';
  licenses: License[];
}
