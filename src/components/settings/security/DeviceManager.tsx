
import React from 'react';
import { AlertTriangle, Smartphone } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';

const DeviceManager = () => {
  const { getDeviceCount, MAX_DEVICES } = useAuth();
  
  const deviceCount = getDeviceCount();
  const deviceLimit = MAX_DEVICES;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Smartphone className="h-5 w-5 text-slate-500" />
        <Label>Appareils connectés</Label>
      </div>
      
      <div className="p-3 rounded-md bg-slate-50">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Limite d'appareils</span>
          <span className="text-sm">{deviceCount} / {deviceLimit}</span>
        </div>
        
        <div className="h-2 bg-slate-200 rounded-full">
          <div 
            className={`h-2 rounded-full ${
              deviceCount === deviceLimit ? 'bg-red-500' : 'bg-green-500'
            }`} 
            style={{ width: `${(deviceCount / deviceLimit) * 100}%` }}
          ></div>
        </div>
        
        {deviceCount === deviceLimit && (
          <p className="text-xs text-amber-600 mt-2 flex items-center">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Vous avez atteint la limite d'appareils autorisés
          </p>
        )}
      </div>
    </div>
  );
};

export default DeviceManager;
