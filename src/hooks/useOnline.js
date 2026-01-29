import { useState, useEffect } from 'react';

const useOnline = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      console.log('🟢 Conexión restaurada');
    };

    const handleOffline = () => {
      setIsOnline(false);
      console.log('🔴 Sin conexión');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

export default useOnline;