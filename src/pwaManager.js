import { registerSW } from 'virtual:pwa-register';

export function registerPWA() {
  // Intervalo para buscar actualizaciones cada hora (opcional, pero recomendado)
  const intervalMS = 60 * 60 * 1000;

  const updateSW = registerSW({
    onNeedRefresh() {
      // Como pusimos 'autoUpdate' en vite.config, esto pasará mayormente automático,
      // pero aquí podríamos mostrar un aviso si quisiéramos.
      console.log("Nueva versión disponible. Actualizando...");
    },
    onOfflineReady() {
      console.log("FinFlow está lista para usarse sin internet.");
    },
    onRegisterError(error) {
      console.error("Error al registrar el Service Worker", error);
    }
  });
}