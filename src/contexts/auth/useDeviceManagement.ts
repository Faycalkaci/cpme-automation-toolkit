
import { User } from './types';

export const useDeviceManagement = (user: User | null, MAX_DEVICES: number) => {
  // Check device limit
  const checkDeviceLimit = () => {
    if (!user || !user.devices) return true;
    return user.devices.length < MAX_DEVICES;
  };

  // Get device count
  const getDeviceCount = () => {
    if (!user || !user.devices) return 0;
    return user.devices.length;
  };

  return {
    checkDeviceLimit,
    getDeviceCount
  };
};
