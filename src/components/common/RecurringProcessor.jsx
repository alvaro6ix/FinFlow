import { useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
// Asegúrate de que la ruta sea correcta y el archivo exista
import { processRecurringExpenses } from '../../utils/recurringEngine';

const RecurringProcessor = () => {
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.uid) {
      // Ejecutamos el motor en un contexto seguro
      const runEngine = async () => {
        try {
          console.log('🔄 Iniciando motor de recurrencia...');
          await processRecurringExpenses(user.uid);
          console.log('✅ Motor de recurrencia finalizado.');
        } catch (error) {
          console.error('⚠️ Error no crítico en motor de recurrencia:', error);
          // No hacemos nada más, para no molestar al usuario
        }
      };
      runEngine();
    }
  }, [user?.uid]);

  return null; // Este componente no renderiza nada visualmente
};

export default RecurringProcessor;