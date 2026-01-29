import { useState, useEffect } from 'react';

/**
 * Hook personalizado para detectar el estado de la conexión a internet.
 * Cumple con el requerimiento 8.1 (Detección de estado online/offline).
 */
const useOnline = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Log para depuración en desarrollo
      console.log('🟢 FinFlow: Conexión restaurada. Sincronizando datos...');
    };

    const handleOffline = () => {
      setIsOnline(false);
      console.log('🔴 FinFlow: Modo Offline activado. Los cambios se guardarán localmente.');
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