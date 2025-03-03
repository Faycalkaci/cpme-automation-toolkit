
// Generate a unique ID for the device
export const getDeviceId = (): string => {
  let deviceId = localStorage.getItem('cpme-device-id');
  if (!deviceId) {
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('cpme-device-id', deviceId);
  }
  return deviceId;
};

// Get the user's geolocation
export const getLocation = async (): Promise<string> => {
  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
    return `${position.coords.latitude},${position.coords.longitude}`;
  } catch (error) {
    console.error('Erreur de géolocalisation:', error);
    return 'Localisation inconnue';
  }
};
