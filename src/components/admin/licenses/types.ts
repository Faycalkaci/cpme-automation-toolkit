
export type License = {
  id: string;
  cpme: string;
  plan: 'standard' | 'pro' | 'enterprise';
  status: 'active' | 'expired' | 'pending';
  users: number;
  maxUsers: number;
  startDate: string;
  endDate: string;
};
