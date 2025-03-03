
export const getBadgeColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-500/10 text-green-600 border-green-200';
    case 'expired':
      return 'bg-red-500/10 text-red-600 border-red-200';
    case 'pending':
      return 'bg-orange-500/10 text-orange-600 border-orange-200';
    default:
      return 'bg-slate-100 text-slate-800';
  }
};
