
import React from 'react';

export const AuthDivider: React.FC = () => {
  return (
    <div className="mt-4 relative">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-slate-200"></div>
      </div>
      <div className="relative flex justify-center text-xs">
        <span className="px-2 bg-white text-slate-500">ou</span>
      </div>
    </div>
  );
};
