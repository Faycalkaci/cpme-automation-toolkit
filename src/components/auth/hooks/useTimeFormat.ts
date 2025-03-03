
import { useState, useEffect } from 'react';

/**
 * Hook pour formater un temps en secondes en format minutes:secondes
 */
export const useTimeFormat = (seconds: number) => {
  const [formattedTime, setFormattedTime] = useState<string>('');

  useEffect(() => {
    const formatTime = (timeInSeconds: number) => {
      const minutes = Math.floor(timeInSeconds / 60);
      const secs = timeInSeconds % 60;
      return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    setFormattedTime(formatTime(seconds));
  }, [seconds]);

  return formattedTime;
};
